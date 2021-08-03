import makeLogger from '@natfaulk/supersimplelogger'
import {POSE_MIN_PART_CONFIDENCE, SHOULDER_ANGLE_SMOOTHING, ARM_ANGLE_SMOOTHING} from './constants'
import {smooth} from './utils'

const lg = makeLogger('PoseControl')

const LEFT_SHOULDER = 'leftShoulder'
const RIGHT_SHOULDER = 'rightShoulder'
const LEFT_ELBOW = 'leftElbow'
const RIGHT_ELBOW = 'rightElbow'
const LEFT_WRIST = 'leftWrist'
const RIGHT_WRIST = 'rightWrist'

export class PoseControls {
  constructor() {
    this.shoulderAngle = 0
    this.armAngle = 0
    this.poseId = 0
  }
  
  update(poses) {
    if (poses.length === 0) 
    {
      lg('No body parts found')
      return
    }

    const bodyParts = getBodyParts([
      LEFT_SHOULDER,
      RIGHT_SHOULDER,
      LEFT_ELBOW,
      RIGHT_ELBOW,
      LEFT_WRIST,
      RIGHT_WRIST
    ], poses[0])
    
    this.decodeShoulderAngle(bodyParts)
    this.decodeArmAngle(bodyParts)
    this.nextPoseId()
  }

  decodeShoulderAngle(bodyParts) {
    const ls = bodyParts[LEFT_SHOULDER]
    const rs = bodyParts[RIGHT_SHOULDER]

    if (ls !== undefined && rs !== undefined) {
      const dx = rs.position.x - ls.position.x
      const dy = rs.position.y - ls.position.y
  
      this.setShoulderAngle(Math.atan2(dy, dx))
    }
  }

  decodeArmAngle(bodyParts) {
    const la = decodeLeftArmAngle(bodyParts)
    const ra = decodeRightArmAngle(bodyParts)

    if (la === null && ra === null) return
    if (la === null) {
      this.setArmAngle(ra)
      return
    }
    if (ra === null) {
      this.setArmAngle(la)
      return
    }

    // just average for now
    // should take into account how leaning a person is?
    this.setArmAngle((la + ra) / 2)
  }

  // smoothes before setting
  setShoulderAngle(val) {
    this.shoulderAngle = smooth(val, this.shoulderAngle, SHOULDER_ANGLE_SMOOTHING)
  }

  // smoothes before setting
  setArmAngle(val) {
    this.armAngle = smooth(val, this.armAngle, ARM_ANGLE_SMOOTHING)
  }

  nextPoseId() {
    this.poseId += 1
  }
}

const getBodyParts = (partList, poses) => {
  const kps = poses.kps

  const out = {}
  for (let i = 0; i < kps.length; i++) {
    if (
      kps[i].score > POSE_MIN_PART_CONFIDENCE
      && partList.includes(kps[i].part)
    ) out[kps[i].part] = kps[i]
  }

  return out
}

const decodeLeftArmAngle = bodyParts => {
  const ls = bodyParts[LEFT_SHOULDER]
  const le = bodyParts[LEFT_ELBOW]
  const lw = bodyParts[LEFT_WRIST]

  let out = 0
  
  // for now return if shoulder undefined - could probs just use arm segment instead?
  if (ls === undefined) return null
  if (le === undefined && lw === undefined) return null
  if (lw === undefined) {
    const dx = le.position.x - ls.position.x
    const dy = le.position.y - ls.position.y
    out =  Math.atan2(dy, dx)
  } else {
    const dx = lw.position.x - ls.position.x
    const dy = lw.position.y - ls.position.y
    out = Math.atan2(dy, dx)
  }

  // scale as if reflected in x axis - ie overlaid over right arm
  if (out > 0) out -= Math.PI
  else out += Math.PI
  out *= -1

  return out
}

const decodeRightArmAngle = bodyParts => {
  const rs = bodyParts[RIGHT_SHOULDER]
  const re = bodyParts[RIGHT_ELBOW]
  const rw = bodyParts[RIGHT_WRIST]

  // for now return if shoulder undefined - could probs just use arm segment instead?
  if (rs === undefined) return null
  if (re === undefined && rw === undefined) return null
  if (rw === undefined) {
    const dx = re.position.x - rs.position.x
    const dy = re.position.y - rs.position.y
    return Math.atan2(dy, dx)
  } else {
    const dx = rw.position.x - rs.position.x
    const dy = rw.position.y - rs.position.y
    return Math.atan2(dy, dx)
  }
}
