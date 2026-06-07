import '../bootstrap';
import './shop.css';
import { render } from '../render';
import {
  api,
  apiURL,
  ApiError,
  type AdminProduct,
  type AdminProductInput,
  type ProductAsset,
  type User,
} from './api';

const app = document.getElementById('app');
if (!app) throw new Error('Missing #app container');

interface State {
  loading: boolean;
  user: User | null;
  products: AdminProduct[];
  selected: AdminProduct | null;
  error: string;
  notice: string;
  authBusy: boolean;
  saveBusy: boolean;
  uploadBusy: boolean;
  keysBusy: boolean;
}

const state: State = {
  loading: true,
  user: null,
  products: [],
  selected: null,
  error: '',
  notice: '',
  authBusy: false,
  saveBusy: false,
  uploadBusy: false,
  keysBusy: false,
};

let authEmail = '';
let authPassword = '';
let form = emptyForm();
let keyText = '';
let assetSource: 'file' | 'link' = 'file';
let assetRole: 'preview' | 'download' = 'download';
let assetSort = '0';
let assetFile: File | null = null;
let assetLinkFilename = '';
let assetLinkURL = '';

const errMessage = (err: unknown): string => {
  if (err instanceof ApiError && err.status === 403) return 'This account does not have shop admin rights.';
  if (err instanceof ApiError && err.status === 401) return 'Sign in with an admin account.';
  return err instanceof Error ? err.message : 'Something went wrong';
};

