var assert = require('assert')
var ulid = require('./')

describe('ulid', function() {

  describe('prng', function() {

    it('should produce a number', function() {
      assert.strictEqual(false, isNaN(ulid.prng()))
    })

    it('should be between 0 and 1', function() {
      var num = ulid.prng()
      assert(num > 0 && num < 1)
    })

  })

  describe('encodeTime', function() {

    it('should return expected encoded result', function() {
      assert.strictEqual('01ARYZ6S41', ulid.encodeTime(1469918176385, 10))
    })

    it('should change length properly', function() {
      assert.strictEqual('0001AS99AA60', ulid.encodeTime(1470264322240, 12))
    })

    it('should truncate time if not enough length', function() {
      assert.strictEqual('AS4Y1E11', ulid.encodeTime(1470118279201, 8))
    })

    describe('should throw an error', function() {

      it('if time greater than (2 ^ 48) - 1', function() {
        assert.throws(() => ulid.encodeTime(Math.pow(2, 48), 8), Error)
      })

      it('if time is not a number', function() {
        assert.throws(() => ulid('test'), Error)
      })

      it('if time is infinity', function() {
        assert.throws(() => ulid('test'), Error)
      })

      it('if time is negative', function() {
        assert.throws(() => ulid(-1), Error)
      })

    })

  })

  describe('encodeRandom', function() {

    it('should return correct length', function() {
      assert.strictEqual(12, ulid.encodeRandom(12).length)
    })

  })
  
  describe('decodeTime', function() {

    it('should return correct timestamp', function() {
      var timestamp = Date.now()
      var id = ulid(timestamp)
      assert.strictEqual(timestamp, ulid.decodeTime(id))
    })

  })

  describe('ulid', function() {

    it('should return correct length', function() {
      assert.strictEqual(26, ulid().length)
    })

    it('should return expected encoded time component result', function() {
      assert.strictEqual('01ARYZ6S41', ulid(1469918176385).substring(0, 10))
    })

  })

})
