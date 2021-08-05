import {WEBCAM_MIRROR_CAMERA, WEBCAM_VIDEO_SIZE} from './constants'
import Mindrawing from 'mindrawingjs'
import {drawAll} from './posedrawing'
import makeLogger from '@natfaulk/supersimplelogger'
import {showUseChromeAlert} from './ui'

const lg = makeLogger('WebcamCanvas')

export class WebcamCanvas {
  constructor() {
    this.d = canvasSetup()
    try {
      this.posecanvas = new OffscreenCanvas(WEBCAM_VIDEO_SIZE.x, WEBCAM_VIDEO_SIZE.y)
    } catch {
      lg('No offscreen canvas implementation, for best results use chrome')
      this.posecanvas = null
      showUseChromeAlert()
    }
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
      if (this.posecanvas !== null) {
        const ctx2 = this.posecanvas.getContext('2d')
        ctx2.clearRect(0, 0, this.posecanvas.width, this.posecanvas.height)
        drawAll(ctx2, poses)
  
        ctx.drawImage(this.posecanvas, 0, 0, this.d.width, this.d.height)
      } else {
        const hscale = this.d.width / WEBCAM_VIDEO_SIZE.x
        const vscale = this.d.height / WEBCAM_VIDEO_SIZE.y
        ctx.setTransform(hscale, 0, 0, vscale, 0, 0)
        drawAll(ctx, poses)
        ctx.setTransform(-hscale, 0, 0, -vscale, 0, 0)
      }
    }
  }
}

const canvasSetup = () => {
  const d = new Mindrawing()
  d.setup('debug-canvas')
  d.background('black')
  
  return d
}
