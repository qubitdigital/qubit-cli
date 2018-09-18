const log = require('../lib/log')
const experienceService = require('../services/experience')

module.exports = async function experienceStatus (propertyId, experienceId) {
  const experience = await experienceService.get(experienceId)
  if (experience.is_template) return

  const experienceState = await experienceService.status(propertyId, experienceId)

  if (experienceState.processing) {
    log.info(`Experience is ${experienceState.state}`)

    setTimeout(() => {
      experienceStatus(propertyId, experienceId)
    }, 3000)
  } else {
    log.info(`Experience is ${experienceState.state}`)
  }
}
