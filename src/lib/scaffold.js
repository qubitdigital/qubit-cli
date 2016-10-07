const path = require('path')
const chalk = require('chalk')
const fs = require('fs-promise')
const co = require('co')
const log = require('./log')
let exists = require('./exists')
let confirm = require('confirmer')

module.exports = co.wrap(function * scaffold (dest, files, neverOverwrite) {
  for (let name in files) {
    if (files.hasOwnProperty(name)) {
      let value = files[name]
      if (typeof value === 'string') {
        yield scaffoldFile(name)
      } else {
        yield fs.mkdirp(path.join(dest, name))
        yield scaffold(path.join(dest, name), value, neverOverwrite)
      }
    }
  }

  function scaffoldFile (name) {
    let value = files[name]
    return shouldWrite(dest, name, value, !neverOverwrite).then((result) => {
      if (result) {
        if (log) log(`writing to local ${chalk.green.bold(name)} file...`)
        return fs.writeFile(path.join(dest, name), value)
      }
    })
  }
})

function shouldWrite (dest, name, newValue, shouldConfirm) {
  let msg = `Do you want ${chalk.green.bold('xp')} to overwrite your local ${chalk.green.bold(name)} file?`
  let file = path.join(dest, name)
  return exists(file).then((exists) => {
    // file does not exist - overwrite
    if (!exists) return true
    // if no ask handler, don't ever overwrite
    if (!shouldConfirm) return false
    return fs.readFile(file).then((currentValue) => {
      currentValue = String(currentValue)
      // file is same as value - no need to write anything
      if (currentValue === newValue) return false
      // file exists and is different - ask permission
      return shouldConfirm ? confirm(msg) : false
    })
  })
}
