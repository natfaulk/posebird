import {smooth} from './utils'

export class Stats {
  constructor () {
    this.all = {}
  }

  addStat(label, opts) {
    this.all[label] = new SingleStat(label, opts)
  }

  setStat(label, val) {
    const s = this.all[label]
    s.setVal(val)
  }

  update() {
    for (const i of Object.values(this.all)) {
      i.update()
    }
  }
}

// opts are:
// prettyLabel - label to display instead of the label
// smoothing - smoothing factor such that: 
//    new val = smoothing * old val + (1 - smoothing) * new val
// fixed - number of DP to fix value to
class SingleStat {
  constructor(label, opts = {}) {
    this.prettyLabel = (opts.prettyLabel !== undefined)? opts.prettyLabel: label
    this.label = `stat-${label}`

    const parent = document.getElementById('stats-overlay')
    const newdiv = document.createElement('div')
    newdiv.setAttribute('id', label)
    parent.appendChild(newdiv)
    
    this.dom = document.getElementById(label)

    this.val = 0

    this.fixed = null
    this.smoothing = null
    if (opts.fixed !== undefined) this.fixed = opts.fixed
    if (opts.smoothing !== undefined) this.smoothing = opts.smoothing
  }

  setVal(val) {
    if (!isFinite(val)) return

    if (this.smoothing !== null) {
      this.val = smooth(val, this.val, this.smoothing)
      return
    }

    this.val = val
  }

  update() {
    let out = this.val
    if (this.fixed !== null) {
      out = this.val.toFixed(this.fixed)
    }
    this.dom.innerHTML = `${this.prettyLabel}: ${out}`
  }
}
