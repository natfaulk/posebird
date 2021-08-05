export const clamp = (val, min, max) => {
  if (val >= max) return max
  if (val <= min) return min
  return val
}

export const smooth = (newV, oldV, f) => {
  return oldV * f + newV * (1 - f)
}

export const newPt = (_x = 0, _y = 0) => {
  return {x: _x, y: _y}
}

export const randBetween = (a, b) => {
  return Math.random() * (b - a) + a
}

export const checkKeyHasVal = (_obj, _key) => {
  return (
    _key in _obj 
    && _obj[_key] !== null
    && _obj[_key] !== undefined
  )
}
