const input = require('input')
const chalk = require('chalk')
const getPkg = require('../lib/get-pkg')
const experienceService = require('../services/experience')
const validControlSizes = require('../lib/valid-control-sizes')
const log = require('../lib/log')

module.exports = async function traffic () {
  try {
    const pkg = await getPkg()
    if (!pkg.meta) return log(chalk.red('Navigate to an experience directory and try again'))

    const {propertyId, experienceId} = pkg.meta
    let experience = await experienceService.get(propertyId, experienceId)
    const currentControlDecimal = experience.recent_iterations.draft.control_size
    const newControlDecimal = await input.select(`Select control size (current preselected):`, validControlSizes, { default: currentControlDecimal })

    experience.recent_iterations.draft.control_size = newControlDecimal
    experienceService.set(propertyId, experienceId, experience).then(() => {
      log(chalk.green('Traffic split updated'))
    }, () => {
      log(chalk.red('Failed to update traffic split'))
    })
  } catch (err) {
    log.error(err)
  }
}
