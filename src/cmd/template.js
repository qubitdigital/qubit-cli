const _ = require('lodash')
const path = require('path')
const scaffold = require('../lib/scaffold')
const readFiles = require('../lib/read-files')
const execa = require('execa')
const getPkg = require('../lib/get-pkg')
const mergePkg = require('../lib/merge-pkg')
const templateName = require('../lib/template-name')
const moduleName = require('../lib/module-name')
const hasVariations = require('../lib/has-variations')
const resolveTemplate = require('../lib/resolve-template')
const ROOT_DIR = path.resolve(__dirname, '../../')
let CWD = process.cwd()

module.exports = async function template (name) {
  let output
  const pkg = await getPkg()
  if (name === 'example') name = path.resolve(__dirname, '../../example')

  name = templateName(name)

  await execa('npm', ['link', moduleName(name)], { cwd: ROOT_DIR })

  output = await getTemplateFiles(name)

  if (hasVariations(pkg)) {
    _.each(pkg.meta.variations, (variation, filename) => {
      if (!variation.variationIsControl) {
        output[`${filename}.js`] = output['variation.js']
        output[`${filename}.css`] = output['variation.css']
      }
    })
    delete output['variation.js']
    delete output['variation.css']
  }

  output = resolveTemplate(output, pkg.meta)

  const outPkg = mergePkg(pkg, output['package.json'])

  outPkg.meta = addTemplateMetrics(outPkg.meta, path.basename(name))

  output['package.json'] = JSON.stringify(outPkg, null, 2)

  return scaffold(CWD, output, true, null, false)
}

async function getTemplateFiles (template) {
  let templateDir = path.dirname(require.resolve(template))
  if (!/\/template$/.test(templateDir)) templateDir = path.join(templateDir, 'template')
  return readFiles(path.join(templateDir))
}

function addTemplateMetrics (meta, templateName) {
  return Object.assign({}, meta, {
    templates: _.uniq(meta.templates.concat([templateName]))
  })
}
