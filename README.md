# ![xp-logo](./logo.png)

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

A client to facilitate local development of experiences for the qubit platform

- build experiences locally in your editor/ide of choice
- local previewing and live reload
- use your own workflow and versioning tools etc.
- control when to push your changes up or pull down the latest remote changes
- automatically watch for changes and sync with remote
- create templates and scaffold experiences from them
- execute/demo on sites that don't have qubit tech
- write and run local unit tests
- bypass the build queue

## installation
```
npm install -g qubitdigital/xp-cli
```

## basic usage

1. install extension
  - in terminal, type ``` xp open ```
  - in chrome, load chrome://extensions
  - drag and drop chrome-extension folder into browser
  - ensure 'enabled' checkbox is ticked
  - click 'allow in incognito' if you would like to use xp in incognito mode
2. open terminal and run cli:
```
mkdir xp-demo
cd xp-demo
xp scaffold example
xp variation.js --watch
```

## connecting to an existing experience
with xp running, navigate to an experience page:
```
$ xp
$ xp listening on port 41337
$ open https://app.qubit.com/p/1234/experiences/5678/editor
  You recently navigated to https://app.qubit.com/p/1234/experiences/5678/editor
  Would you like xp to scaffold your local project from this experiment? (y/n)
  writing to local package.json file...
  writing to local global.js file...
  writing to local triggers.js file...
  writing to local variation-49937.js file...
  writing to local variation-49937.css file...
  writing to local variation-336711.js file...
  writing to local variation-336711.css file...
  All done!

$ xp up // save your changes to the cloud
  synced!

$ xp down // pull down latest version of experience
  pulled!
```

## file reference
```
files:
- global.js // execute code globally
- triggers.js // programmatically decide when the experience should execute
- varition-xxx.js // variation code
- variation-xxx.css // variation css
```

## help menu
```
Usage: xp [varaition.js] [options]
         xp <cmd> [options]


  Commands:

    up                   push experience up to remote
    down                 pull experience down from remote
    scaffold <template>  scaffold a project from a template
    open                 open xp folder in finder, e.g. to locate chrome-extension

  Options:

    -h, --help         output usage information
    -V, --version      output the version number
    -p, --port [port]  use custom [port]
    -r, --require      wait for window.__qubit.amd
    -w, --watch        watch for changes and live reload
    -s, --sync         watch for changes and sync with remote


  Examples:

    $ xp --help
    $ xp scaffold example
    $ xp variation.js --watch

    $ xp
      xp listening on port 41337
    $ open https://app.qubit.com/p/1234/experiences/5678/editor
      You recently navigated to https://app.qubit.com/p/1234/experiences/5678/editor
      Would you like xp to scaffold your local project from this experiment? (y/n)
      writing to local package.json file...
      writing to local global.js file...
      writing to local triggers.js file...
      writing to local variation-49937.js file...
      writing to local variation-49937.css file...
      writing to local variation-336711.js file...
      writing to local variation-336711.css file...
      All done!

    $ xp variation-336711.js --sync
      watching for changes
      xp listening on port 41337
      synced!

    $ xp up
      synced!

    $ xp down
      pulled!
```

notes:
- to make xp wait for ``` window.__qubit.amd ``` to be present, use the 'require' flag: ``` xp --require ```
- if it isn't working after an update, you may need to reload the extension
