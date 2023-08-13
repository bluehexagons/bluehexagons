'use strict';
var intro = document.getElementById('intro');
if (intro) {
    var testPause_1 = function () {
        if (intro.currentTime > 12.33) {
            intro.pause();
        }
    };
    intro.addEventListener('ended', function () {
        intro.addEventListener('timeupdate', testPause_1);
        intro.currentTime = 0;
        intro.play();
    });
    var togglePlay = function () {
        if (intro.paused) {
            intro.muted = false;
            intro.removeEventListener('timeupdate', testPause_1);
            intro.play();
        }
        else {
            intro.pause();
        }
    };
    intro.addEventListener('timeupdate', testPause_1);
    intro.addEventListener('click', togglePlay);
}
var reels = document.getElementsByClassName('reel');
var _loop_1 = function (i) {
    var reelContainerContainer = reels[i];
    var reelContainer = document.createElement('div');
    var reel = document.createElement('video');
    var videoDir = 'assets/clips/';
    var videos = ['carbon1.mp4', 'xenon1.mp4', 'silicon1.mp4', 'helium1.mp4', 'xenon2.mp4'];
    var videoIndex = 1;
    var swapping = false;
    reel.width = 480;
    reel.height = 270;
    reel.muted = true;
    reel.src = videoDir + videos[0];
    reel.play();
    reel.addEventListener('ended', function () {
        if (swapping) {
            return;
        }
        swapping = true;
        reel.style.opacity = '0';
    });
    reel.addEventListener('timeupdate', function () {
        if (!swapping && reel.currentTime > reel.duration - 0.2) {
            swapping = true;
            reel.style.opacity = '0';
        }
    });
    reel.addEventListener('transitionend', function () {
        if (!swapping) {
            return;
        }
        reel.currentTime = 0;
        reel.src = videoDir + videos[videoIndex];
        reel.load();
        videoIndex = (videoIndex + 1) % videos.length;
    });
    reel.addEventListener('canplaythrough', function () {
        if (!swapping) {
            return;
        }
        reel.play();
        swapping = false;
    });
    reel.addEventListener('play', function () {
        reel.style.opacity = '1';
    });
    reel.addEventListener('mouseenter', function () {
        reel.controls = true;
    });
    reel.addEventListener('mouseleave', function () {
        reel.controls = false;
    });
    reelContainer.appendChild(reel);
    reelContainerContainer.appendChild(reelContainer);
};
for (var i = 0; i < reels.length; i++) {
    _loop_1(i);
}
//# sourceMappingURL=js.js.map