const money = (cents: number, currency: string) => {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: currency.toUpperCase() }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(2)} ${currency.toUpperCase()}`;
  }
};

function fileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
}

function emptyForm(): AdminProductInput {
  return {
    sku: '',
    title: '',
    description: '',
    price_cents: 0,
    currency: 'usd',
    kind: 'digital',
    post_purchase_text: '',
    active: true,
  };
}

function formFromProduct(product: AdminProduct): AdminProductInput {
  return {
    sku: product.sku,
    title: product.title || product.name,
    description: product.description,
    price_cents: product.price_cents,
    currency: product.currency,
    kind: product.kind,
    post_purchase_text: product.post_purchase_text,
    active: product.active,
  };
}

function setState(patch: Partial<State>): void {
  Object.assign(state, patch);
  renderAll();
}

async function init(): Promise<void> {
  try {
    state.user = await api.me();
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      setState({ loading: false });
      return;
    }
    setState({ loading: false, error: errMessage(err) });
    return;
  }
  await loadProducts();
}

async function loadProducts(selectID?: number | null, notice = state.notice): Promise<void> {
  try {
    const products = await api.adminProducts();
    const targetID = selectID ?? state.selected?.id ?? products[0]?.id ?? null;
    const selected = targetID ? await api.adminProduct(targetID) : null;
    form = selected ? formFromProduct(selected) : emptyForm();
    setState({ products, selected, loading: false, saveBusy: false, uploadBusy: false, keysBusy: false, error: '', notice });
  } catch (err) {
    setState({ loading: false, saveBusy: false, uploadBusy: false, keysBusy: false, error: errMessage(err) });
  }
}

async function submitAuth(kind: 'login' | 'register'): Promise<void> {
  if (state.authBusy) return;
  const email = authEmail.trim();
  if (!email || !authPassword) {
    setState({ error: 'Enter an email and password.' });
    return;
  }
  setState({ authBusy: true, error: '', notice: '' });
  try {
    const user = kind === 'login' ? await api.login(email, authPassword) : await api.register(email, authPassword);
    authPassword = '';
    state.user = user;
    state.authBusy = false;
    await loadProducts();
  } catch (err) {
    setState({ authBusy: false, error: errMessage(err) });
  }
}

async function logout(): Promise<void> {
  if (state.authBusy) return;
  setState({ authBusy: true });
  try {
    await api.logout();
  } catch {
    /* local state reset is enough */
  }
  authPassword = '';
  form = emptyForm();
  setState({ user: null, selected: null, products: [], authBusy: false, error: '', notice: '' });
}

async function selectProduct(id: number): Promise<void> {
  setState({ error: '', notice: '' });
  try {
    const selected = await api.adminProduct(id);
    form = formFromProduct(selected);
    keyText = '';
    assetFile = null;
    assetLinkFilename = '';
    assetLinkURL = '';
    setState({ selected });
  } catch (err) {
    setState({ error: errMessage(err) });
  }
}

function newProduct(): void {
  form = emptyForm();
  keyText = '';
  assetFile = null;
  assetLinkFilename = '';
  assetLinkURL = '';
  setState({ selected: null, error: '', notice: 'Drafting a new listing.' });
}

async function saveProduct(): Promise<void> {
  if (state.saveBusy) return;
  setState({ saveBusy: true, error: '', notice: '' });
  try {
    const saved = state.selected ? await api.updateAdminProduct(state.selected.id, form) : await api.createAdminProduct(form);
    await loadProducts(saved.id, 'Listing saved.');
  } catch (err) {
    setState({ saveBusy: false, error: errMessage(err) });
  }
}

async function uploadAsset(): Promise<void> {
  if (!state.selected || state.uploadBusy) return;
  if (assetSource === 'file' && !assetFile) {
    setState({ error: 'Choose a file to upload.' });
    return;
  }
  if (assetSource === 'link' && (!assetLinkFilename.trim() || !assetLinkURL.trim())) {
    setState({ error: 'Enter a filename and URL for the linked asset.' });
    return;
  }
  setState({ uploadBusy: true, error: '', notice: '' });
  try {
    if (assetSource === 'file') {
      const data = new FormData();
      data.set('role', assetRole);
      data.set('sort_order', assetSort || '0');
      data.set('file', assetFile!);
      await api.uploadProductAsset(state.selected.id, data);
    } else {
      await api.addProductAssetLink(state.selected.id, {
        role: assetRole,
        filename: assetLinkFilename,
        url: assetLinkURL,
        sort_order: Number(assetSort) || 0,
      });
    }
    assetFile = null;
    assetLinkFilename = '';
    assetLinkURL = '';
    await loadProducts(state.selected.id, assetSource === 'file' ? 'Asset uploaded.' : 'Asset link added.');
  } catch (err) {
    setState({ uploadBusy: false, error: errMessage(err) });
  }
}

async function deleteAsset(asset: ProductAsset): Promise<void> {
  if (!state.selected || !confirm(`Delete ${asset.filename}?`)) return;
  setState({ error: '', notice: '' });
  try {
    await api.deleteAdminAsset(asset.id);
    await loadProducts(state.selected.id, 'Asset deleted.');
  } catch (err) {
    setState({ error: errMessage(err) });
  }
}

async function addKeys(): Promise<void> {
  if (!state.selected || state.keysBusy) return;
  if (!keyText.trim()) {
    setState({ error: 'Paste at least one key.' });
    return;
  }
  setState({ keysBusy: true, error: '', notice: '' });
  try {
    const selected = await api.addProductKeys(state.selected.id, keyText);
    keyText = '';
    await loadProducts(selected.id, 'Keys added.');
  } catch (err) {
    setState({ keysBusy: false, error: errMessage(err) });
  }
}

async function deleteKey(id: number): Promise<void> {
  if (!state.selected || !confirm('Delete this unclaimed key?')) return;
  setState({ error: '', notice: '' });
  try {
    await api.deleteAdminKey(id);
    await loadProducts(state.selected.id, 'Key deleted.');
  } catch (err) {
    setState({ error: errMessage(err) });
  }
}

function authPanel(): Node {
  if (state.user) {
    return (
      <div class="shop__auth">
        <div>
          Admin session <strong>{state.user.email}</strong>
          <div class="shop__muted">Access is granted by the configured primary admin email or admin list.</div>
        </div>
        <button class="shop__button shop__button--ghost" onClick={() => void logout()} disabled={state.authBusy}>
          {state.authBusy ? 'Signing out...' : 'Log out'}
        </button>
      </div>
    );
  }
  return (
    <div class="shop__auth">
      <div>
        <strong>Admin account required</strong>
        <div class="shop__muted">Sign in or create the configured primary admin account.</div>
      </div>
      <form
        class="shop__form"
        onSubmit={(event: Event) => {
          event.preventDefault();
          void submitAuth('login');
        }}
      >
        <label>
          <span>Email</span>
          <input
            type="email"
            autocomplete="email"
            value={authEmail}
            disabled={state.authBusy}
            onInput={(event: Event) => {
              authEmail = (event.currentTarget as HTMLInputElement).value;
            }}
          />
        </label>
        <label>
          <span>Password</span>
          <input
            type="password"
            autocomplete="current-password"
            value={authPassword}
            disabled={state.authBusy}
            onInput={(event: Event) => {
              authPassword = (event.currentTarget as HTMLInputElement).value;
            }}
          />
        </label>
        <div class="shop__form-actions">
          <button class="shop__button" type="submit" disabled={state.authBusy}>
            {state.authBusy ? 'Working...' : 'Log in'}
          </button>
          <button class="shop__button shop__button--ghost" type="button" onClick={() => void submitAuth('register')} disabled={state.authBusy}>
            Create account
          </button>
        </div>
      </form>
    </div>
  );
}

function productList(): Node {
  return (
    <section class="shop__admin-list" aria-labelledby="admin-products-heading">
      <div class="shop__section-head">
        <h2 id="admin-products-heading">Listings</h2>
        <button class="shop__button shop__button--ghost" onClick={newProduct}>
          New
        </button>
      </div>
      {state.products.length === 0 ? <div class="shop__empty">No listings yet.</div> : null}
      <div class="shop__admin-products">
        {state.products.map((product) => (
          <button
            class={`shop__admin-product ${state.selected?.id === product.id ? 'is-selected' : ''}`}
            onClick={() => void selectProduct(product.id)}
          >
            <span>
              <strong>{product.title || product.name}</strong>
              <small>{product.sku}</small>
            </span>
            <span>{money(product.price_cents, product.currency)}</span>
            <span class="shop__muted">
              {product.active ? 'Active' : 'Inactive'} · {product.key_stats.remaining}/{product.key_stats.total} keys
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function productForm(): Node {
  return (
    <form
      class="shop__admin-form"
      onSubmit={(event: Event) => {
        event.preventDefault();
        void saveProduct();
      }}
    >
      <div class="shop__section-head shop__section-head--loose">
        <h2>{state.selected ? 'Edit listing' : 'New listing'}</h2>
        <button class="shop__button" type="submit" disabled={state.saveBusy}>
          {state.saveBusy ? 'Saving...' : 'Save listing'}
        </button>
      </div>
      <label>
        <span>SKU</span>
        <input
          value={form.sku}
          onInput={(event: Event) => {
            form.sku = (event.currentTarget as HTMLInputElement).value;
          }}
        />
      </label>
      <label>
        <span>Title</span>
        <input
          value={form.title}
          onInput={(event: Event) => {
            form.title = (event.currentTarget as HTMLInputElement).value;
          }}
        />
      </label>
      <label>
        <span>Price cents</span>
        <input
          type="number"
          min="0"
          step="1"
          value={String(form.price_cents)}
          onInput={(event: Event) => {
            form.price_cents = Number((event.currentTarget as HTMLInputElement).value) || 0;
          }}
        />
      </label>
      <label>
        <span>Currency</span>
        <input
          value={form.currency}
          onInput={(event: Event) => {
            form.currency = (event.currentTarget as HTMLInputElement).value.toLowerCase();
          }}
        />
      </label>
      <label>
        <span>Kind</span>
        <select
          value={form.kind}
          onInput={(event: Event) => {
            form.kind = (event.currentTarget as HTMLSelectElement).value as 'digital' | 'physical';
          }}
        >
          <option value="digital">Digital</option>
          <option value="physical">Physical placeholder</option>
        </select>
      </label>
      <label class="shop__checkline">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(event: Event) => {
            form.active = (event.currentTarget as HTMLInputElement).checked;
          }}
        />
        <span>Visible in the shop</span>
      </label>
      <label class="shop__field-wide">
        <span>Description</span>
        <textarea
          rows={4}
          value={form.description}
          onInput={(event: Event) => {
            form.description = (event.currentTarget as HTMLTextAreaElement).value;
          }}
        ></textarea>
      </label>
      <label class="shop__field-wide">
        <span>Post-purchase text</span>
        <textarea
          rows={7}
          value={form.post_purchase_text}
          placeholder="Shown after payment. Use it for instructions, text rewards, credits, or extra context."
          onInput={(event: Event) => {
            form.post_purchase_text = (event.currentTarget as HTMLTextAreaElement).value;
          }}
        ></textarea>
      </label>
    </form>
  );
}

function assetList(title: string, assets: ProductAsset[]): Node {
  return (
    <div class="shop__asset-column">
      <h3>{title}</h3>
      {assets.length === 0 ? <div class="shop__muted">None uploaded.</div> : null}
      <ul class="shop__asset-list">
        {assets.map((asset) => {
          const size = asset.size_bytes > 0 ? fileSize(asset.size_bytes) : 'unknown size';
          return (
            <li>
              {asset.role === 'preview' && asset.content_type.startsWith('image/') ? (
                <img class="shop__asset-thumb" src={apiURL(asset.url)} alt="" loading="lazy" />
              ) : (
                <span class="shop__asset-thumb shop__asset-thumb--empty">{asset.source_url ? 'link' : asset.role}</span>
              )}
              <span>
                <strong>{asset.filename}</strong>
                <small>
                  {asset.content_type} · {size}{asset.source_url ? ' · linked' : ''}
                </small>
              </span>
              {asset.role === 'preview' ? (
                <a class="shop__button shop__button--ghost" href={apiURL(asset.url)} target="_blank" rel="noreferrer">
                  Open
                </a>
              ) : null}
              {asset.source_url ? (
                <a class="shop__button shop__button--ghost" href={asset.source_url} target="_blank" rel="noreferrer">
                  Source
                </a>
              ) : null}
              <button class="shop__icon-button" onClick={() => void deleteAsset(asset)} aria-label={`Delete ${asset.filename}`}>
                -
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function assetManager(): Node {
  if (!state.selected) return <div class="shop__empty">Save a listing before uploading preview or delivery files.</div>;
  return (
    <section class="shop__admin-panel">
      <div class="shop__section-head shop__section-head--loose">
        <h2>Assets</h2>
        <span>{state.selected.previews.length + state.selected.downloads.length} files</span>
      </div>
      <form
        class="shop__upload-form"
        onSubmit={(event: Event) => {
          event.preventDefault();
          void uploadAsset();
        }}
      >
        <label>
          <span>Source</span>
          <select
            value={assetSource}
            onInput={(event: Event) => {
              assetSource = (event.currentTarget as HTMLSelectElement).value as 'file' | 'link';
              renderAll();
            }}
          >
            <option value="file">Upload file</option>
            <option value="link">External link</option>
          </select>
        </label>
        <label>
          <span>Role</span>
          <select
            value={assetRole}
            onInput={(event: Event) => {
              assetRole = (event.currentTarget as HTMLSelectElement).value as 'preview' | 'download';
              renderAll();
            }}
          >
            <option value="download">Purchase download</option>
            <option value="preview">Public preview</option>
          </select>
        </label>
        <label>
          <span>Sort</span>
          <input
            type="number"
            step="1"
            value={assetSort}
            onInput={(event: Event) => {
              assetSort = (event.currentTarget as HTMLInputElement).value;
            }}
          />
        </label>
        {assetSource === 'file' ? (
          <label class="shop__field-wide">
            <span>File</span>
            <input
              type="file"
              onChange={(event: Event) => {
                assetFile = (event.currentTarget as HTMLInputElement).files?.[0] ?? null;
              }}
            />
          </label>
        ) : (
          <>
            <label>
              <span>Display filename</span>
              <input
                value={assetLinkFilename}
                placeholder={assetRole === 'preview' ? 'cover.jpg' : 'soundtrack.zip'}
                onInput={(event: Event) => {
                  assetLinkFilename = (event.currentTarget as HTMLInputElement).value;
                }}
              />
            </label>
            <label class="shop__field-wide">
              <span>URL</span>
              <input
                value={assetLinkURL}
                placeholder="https://cdn.example.com/file.zip"
                onInput={(event: Event) => {
                  assetLinkURL = (event.currentTarget as HTMLInputElement).value;
                }}
              />
            </label>
          </>
        )}
        {assetSource === 'link' && assetRole === 'preview' ? (
          <div class="shop__muted shop__field-wide">Preview image links are fetched once and converted into local thumbnails.</div>
        ) : null}
        <button class="shop__button" type="submit" disabled={state.uploadBusy}>
          {state.uploadBusy ? 'Working...' : assetSource === 'file' ? 'Upload asset' : 'Add linked asset'}
        </button>
      </form>
      <div class="shop__asset-grid">
        {assetList('Preview media', state.selected.previews)}
        {assetList('Unlocked downloads', state.selected.downloads)}
      </div>
    </section>
  );
}

function keyManager(): Node {
  if (!state.selected) return <div class="shop__empty">Save a listing before adding key inventory.</div>;
  const keys = state.selected.keys ?? [];
  return (
    <section class="shop__admin-panel">
      <div class="shop__section-head shop__section-head--loose">
        <h2>Keys</h2>
        <span>
          {state.selected.key_stats.remaining} remaining · {state.selected.key_stats.claimed} claimed
        </span>
      </div>
      <form
        class="shop__keys-form"
        onSubmit={(event: Event) => {
          event.preventDefault();
          void addKeys();
        }}
      >
        <label>
          <span>Add keys, one per line</span>
          <textarea
            rows={5}
            value={keyText}
            onInput={(event: Event) => {
              keyText = (event.currentTarget as HTMLTextAreaElement).value;
            }}
          ></textarea>
        </label>
        <button class="shop__button" type="submit" disabled={state.keysBusy}>
          {state.keysBusy ? 'Adding...' : 'Add keys'}
        </button>
      </form>
      {keys.length === 0 ? <div class="shop__muted">No key inventory for this listing.</div> : null}
      <ul class="shop__key-admin-list">
        {keys.map((key) => {
          const claimed = key.claimed_at !== null;
          return (
            <li class={claimed ? 'is-claimed' : ''}>
              <code class="shop__key-code">{key.key_text}</code>
              <span class="shop__muted">
                {claimed ? `Claimed by ${key.claimed_user_email || `user #${key.claimed_user_id}`}` : 'Available'}
              </span>
              {!claimed ? (
                <button class="shop__icon-button" onClick={() => void deleteKey(key.id)} aria-label="Delete key">
                  -
                </button>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function editor(): Node {
  return (
    <section class="shop__admin-main" aria-labelledby="admin-editor-heading">
      <h2 id="admin-editor-heading" class="shop__sr-only">
        Listing editor
      </h2>
      {productForm()}
      {assetManager()}
      {keyManager()}
    </section>
  );
}

function portal(): Node {
  return (
    <div class="shop shop--admin">
      {authPanel()}
      {state.error ? (
        <div class="shop__error shop__admin-message" role="alert">
          {state.error}
        </div>
      ) : null}
      {state.notice ? <div class="shop__empty shop__admin-message">{state.notice}</div> : null}
      {state.user ? productList() : null}
      {state.user ? editor() : null}
    </div>
  );
}

function buildTree(): Node {
  return (
    <>
      <content-area>
        <page-header slot="content"></page-header>
        <article slot="content" class="shop__page">
          <div class="shop__hero shop__hero--admin">
            <div class="shop__eyebrow">Digital distribution control room</div>
            <h1>Shop Admin</h1>
            <p class="shop__lede">
              Manage downloadable games, soundtracks, art packs, preview media, and deferred key claims. Physical merchandise is
              represented as a listing kind now; shipping workflows can be layered in later.
            </p>
          </div>
          {state.loading ? <div class="shop__empty">Loading admin portal...</div> : portal()}
        </article>
      </content-area>
      <page-footer></page-footer>
    </>
  );
}

function renderAll(): void {
  render(buildTree(), app!);
}

renderAll();
void init();
