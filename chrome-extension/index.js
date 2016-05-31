/* globals chrome */
var log = console.log.bind(console)

if (isEditor()) {
  connect()
} else {
  inject()
}

function connect () {
  console.log('Attempting to sync with xp')
  chrome.runtime.sendMessage({
    xp: true,
    url: window.location.href
  }, log)
}

function inject () {
  var script = document.createElement('script')
  script.src = 'https://localhost:1234/bundle.js'
  document.body.appendChild(script)
}

function isEditor () {
  var host = /^(localhost:3000|staging\-dashboard\.qubitproducts\.com|app\.qubit\.com)$/
  var path = /^\/p\/\d+\/experiences\/\d+\/editor\?vid=\d+/
  return host.test(window.location.host) && path.test(window.location.pathname + window.location.search)
}
