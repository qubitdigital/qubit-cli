const input = require('input')
const getPkg = require('../lib/get-pkg')
const experienceService = require('../services/experience')
const validControlSizes = require('../lib/valid-control-sizes')
const log = require('../lib/log')

module.exports = async function traffic (options) {
  try {
    const pkg = await getPkg()
    if (!pkg.meta) return log.warn('Navigate to an experience directory and try again')

    const {propertyId, experienceId} = pkg.meta
    let experience = await experienceService.get(propertyId, experienceId)
    const currentControlDecimal = experience.recent_iterations.draft.control_size
    const currentControlPercentage = getControlPercentage(currentControlDecimal)

    if (options.view) return log.info(`Current control size is ${currentControlPercentage}`)

    const newControlDecimal = await input.select(`Select control size (current ${currentControlPercentage}):`, validControlSizes, { 'default': currentControlDecimal })
    experience.recent_iterations.draft.control_size = newControlDecimal
    const updatedExperience = await experienceService.set(propertyId, experienceId, experience)

    if (updatedExperience) {
      log.info('Traffic split updated')
    } else {
      log.warn('Failed to update traffic split')
    }
  } catch (err) {
    log.error(err)
  }
}

function getControlPercentage (controlValue) {
  return validControlSizes.find((iteree) => iteree.value === controlValue).name
}
