export const VERSION = '0.1.2'

export const setVersion = () => {
  const el = document.getElementById('version')
  el.innerHTML = `Version: ${VERSION}`
}
