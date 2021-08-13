import makeLogger from '@natfaulk/supersimplelogger'
const lg = makeLogger('Highscore')

const GET_HIGHSCORE_URL = 'highscore'
const SAVE_HIGHSCORE_URL = 'submitHighscore'

export class Highscore {
  constructor () {
    this.score = 0

    // async so won't complete for a while after this function has returned
    // but that's ok
    this.getHighscore()
  }

  async update(score) {
    score = Math.round(score)
    if (score <= this.score) return
    lg('this ran')

    this.score = score
    await this.saveHighscore()
  }

  async saveHighscore() {
    lg('Sending highscore to server')
    const res = await fetch(SAVE_HIGHSCORE_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({score: this.score})
    })
  
    const parsed = await res.text()
    if (parsed !== 'ack') {
      lg('Failed to post highscore to server...')
    }
  }

  async getHighscore() {
    const res = await fetch(GET_HIGHSCORE_URL)
    const parsed = await res.json()
    this.score = parsed.score
    lg(`Highscore from the server was ${this.score}`)
  }
}
