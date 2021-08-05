const MENU_ID = 'menu-overlay'
const PLAY_ID = 'play-button'
const LOADING_ID = 'loading'
const USE_CHROME_ID = 'use-chrome'

import {Stats} from './stats'

export class UI {
  constructor() {
    document.getElementById(PLAY_ID).addEventListener('click', () => {
      this.hideMenu()
    })

    this.stats = new Stats

    this.stats.addStat('score')
    this.stats.addStat('poseFPS', {
      smoothing: 0.5,
      fixed: 2,
      prettyLabel: 'Pose FPS'
    })
    this.stats.addStat('FPS', {
      smoothing: 0.5,
      fixed: 2
    })
    this.stats.addStat('shoulder', {
      fixed: 2,
      prettyLabel: 'Shoulder Angle'
    })
    this.stats.addStat('arm', {
      fixed: 2,
      prettyLabel: 'Arm Angle'
    })
  }

  hideMenu() {
    document.getElementById(MENU_ID).style.visibility = 'hidden'
  }
  
  showMenu() {
    document.getElementById(MENU_ID).style.visibility = 'visible'
  }

  update() {
    this.stats.update()
  }

  hideloadingScreen() {
    document.getElementById(LOADING_ID).style.visibility = 'hidden'
  }
}

export const hideUseChromeAlert = () => {
  document.getElementById(USE_CHROME_ID).style.visibility = 'hidden'
}

export const showUseChromeAlert = () => {
  document.getElementById(USE_CHROME_ID).style.visibility = 'visible'
}
