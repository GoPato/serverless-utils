const path = require('path')

const getCommand = (template, cmd, pkg) => {
  const input = path.resolve(pkg.src, 'src')
  const output = path.resolve(pkg.src, 'dist')
  const args = process.argv.slice(2)
  const values = [cmd, input, output, args]

  return {
    prefixColor: 'yellow',
    name: `${pkg.name} (${cmd})`,
    command: template.replace(/%s/g, () => values.shift()),
  }
}

const getPackageCommands = pkg => [
  getCommand(`%s -rf ${pkg.src}/dist`, 'rm', pkg),
  getCommand('%s %s -d %s %s --copy-files --verbose', 'babel', pkg),
  getCommand('%s %s %s %s --verbose', 'flow-copy-source', pkg),
]

module.exports = getPackageCommands
