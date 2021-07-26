// import makeLogger from '@natfaulk/supersimplelogger'
import {POSE_MIN_PART_CONFIDENCE} from './constants'

// const lg = makeLogger('PoseControl')

const LEFT_SHOULDER = 'leftShoulder'
const RIGHT_SHOULDER = 'rightShoulder'

export class PoseControls {
  constructor() {
    this.shoulderAngle = 0
  }
  
  update(poses) {
    this.decodeShoulderAngle(poses)
  }

  decodeShoulderAngle(poses) {
    if (poses.length === 0) return
    // would be more efficient to fetch all at once...
    // currently just taking the first pose...
    const ls = getBodyPart(LEFT_SHOULDER, poses[0])
    const rs = getBodyPart(RIGHT_SHOULDER, poses[0])
    if (ls !== null && rs !== null) {
      const dx = rs.position.x - ls.position.x
      const dy = rs.position.y - ls.position.y
  
      this.shoulderAngle = Math.atan2(dy, dx)
    }
  }  
}

const getBodyPart = (part, poses) => {
  const kps = poses.kps

  for (let i = 0; i < kps.length; i++) {
    if (kps[i].part === part) {
      if (kps[i].score > POSE_MIN_PART_CONFIDENCE) return kps[i]
      return null
    }
  }

  return null
}
