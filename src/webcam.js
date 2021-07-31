import {WEBCAM_VIDEO_SIZE} from './constants'
import makeLogger from '@natfaulk/supersimplelogger'

const lg = makeLogger('Webcam')

class Webcam {
  constructor() {
    this.video = null
    this.videoReady = false
    this.prevFrame = 0
  }

  // if there is a new frame returns frame else returns null
  getNewFrame() {
    if (!this.videoReady) return null
    if (this.video.currentTime === this.prevFrame) return null

    this.prevFrame = this.video.currentTime
    return this.video
  }

  async cameraSetup() {
    this.video = await cameraSetup()
    if (this.video !== null) {
      await this.waitForVideoLoadeddata()
      return true
    }

    return false
  }

  waitForVideoLoadeddata() {
    return new Promise(resolve => {
      this.video.addEventListener('loadeddata', () => {
        // 'this' is from outside scope as arrow function has no this
        this.videoReady = true
        lg('Video device ready')

        resolve()
      })
    })
  }
}

const cameraSetup = async () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    lg('Browser API navigator.mediaDevices.getUserMedia not available')
    return null
  }

  const video = document.getElementById('video')
  video.width = WEBCAM_VIDEO_SIZE.x
  video.height = WEBCAM_VIDEO_SIZE.y

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      'audio': false,
      'video': {
        width: WEBCAM_VIDEO_SIZE.x,
        height: WEBCAM_VIDEO_SIZE.y,
      },
    })
    video.srcObject = stream
    video.play()
    return video
  } catch (_err) {
    if (_err.name === 'NotFoundError') lg('No camera attached!')
    else lg(_err)

    return null
  }
}

export const newWebcam = async () => {
  const w = new Webcam()
  if (!await w.cameraSetup()) {
    lg('Webcam failed to load!')
  }

  return w
}
