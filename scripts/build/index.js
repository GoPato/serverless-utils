const path = require('path')
const getPackages = require('./get-packages')
const getPackageCommands = require('./get-commands')
const buildPackages = require('./build-packages')

const build = (directory) => {
  const packagesDir = path.resolve(__dirname, '..', '..', directory)
  const buildScripts = getPackages(packagesDir).map(getPackageCommands)
  buildPackages(buildScripts)
}

build('packages')
