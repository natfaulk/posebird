import {Webcam} from './webcam'
import {WebcamCanvas} from './webcamCanvas'
import {PoseDetection} from './posedetection'
import {PoseControls} from './poseController'


export class WebcamPoseWrapper {
  constructor(stats = null) {
    this.stats = stats

    this.webcam = new Webcam
    this.webcamCanvas = new WebcamCanvas
    this.poseDetect = new PoseDetection
    this.controls = new PoseControls

    this.lastVideoTime = 0
    this.lasttime = performance.now()
    this.framerate = 0
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
}
