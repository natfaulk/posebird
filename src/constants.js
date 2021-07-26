export const FLOOR_WIDTH = 10
export const FLOOR_DEPTH = 20
export const FLOOR_SQ_SIZE = 1

export const PILLAR_WIDTH = 0.5
export const PILLAR_HEIGHT = 5
export const PILLAR_COLOR = 0x66563c

export const CAMERA_FOV = 75
export const CAMERA_NEAR = 0.1
export const CAMERA_FAR = 1000
export const CAMERA_CLEAR_COLOR = 0xb8c6db

export const CAMERA_POS_X = 0
export const CAMERA_POS_Y = 3
export const CAMERA_POS_Z = 8

export const CAMERA_BIRD_OFFSET_X = 0
export const CAMERA_BIRD_OFFSET_Y = -0.5
export const CAMERA_BIRD_OFFSET_Z = -1

// export const BIRD_WIDTH = 0.2
// export const BIRD_DEPTH = 0.1
// export const BIRD_HEIGHT = 0.1
// export const BIRD_COLOR = 0x3d4047
export const BIRD_INIT_POS_X = CAMERA_POS_X + CAMERA_BIRD_OFFSET_X
export const BIRD_INIT_POS_Y = CAMERA_POS_Y + CAMERA_BIRD_OFFSET_Y
export const BIRD_INIT_POS_Z = CAMERA_POS_Z + CAMERA_BIRD_OFFSET_Z

export const BIRD_MAX_SPEED_X = 5 // m/s

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
