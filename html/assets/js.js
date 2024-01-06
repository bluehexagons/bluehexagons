'use strict';
const initializeReels = () => {
    const reels = document.getElementsByClassName('reel');
    for (const reelContainerContainer of reels) {
        const reelContainer = document.createElement('div');
        const reel = document.createElement('video');
        const videoDir = 'assets/clips/';
        const videos = ['carbon1.mp4', 'xenon1.mp4', 'silicon1.mp4', 'helium1.mp4', 'xenon2.mp4'];
        let videoIndex = 1;
        let swapping = false;
        reel.width = 480;
        reel.height = 270;
        reel.muted = true;
        reel.src = videoDir + videos[0];
        reel.play();
        reel.addEventListener('ended', () => {
            if (swapping) {
                return;
            }
            swapping = true;
            reel.style.opacity = '0';
        });
        reel.addEventListener('timeupdate', () => {
            if (!swapping && reel.currentTime > reel.duration - 0.2) {
                swapping = true;
                reel.style.opacity = '0';
            }
        });
        reel.addEventListener('transitionend', () => {
            if (!swapping) {
                return;
            }
            reel.currentTime = 0;
            reel.src = videoDir + videos[videoIndex];
            reel.load();
            videoIndex = (videoIndex + 1) % videos.length;
        });
        reel.addEventListener('canplaythrough', () => {
            if (!swapping) {
                return;
            }
            reel.play();
            swapping = false;
        });
        reel.addEventListener('play', () => {
            reel.style.opacity = '1';
        });
        reel.addEventListener('mouseenter', () => {
            reel.controls = true;
        });
        reel.addEventListener('mouseleave', () => {
            reel.controls = false;
        });
        reelContainer.appendChild(reel);
        reelContainerContainer.appendChild(reelContainer);
    }
};
const findLastDot = /\.(?=[^.]*$)/;
const findSuffix = / \(Phone\)\./;
const findThumbs = /(thumbs\/|( |\%20)\(Phone\))/g;
const makeImageScroller = (scroller) => {
    let selectedImageIndex = 0;
    for (const img of scroller.querySelectorAll(':scope > img')) {
        const link = document.createElement('a');
        const thumbnail = img.src;
        const fullsize = thumbnail.replace(findThumbs, '');
        link.href = fullsize;
        img.parentElement.replaceChild(link, img);
        link.appendChild(img);
    }
};
const initializeImageScrollers = () => {
    const imageScrollers = document.getElementsByClassName('imageScroller');
    for (const div of imageScrollers) {
        makeImageScroller(div);
    }
};
initializeReels();
initializeImageScrollers();
//# sourceMappingURL=js.js.map