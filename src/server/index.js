const express = require('express')
const createEmitter = require('event-kitten')
const push = require('../cmd/push')
const log = require('../lib/log')
const webpack = require('webpack')
const https = require('https')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackConf = require('../../webpack.conf')
const app = express()

module.exports = function start (options) {
  options.verbose = options.verbose || false
  const verboseOpts = {
    log: options.verbose ? log : false,
    noInfo: !options.verbose,
    quiet: !options.verbose,
    stats: options.verbose,
    warn: options.verbose
  }
  const emitter = createEmitter()
  if (options.sync) {
    log('watching for changes')
    emitter.on('rebuild', push)
  }
  const compiler = webpack(Object.assign(createWebpackConfig(options), verboseOpts))
  compiler.plugin('done', (data) => emitter.emit('rebuild', data))
  app.use(webpackDevMiddleware(compiler, Object.assign({
    publicPath: webpackConf.output.publicPath
  }, verboseOpts)))
  app.use(webpackHotMiddleware(compiler, Object.assign({
    reload: true,
    path: '/__webpack_hmr',
    heartbeat: 100
  }, verboseOpts)))
  const server = https.createServer(options.certs, app)
  return {server, emitter}
}

function createWebpackConfig (options) {
  const plugins = webpackConf.plugins.slice(0)
  plugins.push(new webpack.DefinePlugin({
    __VARIATIONJS__: `'xp-loader!${options.variation.replace(/\.js$/, '')}'`,
    __VARIATIONCSS__: `'${options.variation.replace(/\.js$/, '.css')}'`
  }))
  const entry = webpackConf.entry.slice(0)
  if (!options.sync && !options.watch) entry.pop()
  return Object.assign({}, webpackConf, {
    entry: entry,
    plugins: plugins
  })
}
