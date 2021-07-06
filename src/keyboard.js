// import makeLogger from '@natfaulk/supersimplelogger'

// const lg = makeLogger('Keyboard')

const state = {
  up: false,
  down: false,
  left: false,
  right: false
}


export const setup = () => {
  document.addEventListener('keydown', keydownHandler)
  document.addEventListener('keyup', keyupHandler)
}

const keydownHandler = e => {
  if (e.code === 'ArrowUp' || e.code === 'KeyW') state.up = true
  else if (e.code === 'ArrowDown' || e.code === 'KeyS') state.down = true
  else if (e.code === 'ArrowLeft' || e.code === 'KeyA') state.left = true
  else if (e.code === 'ArrowRight' || e.code === 'KeyD') state.right = true
}

const keyupHandler = e => {
  if (e.code === 'ArrowUp' || e.code === 'KeyW') state.up = false
  else if (e.code === 'ArrowDown' || e.code === 'KeyS') state.down = false
  else if (e.code === 'ArrowLeft' || e.code === 'KeyA') state.left = false
  else if (e.code === 'ArrowRight' || e.code === 'KeyD') state.right = false
}

export const up = () => {
  return state.up
}

export const down = () => {
  return state.down
}

export const left = () => {
  return state.left
}

export const right = () => {
  return state.right
}
