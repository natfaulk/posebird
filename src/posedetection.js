import Mindrawing from 'mindrawingjs'
import makeLogger from '@natfaulk/supersimplelogger'
// needed for posenet to work
import '@tensorflow/tfjs'
import * as Posenet from '@tensorflow-models/posenet'
import {drawAll} from './posedrawing'
 
const lg = makeLogger('Pose detect')
const VIDEO_SIZE = {
  x: 1280,
  y: 720
}
const MIRROR_CAMERA = true

export class PoseDetection {
  constructor(stats = null) {
    this.stats = stats

    this.d = canvasSetup()
    this.posecanvas = new OffscreenCanvas(VIDEO_SIZE.x, VIDEO_SIZE.y)
    this.video = null

    this.videoReady = false
    this.posenetReady = false
    // is async, but sets a flag once it is done
    this.cameraSetup()
    this.posenetSetup()

    this.lasttime = performance.now()
    this.framerate = 0
    this.scaleFactor = {
      x: this.d.width / VIDEO_SIZE.x,
      y: this.d.height / VIDEO_SIZE.y
    }
  }

  async cameraSetup() {
    this.video = await cameraSetup()
    if (this.video !== null) {
      this.video.addEventListener('loadeddata', () => {
        // 'this' is from outside scope as arrow function has no this
        this.videoReady = true
        lg('Video device ready')
      })
    }
  }

  async posenetSetup() {
    this.posenet = await loadPosenet()
    this.posenetReady = true
  }

  async update() {
    const ctx = this.d.getCtx()

    
    if (this.posenetReady && this.videoReady) {
      const poses = await this.posenet.estimatePoses(this.video, {
        flipHorizontal: true,
        decodingMethod: 'multi-person',
        maxDetections: 5,
        scoreThreshold: 0.1,
        nmsRadius: 30
      })
      const posesOut = []
      poses.forEach(({score, keypoints}) => {
        if (score >= 0.15) {
          posesOut.push({
            kps: keypoints,
            adjKps: Posenet.getAdjacentKeyPoints(keypoints, 0.1)
          })
        }
      })
      
      if (MIRROR_CAMERA) {
        ctx.setTransform(-1, 0, 0, 1, this.d.width, 0)
      }
      ctx.drawImage(this.video, 0, 0, this.d.width, this.d.height)

      // unmirror the canvas again
      if (MIRROR_CAMERA) {
        ctx.setTransform(1, 0, 0, 1, 0, 0)
      }

      // this.d.fill('blue')
      // this.d.rect(50, 50, 50, 50)
    // }

    // if (this.posenetReady && this.videoReady) {
      

      const t = performance.now()
      this.framerate = t - this.lasttime
      this.lasttime = t
      if (this.stats !== null) {
        this.stats.setStat('poseFPS', 1000/this.framerate)
        // lg(1000/this.framerate)
      }

      
      
      if (posesOut.length > 0) {
        const ctx2 = this.posecanvas.getContext('2d')
        ctx2.clearRect(0, 0, this.posecanvas.width, this.posecanvas.height)
        // ctx.scale(
        //   this.scaleFactor.x,
        //   this.scaleFactor.y
        // )

        drawAll(ctx2, posesOut)
        // worker.postMessage({
        //   poses: posesOut
        // })

        // ctx.scale(
        //   1 / this.scaleFactor.x,
        //   1 / this.scaleFactor.y
        // )


        ctx.drawImage(this.posecanvas, 0, 0, this.d.width, this.d.height)

        lg(posesOut)
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

const cameraSetup = async () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    lg('Browser API navigator.mediaDevices.getUserMedia not available')
    return null
  }

  const video = document.getElementById('video')
  video.width = VIDEO_SIZE.x
  video.height = VIDEO_SIZE.y

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      'audio': false,
      'video': {
        width: VIDEO_SIZE.x,
        height: VIDEO_SIZE.y,
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

const loadPosenet = async () => {
  const net = await Posenet.load({
    architecture: 'MobileNetV1',
    outputStride: 16,
    inputResolution: {width: 320, height: 240},
    multiplier: 0.75
  })

  return net
}
