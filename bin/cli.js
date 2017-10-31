#! /usr/bin/env node

var ULID = require('../lib/index.umd.js')
process.stdout.write(ULID.ulid())
