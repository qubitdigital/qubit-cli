const fs = require('fs-extra')
const webpack = require('webpack')
const createEmitter = require('event-kitten')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const installQubitDeps = require('../../lib/install-qubit-deps')
const pickVariation = require('../../lib/pick-variation')
const webpackConf = require('../../../webpack.conf')
const config = require('../../../config')
const log = require('../../lib/log')
const createApp = require('../app')
const cors = require('cors')
let CWD = process.cwd()

module.exports = async function serve (options) {
  const app = await createApp()

  try {
    let deps = require('qubt-cli-deps')
    if (!deps.hasQubitDeps) throw new Error('oh noes!')
  } catch (err) {
    await installQubitDeps()
  }

  app.use(cors())
  options.verbose = options.verbose || false

  if (/(triggers|global|.css$)/.test(options.variationFilename)) {
    log.info('Hint: you should be watching the entry point for your experience, i.e. your variation file!')
  }

  if (!options.variationFilename) {
    options.variationFilename = await pickVariation(await fs.readdir(CWD))

    if (!options.variationFilename) {
      return log.warn('Ensure you are within an experience directory and try again')
    }

    log.info(`Using ${options.variationFilename}`)
  }

  // make .js optional
  options.variationFilename = options.variationFilename.replace(/\.js$/, '')

  const verboseOpts = {
    log: options.verbose ? console.log : false,
    noInfo: !options.verbose,
    quiet: !options.verbose,
    stats: options.verbose,
    warn: options.verbose
  }
  const emitter = createEmitter()
  const compiler = webpack(Object.assign(createWebpackConfig(options)), (plumbus, stats) => {
    if (stats.hasErrors() && !options.verbose) log.info(stats.toString('errors-only').trim())
  })
  compiler.plugin('done', (data) => emitter.emit('rebuild', data))
  app.use(webpackDevMiddleware(compiler, Object.assign({
    publicPath: webpackConf.output.publicPath
  }, verboseOpts)))
  app.use(webpackHotMiddleware(compiler, Object.assign({
    reload: true,
    path: '/__webpack_hmr',
    heartbeat: 100
  }, verboseOpts)))

  return app.start().then(() => {
    log.info(`Qubit-CLI listening on port ${config.port}`)
    return { app, emitter }
  })
}

function createWebpackConfig (options) {
  const plugins = webpackConf.plugins.slice(0)
  plugins.push(new webpack.DefinePlugin({
    __CWD__: `'${CWD}'`,
    __VARIATION__: `'${options.variationFilename}'`
  }))
  const entry = webpackConf.entry.slice(0)
  return Object.assign({}, webpackConf, {
    entry: entry,
    plugins: plugins
  })
}
