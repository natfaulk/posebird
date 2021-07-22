const MENU_ID = 'menu-overlay'
const PLAY_ID = 'play-button'

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
}
