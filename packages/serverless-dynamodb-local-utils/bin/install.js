#!/usr/bin/env node
const { start, stop } = require('../dist/serverless-dynamodb-local-utils')

start().then(stop)
