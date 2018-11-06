/* eslint-disable import/no-extraneous-dependencies */
const concurrently = require('concurrently')

const flatten = src => src.reduce(
  (prev, curr) => (Array.isArray(curr) ? [...prev, ...flatten(curr)] : [...prev, curr]),
  [],
)

const buildPackages = commands => concurrently(flatten(commands))

module.exports = buildPackages
