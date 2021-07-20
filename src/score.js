export class Score {
  constructor () {
    this.dom = document.getElementById('score-overlay')
    this.score = 0
  }

  update() {
    this.dom.innerHTML = `Score: ${this.score}`
  }
}
