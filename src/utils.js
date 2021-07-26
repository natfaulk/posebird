export const clamp = (val, min, max) => {
  if (val >= max) return max
  if (val <= min) return min
  return val
}

export const smooth = (newV, oldV, f) => {
  return oldV * f + newV * (1 - f)
}
