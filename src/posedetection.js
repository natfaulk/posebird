// @tensorflow/tfjs is needed for posenet to work
import '@tensorflow/tfjs'
import * as Posenet from '@tensorflow-models/posenet'
import {POSE_MIN_PART_CONFIDENCE, POSE_MIN_POSE_CONFIDENCE} from './constants'
 
export class PoseDetection {
  constructor() {
    this.posenetReady = false

    // is async, but sets a flag once it is done
    this.posenetSetup()
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
  const net = await Posenet.load({
    architecture: 'MobileNetV1',
    outputStride: 16,
    inputResolution: {width: 320, height: 240},
    multiplier: 0.75
  })

  return net
}
