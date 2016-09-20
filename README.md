# ![xp-cli](https://cloud.githubusercontent.com/assets/640611/18666410/a11b3394-7f23-11e6-99b5-5cbbca6da27f.png)

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

client
```
npm install -g qubitdigital/xp-cli
```

extension
```
xp open
# navigate to chrome://extensions in chrome
# drag and drop chrome-extension folder into browser
# ensure 'enabled' checkbox is ticked
# click 'allow in incognito' if you would like to use xp in incognito mode
```

## basic usage

once you have installed the client and extension
```
mkdir xp-demo
cd xp-demo
xp scaffold example
xp variation.js --watch
// navigate to a url in chrome
// click the xp icon in chrome to turn the extension on for your current tab
```

## xp connect

xp allows you to connect to and sync with an existing experience created within the qubit platform

with xp running, navigate to an experience page:
```
$ xp connect
$ navigate to an `edit experience` page for xp to connect to it
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

$ xp variation-336711.js --watch
  xp listening on port 41337

$ xp variation-336711.js --sync
  watching for changes
  xp listening on port 41337
  synced!
```

## xp up

once your local experience is connected/configured with the correct metadata

you can type ``` xp up ``` to save your changes to push your changes up to the platform

## xp down

once your local experience is connected/configured with the correct metadata

you can type ``` xp down ``` to pull down the experience from the platform

## xp scaffold

xp allows you to create, publish and share experience templates

any commonjs module containing a folder called template can be used by xp to scaffold a new project

creating a template:
```
mkdir my-experience-template
cd my-experience-template
mkdir template
touch template/variation.js
npm init
npm link // make your module available globally on your system
```

using a template:
```
xp scaffold my-experience-template
```

tip:
in order for your folder to be a valid javascript package, you need to have a 'main' entry in your package.json that points to a a javascript file, e.g. ``` template/variation.js ``` otherwise npm will not recognise your folder as a module and you will not be able to install it

## file reference

```
files:
- package.json // metadata
- global.js // global code
- triggers.js // activation logic
- varition-xxx.js // execution code
- variation-xxx.css // css
```

## help menu

```
xp --help
Usage: xp [varaition.js] [options]
       xp <cmd> [options]


Commands:

  up                   push experience up to remote
  down                 pull experience down from remote
  connect              pull down experiences that you are editing in the platform
  scaffold <template>  scaffold a project from a template
  open                 open xp folder in finder, e.g. to locate chrome-extension

Options:

  -h, --help         output usage information
  -V, --version      output the version number
  -p, --port [port]  use custom [port]
  -w, --watch        watch for changes and live reload
  -s, --sync         watch for changes and sync with remote


Examples:

  $ xp --help
  $ xp scaffold example
  $ xp variation.js --watch
  $ xp variation.js --sync
  $ xp up
  $ xp down
  $ xp connect
```

notes:
- if it isn't working after an update, you may need to reload the extension


[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
