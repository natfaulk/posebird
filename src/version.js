export const VERSION = '0.1.4-testing'

export const setVersion = () => {
  const el = document.getElementById('version')
  el.innerHTML = `Version: ${VERSION}`
}
