// @tensorflow/tfjs is needed for posenet to work
import '@tensorflow/tfjs'
import * as Posenet from '@tensorflow-models/posenet'
import {POSE_MIN_PART_CONFIDENCE, POSE_MIN_POSE_CONFIDENCE} from './constants'
import makeLogger from '@natfaulk/supersimplelogger'

const lg = makeLogger('PoseDetection')
 
class PoseDetection {
  constructor() {
    this.posenetReady = false
  }

  async posenetSetup() {
    this.posenet = await loadPosenet()
    this.posenetReady = true
  }

  async update(frame) {
    if (!this.posenetReady) return []

    const poses = await this.posenet.estimatePoses(frame, {
      flipHorizontal: true,
      decodingMethod: 'multi-person',
      maxDetections: 5,
      scoreThreshold: POSE_MIN_PART_CONFIDENCE,
      nmsRadius: 30
    })

    const posesOut = []
    poses.forEach(({score, keypoints}) => {
      if (score >= POSE_MIN_POSE_CONFIDENCE) {
        posesOut.push({
          kps: keypoints,
          adjKps: Posenet.getAdjacentKeyPoints(keypoints, POSE_MIN_PART_CONFIDENCE)
        })
      }
    })

    return posesOut
  }
}

const loadPosenet = async () => {
  const settings = {
    architecture: 'MobileNetV1',
    outputStride: 16,
    inputResolution: {width: 320, height: 240},
    multiplier: 0.75
  }

  try {
    const net = await Posenet.load(settings)
    return net
  } catch (e) {
    // most likely if this is running on localhost with no network connection
    lg(e)
    lg('Failed to load posenet from google cloud, trying local version')

    settings.modelUrl = makeLocalURL(settings)
    lg(`Loading from: ${settings.modelUrl}`)
    const net = await Posenet.load(settings)
    
    // and if this fails then everything to do with pose detection will break
    return net
  }
}

const baseurl = 'public/posenet/'
const makeLocalURL = settings => {
  let out = baseurl

  if (settings.multiplier === 0.5) out += '50'
  else out += '75'

  if (settings.outputStride === 8) out += '/model-stride8.json'
  else out += '/model-stride16.json'

  return out
}

export const newPoseDetection = async () => {
  const pd = new PoseDetection
  await pd.posenetSetup()

  return pd
}
