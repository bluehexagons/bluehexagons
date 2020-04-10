'use strict'
const intro = document.getElementById('intro') as HTMLVideoElement
if (intro) {
  const testPause = () => {
    if (intro.currentTime > 12.33) {
      intro.pause()
    }
  }
  intro.addEventListener('ended', () => {
    intro.addEventListener('timeupdate', testPause)
    intro.currentTime = 0
    intro.play()
  })
  const togglePlay = () => {
    if (intro.paused) {
      intro.muted = false
      intro.removeEventListener('timeupdate', testPause)
      intro.play()
    } else {
      intro.pause()
    }
  }
  intro.addEventListener('timeupdate', testPause)

  intro.addEventListener('click', togglePlay)
}

const reels = document.getElementsByClassName('reel') as HTMLCollectionOf<HTMLDivElement>
for (let i = 0; i < reels.length; i++) {
  const reelContainerContainer = reels[i]
  const reelContainer = document.createElement('div')
  const reel = document.createElement('video')
  const videoDir = 'assets/clips/'
  const videos = ['carbon1.mp4', 'xenon1.mp4', 'silicon1.mp4', 'helium1.mp4', 'xenon2.mp4']
  let videoIndex = 1
  let swapping = false
  reel.width = 480
  reel.height = 270
  reel.muted = true
  reel.src = videoDir + videos[0]
  reel.play()
  reel.addEventListener('ended', () => {
    if (swapping) {
      return
    }
    swapping = true
    reel.style.opacity = '0'
  })
  reel.addEventListener('timeupdate', () => {
    if (!swapping && reel.currentTime > reel.duration - 0.2) {
      swapping = true
      reel.style.opacity = '0'
    }
  })
  reel.addEventListener('transitionend', () => {
    if (!swapping) {
      return
    }
    reel.currentTime = 0
    reel.src = videoDir + videos[videoIndex]
    reel.load()
    videoIndex = (videoIndex + 1) % videos.length
  })
  reel.addEventListener('canplaythrough', () => {
    if (!swapping) {
      return
    }
    reel.play()
    swapping = false
  })
  reel.addEventListener('play', () => {
    reel.style.opacity = '1'
  })
  reel.addEventListener('mouseenter', () => {
    reel.controls = true
  })
  reel.addEventListener('mouseleave', () => {
    reel.controls = false
  })

  reelContainer.appendChild(reel)
  reelContainerContainer.appendChild(reelContainer)
}