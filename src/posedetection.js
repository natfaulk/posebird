// @tensorflow/tfjs is needed for posenet to work
import '@tensorflow/tfjs'
import * as Posenet from '@tensorflow-models/posenet'
 
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
