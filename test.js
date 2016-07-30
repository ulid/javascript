var assert = require('assert')
var ulid = require('./')

describe('ulid', function() {

  describe('strongRandomNumber', function() {

    it('should produce a number', function() {
      assert.strictEqual(false, isNaN(ulid.strongRandomNumber()))
    })

    it('should be between 0 and 1', function() {
      var num = ulid.strongRandomNumber()
      assert(num > 0 && num < 1)
    })

  })

  describe('encodeTime', function() {

    var time = 1469918176385

    it('should return expected encoded result', function() {
      assert.strictEqual('01ARYZ6S41', ulid.encodeTime(time, 10))
    })

    it('should change length properly', function() {
      assert.strictEqual('0001ARYZ6S41', ulid.encodeTime(time, 12))
    })

    it('should truncate time if not enough length', function() {
      assert.strictEqual('ARYZ6S41', ulid.encodeTime(time, 8))
    })

  })

  describe('encodeRandom', function() {

    it('should return correct length', function() {
      assert.strictEqual(12, ulid.encodeRandom(12).length)
    })

  })

  describe('ulid', function() {

    it('should return correct length', function() {
      assert.strictEqual(26, ulid().length)
    })

  })

})
