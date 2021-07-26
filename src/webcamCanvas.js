import {WEBCAM_MIRROR_CAMERA, WEBCAM_VIDEO_SIZE} from './constants'
import Mindrawing from 'mindrawingjs'
import {drawAll} from './posedrawing'

export class WebcamCanvas {
  constructor() {
    this.d = canvasSetup()
    this.posecanvas = new OffscreenCanvas(WEBCAM_VIDEO_SIZE.x, WEBCAM_VIDEO_SIZE.y)
  }

  async draw(frame, poses) {
    const ctx = this.d.getCtx()
    
    if (WEBCAM_MIRROR_CAMERA) {
      ctx.setTransform(-1, 0, 0, 1, this.d.width, 0)
    }
    // draw webcam frame
    ctx.drawImage(frame, 0, 0, this.d.width, this.d.height)

    // unmirror the canvas again
    if (WEBCAM_MIRROR_CAMERA) {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
    }

    // draw poses
    if (poses.length > 0) {
      const ctx2 = this.posecanvas.getContext('2d')
      ctx2.clearRect(0, 0, this.posecanvas.width, this.posecanvas.height)
      drawAll(ctx2, poses)

      ctx.drawImage(this.posecanvas, 0, 0, this.d.width, this.d.height)
    }
  }
}

const canvasSetup = () => {
  const d = new Mindrawing()
  d.setup('debug-canvas')
  d.background('black')
  
  return d
}
