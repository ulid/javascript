const assert = require('assert')
const lolex = require('lolex')
const ulid = require('./')

describe('ulid', () => {

  describe('prng', () => {

    it('should produce a number', () => {
      assert.strictEqual(false, isNaN(ulid.prng()))
    })

    it('should be between 0 and 1, tested many times', () => {
      for (var x = 0; x < 1000; x++) {
        var num = ulid.prng()
        assert(num >= 0 && num <= 1)
      }
    })

  })

  describe('incremenet base32', () => {

    it('increments correctly', () => {
      assert.strictEqual('A109D', ulid.incrementBase32('A109C'))
    })

    it('carries correctly', () => {
      assert.strictEqual('A1Z00', ulid.incrementBase32('A1YZZ'))
    })

    it('double increments correctly', () => {
      assert.strictEqual('A1Z01', ulid.incrementBase32(ulid.incrementBase32('A1YZZ')))
    })

    it('throws when it cannot increment', () => {
      assert.throws(() => ulid.incrementBase32('ZZZ'))
    })

  })

  describe('randomChar', () => {

    const sample = {}

    for (let x = 0; x < 100000; x++) {
      char = String(ulid.randomChar()) // for if it were to ever return undefined
      if (sample[char] === undefined) {
        sample[char] = 0
      }
      sample[char] += 1
    }

    it('should never return undefined', () => {
      assert.strictEqual(undefined, sample['undefined'])
    })

    it('should never return an empty string', () => {
      assert.strictEqual(undefined, sample[''])
    })

  })

  describe('encodeTime', () => {

    it('should return expected encoded result', () => {
      assert.strictEqual('01ARYZ6S41', ulid.encodeTime(1469918176385, 10))
    })

    it('should change length properly', () => {
      assert.strictEqual('0001AS99AA60', ulid.encodeTime(1470264322240, 12))
    })

    it('should truncate time if not enough length', () => {
      assert.strictEqual('AS4Y1E11', ulid.encodeTime(1470118279201, 8))
    })

    describe('should throw an error', () => {

      it('if time greater than (2 ^ 48) - 1', () => {
        assert.throws(() => ulid.encodeTime(Math.pow(2, 48), 8), Error)
      })

      it('if time is not a number', () => {
        assert.throws(() => ulid.encodeTime('test'), Error)
      })

      it('if time is infinity', () => {
        assert.throws(() => ulid.encodeTime(Infinity), Error)
      })

      it('if time is negative', () => {
        assert.throws(() => ulid.encodeTime(-1), Error)
      })

      it('if time is a float', () => {
        assert.throws(() => ulid.encodeTime(100.1), Error)
      })

    })

  })

  describe('encodeRandom', () => {

    it('should return correct length', () => {
      assert.strictEqual(12, ulid.encodeRandom(12).length)
    })

  })

  describe('decodeTime', () => {

    it('should return correct timestamp', () => {
      var timestamp = Date.now()
      var id = ulid(timestamp)
      assert.strictEqual(timestamp, ulid.decodeTime(id))
    })

    it('should accept the maximum allowed timestamp', () => {
      assert.strictEqual(281474976710655, ulid.decodeTime('7ZZZZZZZZZZZZZZZZZZZZZZZZZ'))
    })

    describe('should reject', () => {

      it('malformed strings of incorrect length', () => {
        assert.throws(() => ulid.decodeTime('FFFF'), Error)
      })

      it('strings with timestamps that are too high', () => {
        assert.throws(() => ulid.decodeTime('80000000000000000000000000'), Error)
      })

    })

  })

  describe('ulid', () => {

    it('should return correct length', () => {
      assert.strictEqual(26, ulid().length)
    })

    it('should return expected encoded time component result', () => {
      assert.strictEqual('01ARYZ6S41', ulid(1469918176385).substring(0, 10))
    })

  })

  describe('monotonicity', () => {

    function prng() {
      return 0.96
    }

    const stubbedUlid = ulid.factory(prng)

    let clock

    before(() => {
        clock = lolex.install({
          now: 1469918176385,
          toFake: ['Date']
        })
    })

    after(() => {
        clock.uninstall()
    })

    it('first call', () => {
      assert.strictEqual('01ARYZ6S41YYYYYYYYYYYYYYYY', stubbedUlid())
    })

    it('second call', () => {
      assert.strictEqual('01ARYZ6S41YYYYYYYYYYYYYYYZ', stubbedUlid())
    })

    it('third call', () => {
      assert.strictEqual('01ARYZ6S41YYYYYYYYYYYYYYZ0', stubbedUlid())
    })

    it('fourth call', () => {
      assert.strictEqual('01ARYZ6S41YYYYYYYYYYYYYYZ1', stubbedUlid())
    })

  })

})
