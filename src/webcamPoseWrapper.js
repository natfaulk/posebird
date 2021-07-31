import {newWebcam} from './webcam'
import {WebcamCanvas} from './webcamCanvas'
import {newPoseDetection} from './posedetection'
import {PoseControls} from './poseController'


class WebcamPoseWrapper {
  constructor(stats = null) {
    this.stats = stats
    this.lastVideoTime = 0
    this.lasttime = performance.now()
    this.framerate = 0
  }


  async setup() {
    this.webcam = await newWebcam()
    this.webcamCanvas = new WebcamCanvas
    this.poseDetect = await newPoseDetection()
    this.controls = new PoseControls
  }

  async update() {
    const frame = this.webcam.getNewFrame()
    if (frame === null) return
    this.updateFPS()

    const poses = await this.poseDetect.update(frame)
    
    this.controls.update(poses)
    this.stats.setStat('shoulder', this.controls.shoulderAngle)
    this.stats.setStat('arm', this.controls.armAngle)

    this.webcamCanvas.draw(frame, poses)
  }

  updateFPS() {
    const t = performance.now()
    this.framerate = t - this.lasttime
    this.lasttime = t
    if (this.stats !== null) {
      this.stats.setStat('poseFPS', 1000/this.framerate)
    }
  }

  getShoulderAngle() {
    return this.controls.shoulderAngle
  }

  getArmAngle() {
    return this.controls.armAngle
  }

  isReady() {
    return (this.webcam.videoReady && this.poseDetect.posenetReady)
  }
}

export const newWebcamPoseWrapper = async (stats = null) => {
  const wpw = new WebcamPoseWrapper(stats)
  await wpw.setup()
  return wpw
}
