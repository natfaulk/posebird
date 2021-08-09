/* eslint-env node */
const express = require('express')
const path = require('path')
const fs = require('fs')
const lg = require('@natfaulk/supersimplelogger')('Server')

const SETTINGS_FILE = 'settings.json'

const app = express()
let port = 3000
let dev = false

if (fs.existsSync(SETTINGS_FILE)) {
  const settingsraw = fs.readFileSync(SETTINGS_FILE, 'utf8')
  try {
    const settings = JSON.parse(settingsraw)
    if (typeof(settings.port) === 'number') port = settings.port
    if (settings.dev === true) dev = true
  } catch (e) {
    lg('Invalid settings.json file. Using defaults')
  }
} else lg('No settings.json file. Using defaults')

// disable caching on dev mode
const staticConfig = {}
if (!dev) staticConfig.maxAge = '1d'

app.use('/public', express.static('public', staticConfig))
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})
app.listen(port, () => {
  lg(`App listening on port ${port}`)
})
