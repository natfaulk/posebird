// import makeLogger from '@natfaulk/supersimplelogger'

const dist = (_p1, _p2) => {
  return Math.hypot(_p1.x - _p2.x, _p1.y - _p2.y)
}

const newPt = (_x = 0, _y = 0) => {
  return {x: _x, y: _y}
}

const toTuple = ({y, x}) => {
  return [y, x]
}

// const lg = makeLogger('Pose draw')

const color = 'red'
const lineWidth = 20

const drawSkeleton = (adjacentKeyPoints, ctx, scale = 1) => {
  // const adjacentKeyPoints =
  //     posenet.getAdjacentKeyPoints(keypoints, minConfidence)

  adjacentKeyPoints.forEach(keypoints => {
    drawSegment(
      toTuple(keypoints[0].position), 
      toTuple(keypoints[1].position),
      color,
      scale,
      ctx
    )
  })
}

const HEAD_PARTS = [
  'nose',
  'leftEye',
  'rightEye',
  'leftEar',
  'rightEar'
]

const drawHead = (_kps, ctx) => {
  const headPts = []

  _kps.forEach(_point => {
    if (HEAD_PARTS.includes(_point.part)) headPts.push(_point.position)
  })

  if (headPts.length < 2) return

  const centre = newPt()

  headPts.forEach(_pt => {
    centre.x += _pt.x
    centre.y += _pt.y
  })

  centre.x /= headPts.length
  centre.y /= headPts.length

  let maxDist = 0
  headPts.forEach(_pt => {
    const d = dist(centre, _pt)
    if (d > maxDist) maxDist = d
  })
  
  ctx.beginPath()
  ctx.arc(centre.x, centre.y, maxDist, 0, 2 * Math.PI)
  ctx.lineWidth = lineWidth
  ctx.strokeStyle = color
  ctx.stroke()
}

/**
 * Draw pose keypoints onto a canvas
 */
function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i]

    if (keypoint.score < minConfidence) {
      continue
    }

    const {y, x} = keypoint.position
    drawPoint(ctx, y * scale, x * scale, 8, color)
  }
}

const drawPoint = (ctx, y, x, r, color) => {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, 2 * Math.PI)
  ctx.fillStyle = color
  ctx.fill()
}

const drawSegment = ([ay, ax], [by, bx], color, scale, ctx) =>  {
  ctx.beginPath()
  ctx.moveTo(ax * scale, ay * scale)
  ctx.lineTo(bx * scale, by * scale)
  ctx.lineWidth = lineWidth
  ctx.strokeStyle = color
  ctx.stroke()
}

export const drawAll = (_ctx, _poses) => {
  _poses.forEach(_pose => {
    drawSkeleton(_pose.adjKps, _ctx)
    drawKeypoints(_pose.kps, 0.1, _ctx)
    drawHead(_pose.kps, _ctx)
  })
}
