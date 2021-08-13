/* eslint-env node */
const lg = require('@natfaulk/supersimplelogger')('Highscore')
const {mkdir_p, checkKeyHasVal} = require('./utils')
const path = require('path')
const fs = require('fs')

const DATA_PATH = path.join(__dirname, '..', 'data')
const HIGHSCORE_FILE = path.join(DATA_PATH, 'highscore.json')

class Highscore {
  constructor() {
    this.score = 0

    mkdir_p(DATA_PATH)
    this.loadFile()
  }

  // checks if it is a highscore and then saves it if it is
  updateHighscore(score) {
    score = parseFloat(score)
    if (!isFinite(score)) return
    if (score <= this.score) return

    lg(`New highscore: ${score}`)
    this.score = score
    this.saveFile()
  }

  loadFile() {
    lg(`Loading hishscore from ${HIGHSCORE_FILE}`)
    if (!fs.existsSync(HIGHSCORE_FILE)) {
      lg('Highscore file does not exist...')
      return
    }

    const raw = fs.readFileSync(HIGHSCORE_FILE, {encoding: 'utf8'})
    try {
      const parsed = JSON.parse(raw)
      if (checkKeyHasVal(parsed, 'score')) this.score = parsed.score
      else lg('Invalid highscore file...')      
    } catch (error) {
      lg('Failed to parse highscore json...')      
    }
  }

  saveFile() {
    lg(`Writing hishscore to ${HIGHSCORE_FILE}`)
    fs.writeFileSync(HIGHSCORE_FILE, JSON.stringify({
      score: this.score,
      version: 1.0
    }))
  }
}

module.exports = {
  Highscore
}
