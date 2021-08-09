export const VERSION = '0.1.3'

export const setVersion = () => {
  const el = document.getElementById('version')
  el.innerHTML = `Version: ${VERSION}`
}
