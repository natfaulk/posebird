/* eslint-env node */
const express = require('express')
const path = require('path')
const fs = require('fs')

const SETTINGS_FILE = 'settings.json'

const app = express()
let port = 3000

app.use('/public', express.static('public', {maxAge: '7d'}))
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

if (fs.existsSync(SETTINGS_FILE)) {
  const settingsraw = fs.readFileSync(SETTINGS_FILE, 'utf8')
  try {
    const settings = JSON.parse(settingsraw)
    if (typeof(settings.port) === 'number') port = settings.port
  } catch (e) {
    console.log('Invalid settings.json file. Using defaults')
  }
} else console.log('No settings.json file. Using defaults')

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
