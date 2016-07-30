var ulid = require('./')

suite('ulid', function() {

  set('iterations', 100000);

  bench('encodeTime', function() {
    ulid.encodeTime()
  })

  bench('encodeRandom', function() {
    ulid.encodeRandom()
  })

  bench('generate', function() {
    ulid()
  })

})
