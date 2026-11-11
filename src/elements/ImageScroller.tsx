import { BaseElement } from './BaseElement';
import imageScrollerStyles from './ImageScroller.css?inline';

type GalleryItem = {
  source: string;
  caption: string;
  alt: string;
  link: string | null;
  button: HTMLButtonElement;
  video: string | null;
};

// Accept only known YouTube hosts and video IDs; never embed an arbitrary link.
function youtubeVideo(link: string | null): string | null {
  if (!link) return null;
  try {
    const url = new URL(link);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    const host = url.hostname.replace(/^www\./, '');
    const path = url.pathname.split('/').filter(Boolean);
    const id = host === 'youtu.be' ? path[0]
      : ['youtube.com', 'm.youtube.com', 'youtube-nocookie.com'].includes(host)
        ? (path[0] === 'watch' ? url.searchParams.get('v') : ['embed', 'shorts', 'live'].includes(path[0]) ? path[1] : null)
        : null;
    return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

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
  private player: HTMLIFrameElement | null = null;
  private gestureTarget: HTMLElement | null = null;

  private get reducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

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
    this.stopPlayer();
    this.cancelSwipe();
  }

  private renderGallery() {
    const label = this.getAttribute('aria-label') || 'Image gallery';
    this.render(
      <section class="gallery" aria-label={label} aria-roledescription="carousel" onKeydown={(event: KeyboardEvent) => this.onKeydown(event)}>
        <div class="gallery__heading">
          <span class="gallery__label">{label}</span>
          <span class="gallery__hint">Drag or swipe to explore</span>
        </div>
        <div class="gallery__media">
          <a class="gallery__stage" aria-haspopup="dialog" onClick={(event: MouseEvent) => {
            if (this.swiped) {
              event.preventDefault();
              this.swiped = false;
            } else if (this.items[this.selected]?.video && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0) {
              event.preventDefault();
              this.togglePlayer();
            } else if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0 && !this.items[this.selected].link && !this.image.hidden) {
              event.preventDefault();
              this.openViewer();
            }
          }}>
            <img class="gallery__image" loading="lazy" decoding="async" />
            <span class="gallery__image_error" hidden>Preview unavailable. Use the original image link.</span>
            <span class="gallery__loading" role="status" hidden>Loading image…</span>
            <span class="gallery__open" aria-hidden="true"></span>
          </a>
        </div>
        <div class="gallery__actions" hidden>
          <button type="button" class="gallery__mode" onClick={() => this.togglePlayer()}>Play video</button>
          <a class="gallery__external" target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a>
        </div>
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
        <div class="viewer__image_wrap">
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
          <button type="button" class="gallery__mode" hidden onClick={() => this.togglePlayer()}>Play video</button>
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
    this.bindPointerEvents(this.stage);
    this.bindPointerEvents(this.viewerImage.parentElement!);
    this.dialog.addEventListener('click', event => {
      if (event.target === this.dialog) this.dialog.close();
    });
    this.dialog.addEventListener('close', () => {
      this.stopPlayer();
      this.cancelSwipe();
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
        if (image === this.image && !this.items[this.selected]?.video) {
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
    const destination = image.dataset.linkOverride || (link !== source ? link : null);
    const video = youtubeVideo(destination);
    if (video) {
      number.textContent = `▶ ${number.textContent}`;
      button.setAttribute('aria-label', `Show video ${index + 1}: ${caption}`);
    }
    this.items.push({ source, caption, alt, link: destination, video, button });
  }

  private select(index: number, reveal = true) {
    this.stopPlayer();
    this.cancelSwipe();
    this.selected = (index + this.items.length) % this.items.length;
    const item = this.items[this.selected];
    const count = `${String(this.selected + 1).padStart(2, '0')} / ${String(this.items.length).padStart(2, '0')}`;
    this.setImage(this.image, item);
    this.stage.href = item.link || item.source;
    this.stage.setAttribute('aria-label', item.video ? `Play video: ${item.caption}` : item.link ? `Watch video: ${item.caption} (opens in a new tab)` : `Enlarge image ${this.selected + 1}: ${item.caption}`);
    if (item.link && !item.video) {
      this.stage.target = '_blank';
      this.stage.rel = 'noopener noreferrer';
      this.stage.removeAttribute('aria-haspopup');
    } else {
      this.stage.removeAttribute('target');
      this.stage.removeAttribute('rel');
      if (item.video) this.stage.removeAttribute('aria-haspopup');
      else this.stage.setAttribute('aria-haspopup', 'dialog');
    }
    this.shadow.querySelector('.gallery__open')!.textContent = item.video ? '▶ Play video' : item.link ? '▶ Watch video ↗' : '⤢ Enlarge image';
    this.shadow.querySelector<HTMLElement>('.gallery__actions')!.hidden = !item.video;
    const external = this.shadow.querySelector<HTMLAnchorElement>('.gallery__external')!;
    external.href = item.link || item.source;
    // Only the active view announces changes to avoid duplicate live messages.
    this.caption.setAttribute('aria-live', this.dialog.open ? 'off' : 'polite');
    this.caption.textContent = `${item.video ? 'Video' : 'Image'} ${this.selected + 1} of ${this.items.length}. ${item.caption}`;
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
    if (!this.reducedMotion) {
      image.getAnimations().forEach(animation => animation.cancel());
      image.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, easing: 'ease-out' });
    }
    image.parentElement!.querySelector<HTMLElement>('.gallery__loading')!.hidden = true;
  }

  private updateViewer() {
    const item = this.items[this.selected];
    this.setImage(this.viewerImage, item);
    this.viewerImage.parentElement!.dataset.video = String(!!item.video);
    this.viewerCaption.textContent = this.caption.textContent;
    this.viewerCounter.textContent = this.counter.textContent;
    this.dialog.querySelector<HTMLButtonElement>('.gallery__mode')!.hidden = !item.video;
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

  private togglePlayer() {
    if (this.player) {
      this.stopPlayer();
      return;
    }
    const item = this.items[this.selected];
    if (!item?.video) return;
    this.cancelSwipe();
    const player = document.createElement('iframe');
    player.className = 'gallery__player';
    player.title = `YouTube player: ${item.caption}`;
    player.src = `https://www.youtube-nocookie.com/embed/${item.video}?playsinline=1&autoplay=1`;
    player.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    player.allowFullscreen = true;
    player.referrerPolicy = 'strict-origin-when-cross-origin';
    const container = this.dialog.open ? this.viewerImage.parentElement! : this.stage.parentElement!;
    container.appendChild(player);
    this.player = player;
    // Keep the covered preview out of keyboard navigation.
    if (!this.dialog.open) this.stage.hidden = true;
    this.shadow.querySelectorAll('.gallery__mode').forEach(button => { button.textContent = 'Back to preview'; });
    player.focus({ preventScroll: true });
  }

  private stopPlayer() {
    if (!this.player) return;
    this.player.remove(); // Removing the frame also stops audio and playback.
    this.player = null;
    this.stage.hidden = false;
    this.shadow.querySelectorAll('.gallery__mode').forEach(button => { button.textContent = 'Play video'; });
  }

  private bindPointerEvents(surface: HTMLElement) {
    surface.addEventListener('pointerdown', event => this.startSwipe(event));
    surface.addEventListener('pointermove', event => this.trackPointer(event));
    surface.addEventListener('pointerup', event => this.endSwipe(event));
    surface.addEventListener('pointercancel', () => this.cancelSwipe());
    surface.addEventListener('lostpointercapture', event => {
      // Touch implicitly captures the image first. Ignore its bubbling capture
      // loss when a horizontal drag transfers capture to the surface.
      if (event.target === surface) this.cancelSwipe();
    });
    surface.addEventListener('pointerleave', () => {
      this.resetHover();
      if (!this.swiped) this.cancelSwipe();
    });
    surface.addEventListener('dragstart', event => event.preventDefault());
  }

  private resetHover() {
    this.stage.style.removeProperty('--pointer-x');
    this.stage.style.removeProperty('--pointer-y');
  }

  private startSwipe(event: PointerEvent) {
    this.swiped = false;
    if (!event.isPrimary || event.button !== 0 || this.items.length < 2) return;
    this.pointerStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
    this.gestureTarget = event.currentTarget as HTMLElement;
    // Capture after horizontal intent so a normal tap keeps its native click.
  }

  private trackPointer(event: PointerEvent) {
    const target = event.currentTarget as HTMLElement;
    if (!this.pointerStart) {
      if (event.pointerType === 'mouse' && target === this.stage && !this.reducedMotion) {
        const rect = target.getBoundingClientRect();
        target.style.setProperty('--pointer-x', `${(event.clientX - rect.left) / rect.width * 100}%`);
        target.style.setProperty('--pointer-y', `${(event.clientY - rect.top) / rect.height * 100}%`);
      }
      return;
    }
    if (this.pointerStart.id !== event.pointerId) return;
    const x = event.clientX - this.pointerStart.x;
    const y = event.clientY - this.pointerStart.y;
    if (!this.swiped && Math.abs(y) > 10 && Math.abs(y) > Math.abs(x)) {
      this.cancelSwipe();
      return;
    }
    if (Math.abs(x) > 8 && Math.abs(x) > Math.abs(y) * 1.5) {
      this.swiped = true;
      target.setPointerCapture(event.pointerId);
      target.dataset.dragging = 'true';
    }
    if (this.swiped && !this.reducedMotion) target.style.setProperty('--drag-x', `${Math.max(-100, Math.min(100, x * 0.45))}px`);
  }

  private cancelSwipe() {
    const id = this.pointerStart?.id;
    this.pointerStart = null;
    if (this.gestureTarget) {
      this.gestureTarget.removeAttribute('data-dragging');
      this.gestureTarget.style.removeProperty('--drag-x');
      if (id !== undefined && this.gestureTarget.hasPointerCapture(id)) this.gestureTarget.releasePointerCapture(id);
    }
    this.gestureTarget = null;
  }

  private endSwipe(event: PointerEvent) {
    const start = this.pointerStart;
    this.cancelSwipe();
    if (!start || start.id !== event.pointerId) return;
    const x = event.clientX - start.x;
    const y = event.clientY - start.y;
    const threshold = Math.min(70, (event.currentTarget as HTMLElement).clientWidth * 0.15);
    if (Math.abs(x) < threshold || Math.abs(x) < Math.abs(y) * 1.5) return;
    this.move(x < 0 ? 1 : -1);
    this.swiped = true;
  }
}

customElements.define('image-scroller', ImageScrollerElement);
