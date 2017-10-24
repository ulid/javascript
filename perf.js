var ulid = require('./')

suite('ulid', function() {

  set('iterations', 100000);

  bench('encodeTime', function() {
    ulid.encodeTime(1469918176385)
  })

  bench('encodeRandom', function() {
    ulid.encodeRandom(10)
  })

  bench('generate', function() {
    ulid(1469918176385)
  })

})
