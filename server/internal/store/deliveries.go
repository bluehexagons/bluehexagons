package store

import (
	"context"
	"database/sql"
	"errors"
	"net/http"
	"time"

	"bluehexagons.com/server/internal/auth"
	"bluehexagons.com/server/internal/httpx"
)

type OrderDeliverables struct {
	OrderID   int64           `json:"order_id"`
	Status    string          `json:"status"`
	CreatedAt int64           `json:"created_at"`
	Items     []PurchasedItem `json:"items"`
}

type PurchasedItem struct {
	OrderItemID      int64             `json:"order_item_id"`
	ProductID        int64             `json:"product_id"`
	Title            string            `json:"title"`
	Description      string            `json:"description"`
	Quantity         int64             `json:"quantity"`
	PostPurchaseText string            `json:"post_purchase_text"`
	Downloads        []ProductAsset    `json:"downloads"`
	Keys             PurchasedKeyStats `json:"keys"`
}

type PurchasedKeyStats struct {
	Total     int64        `json:"total"`
	Remaining int64        `json:"remaining"`
	Claimable int64        `json:"claimable"`
	Claimed   []ClaimedKey `json:"claimed"`
}

type ClaimedKey struct {
	ID        int64  `json:"id"`
	KeyText   string `json:"key_text"`
	ClaimedAt int64  `json:"claimed_at"`
}

func (h *Handler) orderDeliverables(w http.ResponseWriter, r *http.Request) error {
	orderID, err := pathID(r, "id")
	if err != nil {
		return err
	}
	uid, ok := auth.UserID(r.Context())
	if !ok {
		return httpx.Errorf(http.StatusUnauthorized, "not authenticated")
	}

	var out OrderDeliverables
	err = h.db.QueryRowContext(r.Context(),
		`SELECT id, status, created_at FROM orders WHERE id = ? AND user_id = ?`, orderID, uid).
		Scan(&out.OrderID, &out.Status, &out.CreatedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return httpx.Errorf(http.StatusNotFound, "order not found")
	}
	if err != nil {
		return err
	}
	out.Items = []PurchasedItem{}
	if !orderUnlocksDigitalItems(out.Status) {
		httpx.WriteJSON(w, http.StatusOK, out)
		return nil
	}

	rows, err := h.db.QueryContext(r.Context(),
		`SELECT oi.id, p.id, p.name, p.description, oi.quantity, COALESCE(d.post_purchase_text, '')
		 FROM order_items oi
		 JOIN products p ON p.id = oi.product_id
		 LEFT JOIN product_details d ON d.product_id = p.id
		 WHERE oi.order_id = ?
		 ORDER BY oi.id`, orderID)
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var item PurchasedItem
		if err := rows.Scan(&item.OrderItemID, &item.ProductID, &item.Title, &item.Description, &item.Quantity, &item.PostPurchaseText); err != nil {
			return err
		}
		item.Downloads, err = h.productAssets(r.Context(), item.ProductID, "download")
		if err != nil {
			return err
		}
		item.Keys, err = h.purchasedKeyStats(r.Context(), item.ProductID, item.OrderItemID, item.Quantity)
		if err != nil {
			return err
		}
		out.Items = append(out.Items, item)
	}
	if err := rows.Err(); err != nil {
		return err
	}
	httpx.WriteJSON(w, http.StatusOK, out)
	return nil
}

func (h *Handler) claimProductKey(w http.ResponseWriter, r *http.Request) error {
	orderItemID, err := pathID(r, "id")
	if err != nil {
		return err
	}
	uid, ok := auth.UserID(r.Context())
	if !ok {
		return httpx.Errorf(http.StatusUnauthorized, "not authenticated")
	}

	var productID, quantity int64
	err = h.db.QueryRowContext(r.Context(),
		`SELECT oi.product_id, oi.quantity
		 FROM order_items oi
		 JOIN orders o ON o.id = oi.order_id
		 WHERE oi.id = ? AND o.user_id = ? AND o.status IN ('paid','fulfilled')`, orderItemID, uid).
		Scan(&productID, &quantity)
	if errors.Is(err, sql.ErrNoRows) {
		return httpx.Errorf(http.StatusNotFound, "order item not found")
	}
	if err != nil {
		return err
	}

	now := time.Now().Unix()
	var key ClaimedKey
	err = h.db.QueryRowContext(r.Context(),
		`UPDATE product_keys
		 SET claimed_order_item_id = ?, claimed_user_id = ?, claimed_at = ?
		 WHERE id = (
			 SELECT pk.id
			 FROM product_keys pk
			 WHERE pk.product_id = ?
			   AND pk.claimed_at IS NULL
			   AND (SELECT COUNT(*) FROM product_keys claimed WHERE claimed.claimed_order_item_id = ?) < ?
			 ORDER BY pk.id
			 LIMIT 1
		 )
		 RETURNING id, key_text, claimed_at`,
		orderItemID, uid, now, productID, orderItemID, quantity).Scan(&key.ID, &key.KeyText, &key.ClaimedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return httpx.Errorf(http.StatusConflict, "no keys are available to claim")
	}
	if err != nil {
		return err
	}
	httpx.WriteJSON(w, http.StatusOK, key)
	return nil
}

func (h *Handler) purchasedKeyStats(ctx context.Context, productID, orderItemID, quantity int64) (PurchasedKeyStats, error) {
	var stats PurchasedKeyStats
	err := h.db.QueryRowContext(ctx,
		`SELECT COUNT(*), COALESCE(SUM(CASE WHEN claimed_at IS NULL THEN 1 ELSE 0 END), 0)
		 FROM product_keys
		 WHERE product_id = ?`, productID).Scan(&stats.Total, &stats.Remaining)
	if err != nil {
		return stats, err
	}
	stats.Claimed = []ClaimedKey{}
	rows, err := h.db.QueryContext(ctx,
		`SELECT id, key_text, claimed_at
		 FROM product_keys
		 WHERE claimed_order_item_id = ?
		 ORDER BY claimed_at, id`, orderItemID)
	if err != nil {
		return stats, err
	}
	defer rows.Close()
	for rows.Next() {
		var key ClaimedKey
		if err := rows.Scan(&key.ID, &key.KeyText, &key.ClaimedAt); err != nil {
			return stats, err
		}
		stats.Claimed = append(stats.Claimed, key)
	}
	if err := rows.Err(); err != nil {
		return stats, err
	}
	if stats.Total > 0 && quantity > int64(len(stats.Claimed)) {
		stats.Claimable = quantity - int64(len(stats.Claimed))
	}
	return stats, nil
}

func orderUnlocksDigitalItems(status string) bool {
	return status == "paid" || status == "fulfilled"
}
