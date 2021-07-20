const MENU_ID = 'menu-overlay'
const PLAY_ID = 'play-button'

export const hideMenu = () => {
  document.getElementById(MENU_ID).style.visibility = 'hidden'
}

export const showMenu = () => {
  document.getElementById(MENU_ID).style.visibility = 'visible'
}

export const init = () => {
  document.getElementById(PLAY_ID).addEventListener('click', () => {
    hideMenu()
  })
}
