/* eslint-env node */
const express = require('express')
const path = require('path')

const app = express()
const port = 3000

app.use('/public', express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
