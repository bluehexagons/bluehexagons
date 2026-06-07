package store

import (
	"bytes"
	"context"
	"crypto/rand"
	"database/sql"
	"encoding/base64"
	"errors"
	"image"
	_ "image/gif"
	"image/jpeg"
	_ "image/png"
	"io"
	"math"
	"mime"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"bluehexagons.com/server/internal/auth"
	"bluehexagons.com/server/internal/httpx"
)

const (
	maxUploadBytes        int64 = 10 << 30 // large enough for game archives; proxies should set tighter operator limits.
	maxLinkedPreviewBytes int64 = 20 << 20
	linkedHTTPTimeout           = 15 * time.Second
	previewThumbMaxWidth        = 960
	previewThumbMaxHeight       = 540
	maxSourceURLLen             = 2048
)

type addAssetLinkRequest struct {
	Role      string `json:"role"`
	Filename  string `json:"filename"`
	URL       string `json:"url"`
	SortOrder int64  `json:"sort_order"`
}

type storedAsset struct {
	ProductAsset
	StorageName string
}

func assetURL(id int64, role string) string {
	if role == "download" {
		return "/api/assets/" + strconv.FormatInt(id, 10) + "/download"
	}
	return "/api/assets/" + strconv.FormatInt(id, 10) + "/preview"
}

func (h *Handler) adminUploadAsset(w http.ResponseWriter, r *http.Request) error {
	productID, err := pathID(r, "id")
	if err != nil {
		return err
	}
	if err := ensureProductExists(r.Context(), h.db, productID); err != nil {
		return err
	}

	r.Body = http.MaxBytesReader(w, r.Body, maxUploadBytes)
	if err := r.ParseMultipartForm(32 << 20); err != nil {
		return httpx.Errorf(http.StatusBadRequest, "invalid upload")
	}
	role := strings.ToLower(strings.TrimSpace(r.FormValue("role")))
	if role != "preview" && role != "download" {
		return httpx.Errorf(http.StatusBadRequest, "asset role must be preview or download")
	}
	sortOrder, _ := strconv.ParseInt(strings.TrimSpace(r.FormValue("sort_order")), 10, 64)

	file, header, err := r.FormFile("file")
	if err != nil {
		return httpx.Errorf(http.StatusBadRequest, "file is required")
	}
	defer file.Close()

	filename := cleanFilename(header.Filename)
	storageName, err := randomStorageName(filename)
	if err != nil {
		return err
	}
	if err := os.MkdirAll(h.cfg.ShopUploadDir(), 0o700); err != nil {
		return err
	}
	destPath := filepath.Join(h.cfg.ShopUploadDir(), storageName)
	dest, err := os.OpenFile(destPath, os.O_CREATE|os.O_EXCL|os.O_WRONLY, 0o600)
	if err != nil {
		return err
	}

	probe := make([]byte, 512)
	n, readErr := file.Read(probe)
	if readErr != nil && !errors.Is(readErr, io.EOF) {
		dest.Close()
		_ = os.Remove(destPath)
		return readErr
	}
	contentType := strings.TrimSpace(header.Header.Get("Content-Type"))
	if contentType == "" || contentType == "application/octet-stream" {
		contentType = http.DetectContentType(probe[:n])
	}
	written, copyErr := io.Copy(dest, io.MultiReader(bytes.NewReader(probe[:n]), file))
	closeErr := dest.Close()
	if copyErr != nil {
		_ = os.Remove(destPath)
		return copyErr
	}
	if closeErr != nil {
		_ = os.Remove(destPath)
		return closeErr
	}

	res, err := h.db.ExecContext(r.Context(),
		`INSERT INTO product_assets (product_id, role, filename, content_type, size_bytes, storage_name, source_url, sort_order, created_at)
		 VALUES (?, ?, ?, ?, ?, ?, '', ?, ?)`,
		productID, role, filename, contentType, written, storageName, sortOrder, time.Now().Unix())
	if err != nil {
		_ = os.Remove(destPath)
		return err
	}
	id, err := res.LastInsertId()
	if err != nil {
		return err
	}
	httpx.WriteJSON(w, http.StatusCreated, ProductAsset{
		ID: id, ProductID: productID, Role: role, Filename: filename, ContentType: contentType,
		SizeBytes: written, SortOrder: sortOrder, URL: assetURL(id, role),
	})
	return nil
}

