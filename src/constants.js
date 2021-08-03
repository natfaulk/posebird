export const FLOOR_WIDTH = 20
// extra strips up side of floor to hide edge of world
export const FLOOR_OVERHANG = 20
export const FLOOR_DEPTH = 20
export const FLOOR_SQ_SIZE = 1

export const PILLAR_WIDTH = 0.5
export const PILLAR_HEIGHT = 10
export const PILLAR_COLOR = 0x66563c

export const CAMERA_FOV = 75
export const CAMERA_NEAR = 0.1
export const CAMERA_FAR = 1000
export const CAMERA_CLEAR_COLOR = 0xb8c6db

export const CAMERA_POS_X = 0
export const CAMERA_POS_Y = 3
export const CAMERA_POS_Z = 8

export const CAMERA_BIRD_OFFSET_X = 0
export const CAMERA_BIRD_OFFSET_Y = -0.3
export const CAMERA_BIRD_OFFSET_Z = -1

export const BIRD_INIT_POS_X = CAMERA_POS_X + CAMERA_BIRD_OFFSET_X
export const BIRD_INIT_POS_Y = CAMERA_POS_Y + CAMERA_BIRD_OFFSET_Y
export const BIRD_INIT_POS_Z = CAMERA_POS_Z + CAMERA_BIRD_OFFSET_Z

export const BIRD_MAX_SPEED_X = 2 // m/s

export const PILLAR_SPEED = 1.2 // m/s
export const PILLAR_SPACING = 2 // m

export const SHOW_BOUNDING_BOXES = false
export const BOUNDING_BOX_COLOR = 0xff0000

export const WEBCAM_VIDEO_SIZE = {
  x: 1280,
  y: 720
}
export const WEBCAM_MIRROR_CAMERA = true

export const POSE_MIN_PART_CONFIDENCE = 0.1
export const POSE_MIN_POSE_CONFIDENCE = 0.15

// 
// Flapping constants
export const SHOULDER_ANGLE_SMOOTHING = 0.75
export const ARM_ANGLE_SMOOTHING = 0.75
export const MAX_INERTIA = 250 // ms
// "gravity" is how fast it falls in free fall
export const GRAVITY = -1.0
// gravity always applied so subtract it
export const MAX_UPWARD_SPEED = 4 - GRAVITY
