import { BaseElement } from './BaseElement';
import videoReelStyles from './VideoReel.css?inline';

const defaultVideos = ['carbon1.mp4', 'xenon1.mp4', 'silicon1.mp4', 'helium1.mp4', 'xenon2.mp4'];

const dimension = (value: string | null, fallback: number): number => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export class VideoReelElement extends BaseElement {
  static observedAttributes = ['video-dir', 'width', 'height'];
  
  private videoContainer: HTMLDivElement | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private videos: string[] = [];
  private videoIndex = 0;
  private swapping = false;
  private videoDir = '/etc/antistatic/clips/';
  private preloadLink: HTMLLinkElement | null = null;
  
  constructor() {
    super(videoReelStyles);
  }

  private getVideos(): string[] {
    const videoList = this.getAttribute('videos');
    if (videoList) {
      const videos = videoList.split(',').map(v => v.trim()).filter(Boolean);
      if (videos.length > 0) return videos;
    }

    return defaultVideos;
  }

  private preloadNextVideo(): void {
    const nextIndex = (this.videoIndex + 1) % this.videos.length;
    this.preloadLink?.remove();
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = `${this.videoDir}${this.videos[nextIndex]}`;
    link.as = 'video';
    link.type = 'video/mp4';
    document.head.appendChild(link);
    this.preloadLink = link;
  }

  private playNextVideo(): void {
    this.videoIndex = (this.videoIndex + 1) % this.videos.length;
    if (!this.videoElement) return;
    this.videoElement.currentTime = 0;
    this.videoElement.src = `${this.videoDir}${this.videos[this.videoIndex]}`;
    this.videoElement.load();
    this.preloadNextVideo();
  }

  connectedCallback() {
    const width = dimension(this.getAttribute('width'), 480);
    const height = dimension(this.getAttribute('height'), 270);

    let videoContainer: HTMLDivElement | null = null;
    let videoElement: HTMLVideoElement | null = null;

    this.render(
      <div
        class="video-container"
        ref={(el: Element) => {
          videoContainer = el as HTMLDivElement;
        }}
      >
        <video
          width={width}
          height={height}
          muted={true}
          playsInline={true}
          ref={(el: Element) => {
            videoElement = el as HTMLVideoElement;
          }}
        ></video>
      </div>
    );

    this.videoContainer = videoContainer;
    this.videoElement = videoElement;
    if (!this.videoElement || !this.videoContainer) return;
    const videoEl = this.videoElement as HTMLVideoElement;

    this.videos = this.getVideos();
    if (this.getAttribute('video-dir')) {
      this.videoDir = this.getAttribute('video-dir') ?? this.videoDir;
    }

    videoEl.src = `${this.videoDir}${this.videos[0]}`;

    this.setupEventListeners();

    videoEl.play().catch((err: unknown) => {
      console.warn('Autoplay not allowed:', err);

      const playButton = (
        <button
          class="play-button"
          onClick={() => {
            this.videoElement?.play();
            (playButton as HTMLElement).remove();
          }}
        >
          Play
        </button>
      ) as HTMLElement;

      this.videoContainer?.appendChild(playButton);
    });
    
    this.preloadNextVideo();
  }

  setupEventListeners() {
    if (!this.videoElement) return;
    const videoElement = this.videoElement;

    videoElement.addEventListener('ended', () => {
      if (this.swapping) return;

      this.swapping = true;
      videoElement.style.opacity = '0';
    });

    videoElement.addEventListener('timeupdate', () => {
      if (!this.swapping && videoElement.currentTime > videoElement.duration - 0.2) {
        this.swapping = true;
        videoElement.style.opacity = '0';
      }
    });

    videoElement.addEventListener('transitionend', () => {
      if (!this.swapping) return;

      this.playNextVideo();
    });

    videoElement.addEventListener('canplaythrough', () => {
      if (!this.swapping) return;

      videoElement.play();
      this.swapping = false;
    });

    videoElement.addEventListener('play', () => {
      videoElement.style.opacity = '1';
    });

    videoElement.addEventListener('mouseenter', () => {
      videoElement.controls = true;
    });

    videoElement.addEventListener('mouseleave', () => {
      videoElement.controls = false;
    });
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (!this.videoElement) return;
    
    switch (name) {
      case 'video-dir':
        this.videoDir = newValue;
        break;
      case 'width':
        this.videoElement.width = dimension(newValue, 480);
        break;
      case 'height':
        this.videoElement.height = dimension(newValue, 270);
        break;
    }
  }

  disconnectedCallback() {
    this.preloadLink?.remove();
    this.preloadLink = null;
    if (this.videoElement) {
      this.videoElement.pause();
      this.videoElement.src = '';
      this.videoElement.load();
    }
  }
}

customElements.define('video-reel', VideoReelElement);