func (h *Handler) adminAddAssetLink(w http.ResponseWriter, r *http.Request) error {
	productID, err := pathID(r, "id")
	if err != nil {
		return err
	}
	if err := ensureProductExists(r.Context(), h.db, productID); err != nil {
		return err
	}
	var req addAssetLinkRequest
	if err := httpx.DecodeJSON(w, r, &req); err != nil {
		return err
	}
	role := strings.ToLower(strings.TrimSpace(req.Role))
	if role != "preview" && role != "download" {
		return httpx.Errorf(http.StatusBadRequest, "asset role must be preview or download")
	}
	if strings.TrimSpace(req.Filename) == "" {
		return httpx.Errorf(http.StatusBadRequest, "filename is required")
	}
	filename := cleanFilename(req.Filename)
	sourceURL, err := cleanSourceURL(req.URL)
	if err != nil {
		return err
	}

	storageName, contentType := "", "application/octet-stream"
	var sizeBytes int64
	if role == "preview" {
		thumb, err := h.fetchPreviewThumbnail(r.Context(), sourceURL)
		if err != nil {
			return err
		}
		storageName, err = randomStorageName("preview.jpg")
		if err != nil {
			return err
		}
		if err := os.MkdirAll(h.cfg.ShopUploadDir(), 0o700); err != nil {
			return err
		}
		if err := os.WriteFile(h.assetPath(storageName), thumb, 0o600); err != nil {
			return err
		}
		contentType = "image/jpeg"
		sizeBytes = int64(len(thumb))
	} else {
		storageName, err = randomLinkStorageName()
		if err != nil {
			return err
		}
		contentType, sizeBytes = h.linkMetadata(r.Context(), sourceURL, filename)
	}

	res, err := h.db.ExecContext(r.Context(),
		`INSERT INTO product_assets (product_id, role, filename, content_type, size_bytes, storage_name, source_url, sort_order, created_at)
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		productID, role, filename, contentType, sizeBytes, storageName, sourceURL, req.SortOrder, time.Now().Unix())
	if err != nil {
		if role == "preview" && storageName != "" {
			_ = os.Remove(h.assetPath(storageName))
		}
		return err
	}
	id, err := res.LastInsertId()
	if err != nil {
		return err
	}
	httpx.WriteJSON(w, http.StatusCreated, ProductAsset{
		ID: id, ProductID: productID, Role: role, Filename: filename, ContentType: contentType,
		SizeBytes: sizeBytes, SourceURL: sourceURL, SortOrder: req.SortOrder, URL: assetURL(id, role),
	})
	return nil
}

func (h *Handler) adminDeleteAsset(w http.ResponseWriter, r *http.Request) error {
	id, err := pathID(r, "id")
	if err != nil {
		return err
	}
	asset, err := h.loadAsset(r.Context(), id)
	if err != nil {
		return err
	}
	res, err := h.db.ExecContext(r.Context(), `DELETE FROM product_assets WHERE id = ?`, id)
	if err != nil {
		return err
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return httpx.Errorf(http.StatusNotFound, "asset not found")
	}
	if err := os.Remove(h.assetPath(asset.StorageName)); err != nil && !errors.Is(err, os.ErrNotExist) {
		h.log.Warn("remove shop asset", "asset", id, "err", err)
	}
	httpx.WriteJSON(w, http.StatusOK, map[string]string{"status": "ok"})
	return nil
}

func (h *Handler) previewAsset(w http.ResponseWriter, r *http.Request) error {
	id, err := pathID(r, "id")
	if err != nil {
		return err
	}
	asset, err := h.loadAsset(r.Context(), id)
	if err != nil {
		return err
	}
	if asset.Role != "preview" {
		return httpx.Errorf(http.StatusNotFound, "asset not found")
	}
	return h.serveAssetFile(w, r, asset, false)
}

func (h *Handler) downloadAsset(w http.ResponseWriter, r *http.Request) error {
	id, err := pathID(r, "id")
	if err != nil {
		return err
	}
	asset, err := h.loadAsset(r.Context(), id)
	if err != nil {
		return err
	}
	if asset.Role != "download" {
		return httpx.Errorf(http.StatusNotFound, "asset not found")
	}
	uid, ok := auth.UserID(r.Context())
	if !ok {
		return httpx.Errorf(http.StatusUnauthorized, "not authenticated")
	}
	var allowed int
	err = h.db.QueryRowContext(r.Context(),
		`SELECT 1
		 FROM orders o
		 JOIN order_items oi ON oi.order_id = o.id
		 WHERE o.user_id = ? AND oi.product_id = ? AND o.status IN ('paid','fulfilled')
		 LIMIT 1`, uid, asset.ProductID).Scan(&allowed)
	if errors.Is(err, sql.ErrNoRows) {
		return httpx.Errorf(http.StatusForbidden, "purchase required")
	}
	if err != nil {
		return err
	}
	return h.serveAssetFile(w, r, asset, true)
}

func (h *Handler) loadAsset(ctx context.Context, id int64) (storedAsset, error) {
	var a storedAsset
	err := h.db.QueryRowContext(ctx,
		`SELECT id, product_id, role, filename, content_type, size_bytes, storage_name, COALESCE(source_url, ''), sort_order
		 FROM product_assets
		 WHERE id = ?`, id).Scan(&a.ID, &a.ProductID, &a.Role, &a.Filename, &a.ContentType, &a.SizeBytes, &a.StorageName, &a.SourceURL, &a.SortOrder)
	if errors.Is(err, sql.ErrNoRows) {
		return storedAsset{}, httpx.Errorf(http.StatusNotFound, "asset not found")
	}
	if err != nil {
		return storedAsset{}, err
	}
	a.URL = assetURL(a.ID, a.Role)
	return a, nil
}

func (h *Handler) serveAssetFile(w http.ResponseWriter, r *http.Request, asset storedAsset, attachment bool) error {
	if attachment && asset.SourceURL != "" {
		http.Redirect(w, r, asset.SourceURL, http.StatusFound)
		return nil
	}
	path := h.assetPath(asset.StorageName)
	file, err := os.Open(path)
	if errors.Is(err, os.ErrNotExist) && asset.SourceURL != "" {
		http.Redirect(w, r, asset.SourceURL, http.StatusFound)
		return nil
	}
	if errors.Is(err, os.ErrNotExist) {
		return httpx.Errorf(http.StatusNotFound, "asset file not found")
	}
	if err != nil {
		return err
	}
	defer file.Close()
	info, err := file.Stat()
	if err != nil {
		return err
	}
	w.Header().Set("Content-Type", asset.ContentType)
	w.Header().Set("X-Content-Type-Options", "nosniff")
	if attachment {
		w.Header().Set("Content-Disposition", mime.FormatMediaType("attachment", map[string]string{"filename": asset.Filename}))
	}
	http.ServeContent(w, r, asset.Filename, info.ModTime(), file)
	return nil
}

func (h *Handler) assetPath(storageName string) string {
	return filepath.Join(h.cfg.ShopUploadDir(), filepath.Base(storageName))
}

func cleanFilename(name string) string {
	name = filepath.Base(strings.TrimSpace(name))
	name = strings.Map(func(r rune) rune {
		if r < 32 || r == 127 || r == '/' || r == '\\' {
			return -1
		}
		return r
	}, name)
	if name == "" || name == "." {
		name = "download"
	}
	if len(name) > 180 {
		ext := filepath.Ext(name)
		base := strings.TrimSuffix(name, ext)
		if len(ext) > 24 {
			ext = ""
		}
		limit := 180 - len(ext)
		if limit < 1 {
			limit = 180
		}
		if len(base) > limit {
			base = base[:limit]
		}
		name = base + ext
	}
	return name
}

func randomStorageName(filename string) (string, error) {
	b := make([]byte, 24)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	ext := strings.ToLower(filepath.Ext(filename))
	if len(ext) > 24 || strings.ContainsAny(ext, `/\`) {
		ext = ""
	}
	return base64.RawURLEncoding.EncodeToString(b) + ext, nil
}

func randomLinkStorageName() (string, error) {
	b := make([]byte, 24)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return "__link__" + base64.RawURLEncoding.EncodeToString(b), nil
}

func cleanSourceURL(raw string) (string, error) {
	raw = strings.TrimSpace(raw)
	if raw == "" || len(raw) > maxSourceURLLen {
		return "", httpx.Errorf(http.StatusBadRequest, "asset URL is required")
	}
	u, err := url.Parse(raw)
	if err != nil || u.Host == "" || (u.Scheme != "https" && u.Scheme != "http") {
		return "", httpx.Errorf(http.StatusBadRequest, "asset URL must be http or https")
	}
	if u.User != nil {
		return "", httpx.Errorf(http.StatusBadRequest, "asset URL cannot include credentials")
	}
	return u.String(), nil
}

func (h *Handler) fetchPreviewThumbnail(ctx context.Context, sourceURL string) ([]byte, error) {
	ctx, cancel := context.WithTimeout(ctx, linkedHTTPTimeout)
	defer cancel()
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, sourceURL, nil)
	if err != nil {
		return nil, err
	}
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, httpx.Errorf(http.StatusBadGateway, "could not fetch linked preview image")
	}
	defer resp.Body.Close()
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, httpx.Errorf(http.StatusBadGateway, "linked preview image could not be fetched")
	}
	if resp.ContentLength > maxLinkedPreviewBytes {
		return nil, httpx.Errorf(http.StatusBadRequest, "linked preview image is too large")
	}
	raw, err := io.ReadAll(io.LimitReader(resp.Body, maxLinkedPreviewBytes+1))
	if err != nil {
		return nil, err
	}
	if int64(len(raw)) > maxLinkedPreviewBytes {
		return nil, httpx.Errorf(http.StatusBadRequest, "linked preview image is too large")
	}
	contentType := strings.ToLower(resp.Header.Get("Content-Type"))
	if contentType != "" && !strings.HasPrefix(contentType, "image/") {
		return nil, httpx.Errorf(http.StatusBadRequest, "linked preview must be an image")
	}
	img, _, err := image.Decode(bytes.NewReader(raw))
	if err != nil {
		return nil, httpx.Errorf(http.StatusBadRequest, "linked preview image format is not supported")
	}
	thumb := resizeImage(img, previewThumbMaxWidth, previewThumbMaxHeight)
	var out bytes.Buffer
	if err := jpeg.Encode(&out, thumb, &jpeg.Options{Quality: 86}); err != nil {
		return nil, err
	}
	return out.Bytes(), nil
}

func (h *Handler) linkMetadata(ctx context.Context, sourceURL, filename string) (string, int64) {
	ctx, cancel := context.WithTimeout(ctx, linkedHTTPTimeout)
	defer cancel()
	req, err := http.NewRequestWithContext(ctx, http.MethodHead, sourceURL, nil)
	if err == nil {
		if resp, err := http.DefaultClient.Do(req); err == nil {
			resp.Body.Close()
			if resp.StatusCode >= 200 && resp.StatusCode < 400 {
				contentType := strings.TrimSpace(resp.Header.Get("Content-Type"))
				if i := strings.IndexByte(contentType, ';'); i >= 0 {
					contentType = strings.TrimSpace(contentType[:i])
				}
				if contentType == "" {
					contentType = mime.TypeByExtension(filepath.Ext(filename))
				}
				if contentType == "" {
					contentType = "application/octet-stream"
				}
				if resp.ContentLength > 0 {
					return contentType, resp.ContentLength
				}
				return contentType, 0
			}
		}
	}
	if contentType := mime.TypeByExtension(filepath.Ext(filename)); contentType != "" {
		return contentType, 0
	}
	return "application/octet-stream", 0
}

func resizeImage(src image.Image, maxW, maxH int) image.Image {
	b := src.Bounds()
	sw, sh := b.Dx(), b.Dy()
	if sw <= 0 || sh <= 0 {
		return src
	}
	scale := math.Min(float64(maxW)/float64(sw), float64(maxH)/float64(sh))
	if scale >= 1 {
		return src
	}
	dw := max(1, int(math.Round(float64(sw)*scale)))
	dh := max(1, int(math.Round(float64(sh)*scale)))
	dst := image.NewRGBA(image.Rect(0, 0, dw, dh))
	for y := 0; y < dh; y++ {
		sy := b.Min.Y + y*sh/dh
		for x := 0; x < dw; x++ {
			sx := b.Min.X + x*sw/dw
			dst.Set(x, y, src.At(sx, sy))
		}
	}
	return dst
}
