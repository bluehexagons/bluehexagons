import { BaseElement } from './BaseElement';
import imageScrollerStyles from './ImageScroller.css?inline';

type GalleryItem = {
  source: string;
  caption: string;
  alt: string;
  link: string | null;
  button: HTMLButtonElement;
};

export class ImageScrollerElement extends BaseElement {
  private items: GalleryItem[] = [];
  private selected = 0;
  private mutationObserver: MutationObserver | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private initialized = false;
  private thumbnails!: HTMLDivElement;
  private stage!: HTMLAnchorElement;
  private image!: HTMLImageElement;
  private caption!: HTMLElement;
  private counter!: HTMLElement;
  private dialog!: HTMLDialogElement;
  private viewerImage!: HTMLImageElement;
  private viewerCaption!: HTMLElement;
  private viewerCounter!: HTMLElement;
  private originalLink!: HTMLAnchorElement;
  private previousOverflow: string | null = null;
  private pointerStart: { x: number; y: number; id: number } | null = null;
  private swiped = false;

  constructor() {
    super(imageScrollerStyles);
  }

  connectedCallback() {
    if (!this.initialized) {
      this.renderGallery();
      this.initialized = true;
    }
    this.consumeChildren();
    this.mutationObserver = new MutationObserver(() => this.consumeChildren());
    this.mutationObserver.observe(this, { childList: true });
    this.resizeObserver = new ResizeObserver(() => {
      if (!this.dialog.open) this.revealThumbnail();
    });
    this.resizeObserver.observe(this.thumbnails);
  }

  disconnectedCallback() {
    this.mutationObserver?.disconnect();
    this.mutationObserver = null;
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    if (this.initialized && this.dialog.open) this.dialog.close();
    this.restorePageScroll();
  }

  private renderGallery() {
    const label = this.getAttribute('aria-label') || 'Image gallery';
    this.render(
      <section class="gallery" aria-label={label} aria-roledescription="carousel" onKeydown={(event: KeyboardEvent) => this.onKeydown(event)}>
        <div class="gallery__heading">
          <span class="gallery__label">{label}</span>
          <span class="gallery__hint">Select a preview to explore</span>
        </div>
        <a class="gallery__stage" aria-haspopup="dialog" onClick={(event: MouseEvent) => {
          if (this.swiped) {
            event.preventDefault();
            this.swiped = false;
          } else if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0 && !this.items[this.selected].link && !this.image.hidden) {
            event.preventDefault();
            this.openViewer();
          }
        }} onPointerdown={(event: PointerEvent) => this.startSwipe(event)} onPointerup={(event: PointerEvent) => this.endSwipe(event)} onPointercancel={() => { this.pointerStart = null; }}>
          <img class="gallery__image" loading="lazy" decoding="async" />
          <span class="gallery__image_error" hidden>Preview unavailable. Use the original image link.</span>
          <span class="gallery__loading" role="status" hidden>Loading image…</span>
          <span class="gallery__open" aria-hidden="true"></span>
        </a>
        <div class="gallery__details">
          <p class="gallery__caption" aria-live="polite" aria-atomic="true"></p>
          <div class="gallery__navigation" role="group" aria-label="Browse images">
            <button type="button" class="gallery__arrow" aria-label="Previous image" onClick={() => this.move(-1)}><span aria-hidden="true">←</span></button>
            <span class="gallery__counter" aria-hidden="true"></span>
            <button type="button" class="gallery__arrow" aria-label="Next image" onClick={() => this.move(1)}><span aria-hidden="true">→</span></button>
          </div>
        </div>
        <div class="gallery__thumbnails" role="group" aria-label="Choose an image"></div>
      </section>
    );
    this.thumbnails = this.shadow.querySelector('.gallery__thumbnails')!;
    this.stage = this.shadow.querySelector('.gallery__stage')!;
    this.image = this.shadow.querySelector('.gallery__image')!;
    this.caption = this.shadow.querySelector('.gallery__caption')!;
    this.counter = this.shadow.querySelector('.gallery__counter')!;

