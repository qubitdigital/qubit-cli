const _ = require('lodash')
const log = require('../lib/log')
const getPkg = require('../lib/get-pkg')
const updatePkg = require('../lib/update-pkg')
const down = require('../services/down')
const diff = require('./diff')

module.exports = async function push (options) {
  const pkg = await getPkg()
  const {propertyId, experienceId} = (pkg.meta || {})
  if (!propertyId || !experienceId) return log.info('Nothing to push')

  if (!options.force) {
    let { files } = await down(experienceId)

    let remotePkg = JSON.parse(files['package.json'])
    let remoteExperienceUpdatedAt = remotePkg.meta.remoteUpdatedAt
    let remoteVariantsUpdatedAt = _.map(remotePkg.meta.variations, v => v.remoteUpdatedAt)
    let remoteUpdatedAts = [remoteExperienceUpdatedAt].concat(remoteVariantsUpdatedAt)

    let localExperienceUpdatedAt = pkg.meta.remoteUpdatedAt
    let localVariantsUpdatedAt = _.map(pkg.meta.variations, v => v.remoteUpdatedAt)
    let localUpdatedAts = [localExperienceUpdatedAt].concat(localVariantsUpdatedAt)

    if (remoteUpdatedAts.join('|') !== localUpdatedAts.join('|')) {
      log.info('Remote has changed since the last interaction!')
      await diff()
    }
  }

  log.info('Pushing...')
  await updatePkg(experienceId)
  log.info('Pushed!')
}
