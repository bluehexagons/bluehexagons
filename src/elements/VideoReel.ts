import { BaseElement, createElementWithClass } from './BaseElement';
import videoReelStyles from './VideoReel.css?inline';

export class VideoReelElement extends BaseElement {
  static observedAttributes = ['video-dir', 'width', 'height'];
  
  private videoContainer: HTMLDivElement;
  private videoElement: HTMLVideoElement;
  private videos: string[] = [];
  private videoIndex = 0;
  private swapping = false;
  private videoDir = '/etc/antistatic/clips/';
  
  constructor() {
    super();
    this.injectStyles(videoReelStyles);
  }

  private getVideos(): string[] {
    const videoList = this.getAttribute('videos');
    if (videoList) {
      return videoList.split(',').map(v => v.trim());
    }
    
    return ['carbon1.mp4', 'xenon1.mp4', 'silicon1.mp4', 'helium1.mp4', 'xenon2.mp4'];
  }

  private preloadNextVideo(): void {
    const nextIndex = (this.videoIndex + 1) % this.videos.length;
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = `${this.videoDir}${this.videos[nextIndex]}`;
    link.as = 'video';
    link.type = 'video/mp4';
    document.head.appendChild(link);
  }

  private playNextVideo(): void {
    this.videoIndex = (this.videoIndex + 1) % this.videos.length;
    this.videoElement.currentTime = 0;
    this.videoElement.src = `${this.videoDir}${this.videos[this.videoIndex]}`;
    this.videoElement.load();
    this.preloadNextVideo();
  }

  connectedCallback() {
    this.videoContainer = createElementWithClass<HTMLDivElement>('div', 'video-container');
    this.shadow.appendChild(this.videoContainer);

    this.videoElement = document.createElement('video');
    
    const width = this.getAttribute('width') || '480';
    const height = this.getAttribute('height') || '270';
    this.videoElement.width = parseInt(width);
    this.videoElement.height = parseInt(height);
    this.videoElement.muted = true;
    
    this.videos = this.getVideos();
    if (this.getAttribute('video-dir')) {
      this.videoDir = this.getAttribute('video-dir');
    }
    
    this.videoElement.src = `${this.videoDir}${this.videos[0]}`;
    this.videoContainer.appendChild(this.videoElement);
    
    this.setupEventListeners();
    
    this.videoElement.play().catch(err => {
      console.warn('Autoplay not allowed:', err);
      
      const playButton = document.createElement('button');
      playButton.textContent = 'Play';
      playButton.className = 'play-button';
      playButton.onclick = () => {
        this.videoElement.play();
        playButton.remove();
      };
      this.videoContainer.appendChild(playButton);
    });
    
    this.preloadNextVideo();
  }

  setupEventListeners() {
    this.videoElement.addEventListener('ended', () => {
      if (this.swapping) return;

      this.swapping = true;
      this.videoElement.style.opacity = '0';
    });

    this.videoElement.addEventListener('timeupdate', () => {
      if (!this.swapping && this.videoElement.currentTime > this.videoElement.duration - 0.2) {
        this.swapping = true;
        this.videoElement.style.opacity = '0';
      }
    });

    this.videoElement.addEventListener('transitionend', () => {
      if (!this.swapping) return;

      this.playNextVideo();
    });

    this.videoElement.addEventListener('canplaythrough', () => {
      if (!this.swapping) return;

      this.videoElement.play();
      this.swapping = false;
    });

    this.videoElement.addEventListener('play', () => {
      this.videoElement.style.opacity = '1';
    });

    this.videoElement.addEventListener('mouseenter', () => {
      this.videoElement.controls = true;
    });

    this.videoElement.addEventListener('mouseleave', () => {
      this.videoElement.controls = false;
    });
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (!this.videoElement) return;
    
    switch (name) {
      case 'video-dir':
        this.videoDir = newValue;
        break;
      case 'width':
        this.videoElement.width = parseInt(newValue);
        break;
      case 'height':
        this.videoElement.height = parseInt(newValue);
        break;
    }
  }

  disconnectedCallback() {
    if (this.videoElement) {
      this.videoElement.pause();
      this.videoElement.src = '';
      this.videoElement.load();
    }
  }
}

customElements.define('video-reel', VideoReelElement);