    // A native modal keeps focus inside the viewer and makes the page inert.
    this.dialog = document.createElement('dialog');
    this.dialog.className = 'viewer';
    this.dialog.setAttribute('aria-label', `${label} — enlarged view`);
    this.dialog.appendChild(
      <div class="viewer__layout" onKeydown={(event: KeyboardEvent) => this.onKeydown(event)}>
        <div class="viewer__heading">
          <span class="gallery__label">{label}</span>
          <button type="button" class="viewer__close" autofocus aria-label="Close enlarged view" onClick={() => this.dialog.close()}>Close <span aria-hidden="true">×</span></button>
        </div>
        <div class="viewer__image_wrap" onPointerdown={(event: PointerEvent) => this.startSwipe(event)} onPointerup={(event: PointerEvent) => this.endSwipe(event)} onPointercancel={() => { this.pointerStart = null; }}>
          <img class="viewer__image" decoding="async" />
          <p class="gallery__image_error" hidden>Preview unavailable. Open the original image below.</p>
          <span class="gallery__loading" role="status" hidden>Loading image…</span>
        </div>
        <div class="viewer__details">
          <p class="viewer__caption" aria-live="polite" aria-atomic="true"></p>
          <div class="gallery__navigation" role="group" aria-label="Browse enlarged images">
            <button type="button" class="gallery__arrow" aria-label="Previous image" onClick={() => this.move(-1)}><span aria-hidden="true">←</span></button>
            <span class="viewer__counter" aria-hidden="true"></span>
            <button type="button" class="gallery__arrow" aria-label="Next image" onClick={() => this.move(1)}><span aria-hidden="true">→</span></button>
          </div>
        </div>
        <div class="viewer__footer">
          <span>← → Browse <span aria-hidden="true">·</span> Esc Close</span>
          <a class="viewer__original" target="_blank" rel="noopener noreferrer"></a>
        </div>
      </div>
    );
    this.contentRoot.appendChild(this.dialog);
    this.viewerImage = this.dialog.querySelector('.viewer__image')!;
    this.viewerCaption = this.dialog.querySelector('.viewer__caption')!;
    this.viewerCounter = this.dialog.querySelector('.viewer__counter')!;
    this.originalLink = this.dialog.querySelector('.viewer__original')!;
    this.dialog.addEventListener('click', event => {
      if (event.target === this.dialog) this.dialog.close();
    });
    this.dialog.addEventListener('close', () => {
      this.restorePageScroll();
      this.swiped = false;
      // Keep the newly selected thumbnail visible without moving the page.
      this.revealThumbnail();
      if (this.isConnected) this.stage.focus({ preventScroll: true });
    });
    for (const image of [this.image, this.viewerImage]) {
      image.addEventListener('error', () => {
        this.finishLoading(image);
        image.hidden = true;
        (image.nextElementSibling as HTMLElement).hidden = false;
        if (image === this.image) {
          this.stage.removeAttribute('aria-haspopup');
          this.stage.setAttribute('aria-label', 'Open original image (opens in a new tab)');
          this.stage.target = '_blank';
          this.stage.rel = 'noopener noreferrer';
          this.shadow.querySelector('.gallery__open')!.textContent = 'Open original ↗';
        }
      });
      image.addEventListener('load', () => {
        this.finishLoading(image);
        image.hidden = false;
        (image.nextElementSibling as HTMLElement).hidden = true;
      });
    }
  }

  private consumeChildren() {
    for (const node of Array.from(this.childNodes)) {
      const image = node instanceof HTMLImageElement ? node : node instanceof HTMLAnchorElement ? node.querySelector('img') : null;
      this.removeChild(node);
      if (image) this.appendImage(image, node instanceof HTMLAnchorElement ? node.href : null);
    }
    this.hidden = this.items.length === 0;
    if (this.items.length) this.select(this.selected, false);
  }

  private appendImage(image: HTMLImageElement, link: string | null) {
    const source = image.src.replace('/thumbs/', '/');
    const caption = image.title || image.alt || `Image ${this.items.length + 1}`;
    const alt = image.getAttribute('alt') ?? caption;
    const index = this.items.length;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'gallery__thumbnail';
    button.title = caption;
    button.setAttribute('aria-label', `Show image ${index + 1}: ${caption}`);
    image.alt = '';
    image.removeAttribute('title');
    image.loading = 'lazy';
    image.decoding = 'async';
    const number = document.createElement('span');
    number.className = 'gallery__thumbnail_number';
    number.setAttribute('aria-hidden', 'true');
    number.textContent = String(index + 1).padStart(2, '0');
    button.append(image, number);
    button.addEventListener('click', () => this.select(index));
    this.thumbnails.appendChild(button);
    this.items.push({ source, caption, alt, link: image.dataset.linkOverride || (link !== source ? link : null), button });
  }

  private select(index: number, reveal = true) {
    this.selected = (index + this.items.length) % this.items.length;
    const item = this.items[this.selected];
    const count = `${String(this.selected + 1).padStart(2, '0')} / ${String(this.items.length).padStart(2, '0')}`;
    this.setImage(this.image, item);
    this.stage.href = item.link || item.source;
    this.stage.setAttribute('aria-label', item.link ? `Watch video: ${item.caption} (opens in a new tab)` : `Enlarge image ${this.selected + 1}: ${item.caption}`);
    if (item.link) {
      this.stage.target = '_blank';
      this.stage.rel = 'noopener noreferrer';
      this.stage.removeAttribute('aria-haspopup');
    } else {
      this.stage.removeAttribute('target');
      this.stage.removeAttribute('rel');
      this.stage.setAttribute('aria-haspopup', 'dialog');
    }
    this.shadow.querySelector('.gallery__open')!.textContent = item.link ? '▶ Watch video ↗' : '⤢ Enlarge image';
    // Only the active view announces changes to avoid duplicate live messages.
    this.caption.setAttribute('aria-live', this.dialog.open ? 'off' : 'polite');
    this.caption.textContent = `Image ${this.selected + 1} of ${this.items.length}. ${item.caption}`;
    this.counter.textContent = count;
    this.items.forEach((entry, i) => {
      entry.button.setAttribute('aria-pressed', String(i === this.selected));
      entry.button.tabIndex = i === this.selected ? 0 : -1;
    });
    for (const button of this.shadow.querySelectorAll<HTMLButtonElement>('.gallery__arrow')) button.hidden = this.items.length < 2;
    this.thumbnails.hidden = this.items.length < 2;
    if (this.dialog.open) this.updateViewer();
    if (reveal && !this.dialog.open) this.revealThumbnail();
  }

  private setImage(image: HTMLImageElement, item: GalleryItem) {
    image.alt = item.alt;
    if (image.src === item.source) return;
    image.hidden = false;
    (image.nextElementSibling as HTMLElement).hidden = true;
    image.parentElement!.dataset.loading = 'true';
    image.parentElement!.querySelector<HTMLElement>('.gallery__loading')!.hidden = false;
    image.src = item.source;
  }

  private finishLoading(image: HTMLImageElement) {
    image.parentElement!.dataset.loading = 'false';
    image.parentElement!.querySelector<HTMLElement>('.gallery__loading')!.hidden = true;
  }

  private updateViewer() {
    const item = this.items[this.selected];
    this.setImage(this.viewerImage, item);
    this.viewerCaption.textContent = this.caption.textContent;
    this.viewerCounter.textContent = this.counter.textContent;
    this.originalLink.href = item.link || item.source;
    this.originalLink.textContent = item.link ? 'Watch video ↗' : 'Open original ↗';
    this.originalLink.setAttribute('aria-label', `${item.link ? 'Watch video' : 'Open original image'} (opens in a new tab)`);
  }

  private move(direction: number) {
    if (this.items.length > 1) this.select(this.selected + direction);
  }

  private onKeydown(event: KeyboardEvent) {
    if (event.key === 'Tab' && this.dialog.open) {
      const controls = this.dialog.querySelectorAll<HTMLElement>('button:not([hidden]), a[href]');
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && event.target === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && event.target === last) {
        event.preventDefault();
        first.focus();
      }
      return;
    }
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    let index = this.selected;
    if (event.key === 'ArrowLeft') index--;
    else if (event.key === 'ArrowRight') index++;
    else if (event.key === 'Home') index = 0;
    else if (event.key === 'End') index = this.items.length - 1;
    else return;
    event.preventDefault();
    const fromThumbnail = (event.target as Element).closest('.gallery__thumbnail');
    this.select(index);
    if (fromThumbnail) this.items[this.selected].button.focus({ preventScroll: true });
  }

  private revealThumbnail() {
    const button = this.items[this.selected]?.button;
    if (!button) return;
    const strip = this.thumbnails.getBoundingClientRect();
    const thumb = button.getBoundingClientRect();
    if (thumb.left < strip.left) this.thumbnails.scrollBy({ left: thumb.left - strip.left - 6 });
    else if (thumb.right > strip.right) this.thumbnails.scrollBy({ left: thumb.right - strip.right + 6 });
  }

  private openViewer() {
    this.updateViewer();
    this.dialog.showModal();
    this.caption.setAttribute('aria-live', 'off');
    this.previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }

  private restorePageScroll() {
    if (this.previousOverflow === null) return;
    document.body.style.overflow = this.previousOverflow;
    this.previousOverflow = null;
    this.caption.setAttribute('aria-live', 'polite');
  }

  private startSwipe(event: PointerEvent) {
    this.swiped = false;
    if (event.pointerType === 'mouse' || !event.isPrimary) return;
    this.pointerStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  private endSwipe(event: PointerEvent) {
    const start = this.pointerStart;
    this.pointerStart = null;
    if (!start || start.id !== event.pointerId) return;
    const x = event.clientX - start.x;
    const y = event.clientY - start.y;
    if (Math.abs(x) < 50 || Math.abs(x) < Math.abs(y) * 1.5) return;
    this.move(x < 0 ? 1 : -1);
    this.swiped = true;
  }
}

customElements.define('image-scroller', ImageScrollerElement);
