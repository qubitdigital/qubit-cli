const log = require('../lib/log')
const getPkg = require('../lib/get-pkg')
const getPreviewLinks = require('../lib/preview-links')
let opn = require('opn')

module.exports = async function open (options) {
  const pkg = await getPkg()
  pkg.meta = pkg.meta || {}
  const { propertyId, experienceId } = pkg.meta

  if (!propertyId || !experienceId) {
    log(`sorry! this feature assumes you have already setup an experience locally`)
    return log(`it uses the package.json metadata to open the overview page for an existing experience`)
  }

  let route = ''

  if (options.editor) route = 'editor'
  if (options.settings) route = 'settings'

  if (options.preview) {
    const links = await getPreviewLinks(pkg.meta)
    links.map((url) => open(url))
  } else {
    const url = `https://app.qubit.com/p/${propertyId}/experiences/${experienceId}/${route}`
    open(url)
  }

  function open (url) {
    log(`Opening page: ${url}`)
    opn(url, { wait: false })
  }
}
