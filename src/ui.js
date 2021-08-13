import makeLogger from '@natfaulk/supersimplelogger'
import * as CONSTS from './constants'

const lg = makeLogger('UI')

const MENU_ID = 'menu-overlay'
const PLAY_ID = 'play-button'
const LOADING_ID = 'loading'
const USE_CHROME_ID = 'use-chrome'
const INTRO_ID = 'intro-overlay-child'
const PREV_SCORE_ID = 'previous-score'
const HIGH_SCORE_ID = 'high-score'


import {Stats} from './stats'

export class UI {
  constructor() {
    // is a promise resolve function
    this.playClicked = null

    document.getElementById(PLAY_ID).addEventListener('click', this.clickPlayHandler.bind(this))

    this.stats = new Stats

    this.stats.addStat('score', {
      fixed: 0,
      prettyLabel: 'Score'
    })
    this.stats.addStat('highscore', {
      fixed: 0,
      prettyLabel: 'High Score'
    })
    // this.stats.addStat('speed', {
    //   prettyLabel: 'Speed'
    // })
    // this.stats.addStat('poseFPS', {
    //   smoothing: 0.5,
    //   fixed: 2,
    //   prettyLabel: 'Pose FPS'
    // })
    // this.stats.addStat('FPS', {
    //   smoothing: 0.5,
    //   fixed: 2
    // })
    // this.stats.addStat('shoulder', {
    //   fixed: 2,
    //   prettyLabel: 'Shoulder Angle'
    // })
    // this.stats.addStat('arm', {
    //   fixed: 2,
    //   prettyLabel: 'Arm Angle'
    // })
  }

  clickPlayHandler() {
    // if this doesn't work check that the menu is on top of any hidden elements above it!!
    // ie check the z-index in the css file
    lg('Play button clicked...')
    if (this.playClicked === null) {
      lg('No playclicked action....')
    } else {
      this.playClicked()
    }        

    this.hideMenu()
  }

  hideMenu() {
    document.getElementById(MENU_ID).style.visibility = 'hidden'
  }
  
  async showMenu() {
    document.getElementById(MENU_ID).style.visibility = 'visible'
    
    if (CONSTS.ENDLESS_DEMO_MODE) setTimeout(() => {
      this.clickPlayHandler()
    }, CONSTS.ENDLESS_DEMO_MENU_WAIT)
    
    return new Promise(resolve => {
      this.playClicked = resolve
    })
  }

  update() {
    this.stats.update()
  }

  hideloadingScreen() {
    document.getElementById(LOADING_ID).style.visibility = 'hidden'
  }
  
  // Flashes 3... 2... 1... Start
  async intro() {
    const el = document.getElementById(INTRO_ID)
    el.style.visibility = 'visible'
    el.innerHTML = 'Get Ready'
  
    const maxN = 3
    const delay = 1000
    for (let i = 0; i < maxN; i++) {
      flashMessage(el, (i + 1) * delay, maxN - i)
    }
  
    flashMessage(el, (maxN + 1) * delay, 'GO')

    return new Promise(resolve => {
      setTimeout(() => {
        el.style.visibility = 'hidden'
        resolve()  
      }, (maxN + 2) * delay)
    })
  }

  setPreviousScore(score) {
    const el = document.getElementById(PREV_SCORE_ID)
    el.innerHTML = `Previous Score: ${Math.round(score)}`
  }

  setHighScore(score) {
    const el = document.getElementById(HIGH_SCORE_ID)
    el.innerHTML = `High Score: ${Math.round(score)}`
  }
}

const flashMessage = (el, delay, n) => {
  setTimeout(() => el.innerHTML = `${n}...`, delay)
}

export const hideUseChromeAlert = () => {
  document.getElementById(USE_CHROME_ID).style.visibility = 'hidden'
}

export const showUseChromeAlert = () => {
  document.getElementById(USE_CHROME_ID).style.visibility = 'visible'
}

