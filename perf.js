var ulid = require('./index.js')

suite('ulid', function() {
  bench('generate', function() {
    ulid()
  })
})
