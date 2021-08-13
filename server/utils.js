/* eslint-env node */
const fs = require('fs')

const mkdir_p = _dir => {
  if (!fs.existsSync(_dir)) {
    fs.mkdirSync(_dir)
  }
}

const checkKeyHasVal = (_obj, _key) => {
  return (
    _key in _obj 
    && _obj[_key] !== null
    && _obj[_key] !== undefined
  )
}

module.exports = {
  mkdir_p,
  checkKeyHasVal
}
