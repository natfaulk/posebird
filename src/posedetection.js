import Mindrawing from 'mindrawingjs'
import makeLogger from '@natfaulk/supersimplelogger'
// needed for posenet to work
import '@tensorflow/tfjs'
import * as Posenet from '@tensorflow-models/posenet'


const lg = makeLogger('Pose')
const VIDEO_SIZE = {
  x: 1280,
  y: 720
}
const MIRROR_CAMERA = true

export class PoseDetection {
  constructor() {
    this.d = canvasSetup()
    this.video = null

    this.videoReady = false
    this.posenetReady = false
    // is async, but sets a flag once it is done
    this.cameraSetup()
    this.posenetSetup()
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
    if (this.videoReady) {
      const ctx = this.d.getCtx()
      
      if (MIRROR_CAMERA) {
        ctx.setTransform(-1, 0, 0, 1, this.d.width, 0)
      }
      ctx.drawImage(this.video, 0, 0, this.d.width, this.d.height)

      // // unmirror the canvas again
      // if (MIRROR_CAMERA) {
      //   ctx.setTransform(1, 0, 0, 1, 0, 0)
      // }

      // this.d.fill('blue')
      // this.d.rect(50, 50, 50, 50)
    }

    if (this.posenetReady && this.videoReady) {
      const poses = await this.posenet.estimatePoses(this.video, {
        flipHorizontal: true,
        decodingMethod: 'multi-person',
        maxDetections: 5,
        scoreThreshold: 0.1,
        nmsRadius: 30
      })

      // lg(poses)
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
