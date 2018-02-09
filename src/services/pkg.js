const _ = require('lodash')
const {getFilename} = require('./variation')

function getCode (experience, iteration, variations) {
  const files = {}
  const experienceMeta = experience.meta ? JSON.parse(experience.meta) : {}
  const pkgJSON = iteration.package_json || '{}'
  files['package.json'] = JSON.stringify(Object.assign({
    name: `qubit-experience-${experience.id}`,
    version: '1.0.0',
    description: 'An experience powered by qubit'
  }, JSON.parse(pkgJSON), {
    meta: {
      name: experience.name,
      propertyId: experience.property_id,
      experienceId: experience.id,
      iterationId: iteration.id,
      previewUrl: iteration.url,
      remoteUpdatedAt: normalizeDate(iteration.updated_at),
      variations: variations.reduce((memo, variation) => {
        memo[getFilename(variation)] = {
          variationId: variation.id,
          variationIsControl: variation.is_control,
          variationMasterId: variation.master_id,
          remoteUpdatedAt: normalizeDate(variation.updated_at)
        }
        return memo
      }, {}),
      templateData: iteration.template_data,
      solutionOptions: iteration.solution_options,
      visitor: {},
      also: [],
      excluded: [],
      templates: _.get(experienceMeta, 'xp.templates') || []
    }
  }), null, 2)
  return files
}

function normalizeDate (str) {
  let date = new Date(str)
  date.setSeconds(date.getSeconds(), 0)
  return date
}

function setCode (experience, iteration, files) {
  const pkg = JSON.parse(files['package.json'])
  experience = _.cloneDeep(experience)
  experience.name = _.get(pkg, 'meta.name')
  iteration = _.cloneDeep(iteration)
  iteration.url = _.get(pkg, 'meta.previewUrl')
  iteration.package_json = JSON.stringify(_.omit(pkg, 'meta'), null, 2)
  return { experience, iteration }
}

module.exports = { getCode, setCode }
