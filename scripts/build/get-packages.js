/* eslint-disable no-console, global-require, import/no-dynamic-require */
const path = require('path')
const fs = require('fs')

const getPackages = directory => fs
  .readdirSync(directory)
  .map((file) => {
    const src = path.resolve(directory, file)
    let pkg

    if (!fs.lstatSync(path.resolve(src)).isDirectory()) {
      console.log(`[WARNING]: ${src} is not a directory, ignoring.`)
      return null
    }

    try {
      pkg = require(path.resolve(src, 'package.json'))
    } catch (err) {
      console.log(`[WARNING]: ${src} doesn't contain a package.json, ignoring.`)
      return null
    }

    try {
      fs.lstatSync(path.resolve(src, 'src'))
    } catch (err) {
      console.log(`[WARNING]: ${src} doesn't contain a \`src\` folder, ignoring.`)
      return null
    }

    return { src, name: pkg.name }
  })
  .filter(file => file)

module.exports = getPackages
