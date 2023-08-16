var child_process = require("child_process")
var path = require("path")
var assert = require("assert")
var lolex = require("lolex")

var ULID = require("./dist/index.umd.js")
var ulid = ULID.factory()

describe("ulid", function() {
  describe("prng", function() {
    var prng = ULID.detectPrng()

    it("should produce a number", function() {
      assert.strictEqual(false, isNaN(prng()))
    })

    it("should be between 0 and 1", function() {
      var num = prng()
      assert(num >= 0 && num <= 1)
    })
  })

  describe("incremenet base32", function() {
    it("increments correctly", function() {
      assert.strictEqual("A109D", ULID.incrementBase32("A109C"))
    })

    it("carries correctly", function() {
      assert.strictEqual("A1Z00", ULID.incrementBase32("A1YZZ"))
    })

    it("double increments correctly", function() {
      assert.strictEqual("A1Z01", ULID.incrementBase32(ULID.incrementBase32("A1YZZ")))
    })

    it("throws when it cannot increment", function() {
      assert.throws(function() {
        ULID.incrementBase32("ZZZ")
      })
    })
  })

  describe("randomChar", function() {
    var sample = {}
    var prng = ULID.detectPrng()

    for (var x = 0; x < 320000; x++) {
      char = String(ULID.randomChar(prng)) // for if it were to ever return undefined
      if (sample[char] === undefined) {
        sample[char] = 0
      }
      sample[char] += 1
    }

    it("should never return undefined", function() {
      assert.strictEqual(undefined, sample["undefined"])
    })

    it("should never return an empty string", function() {
      assert.strictEqual(undefined, sample[""])
    })
  })

  describe("encodeTime", function() {
    it("should return expected encoded result", function() {
      assert.strictEqual("01ARYZ6S41", ULID.encodeTime(1469918176385, 10))
    })

    it("should change length properly", function() {
      assert.strictEqual("0001AS99AA60", ULID.encodeTime(1470264322240, 12))
    })

    it("should truncate time if not enough length", function() {
      assert.strictEqual("AS4Y1E11", ULID.encodeTime(1470118279201, 8))
    })

    describe("should throw an error", function() {
      it("if time greater than (2 ^ 48) - 1", function() {
        assert.throws(function() {
          ULID.encodeTime(Math.pow(2, 48), 8)
        }, Error)
      })

      it("if time is not a number", function() {
        assert.throws(function() {
          ULID.encodeTime("test")
        }, Error)
      })

      it("if time is infinity", function() {
        assert.throws(function() {
          ULID.encodeTime(Infinity)
        }, Error)
      })

      it("if time is negative", function() {
        assert.throws(function() {
          ULID.encodeTime(-1)
        }, Error)
      })

      it("if time is a float", function() {
        assert.throws(function() {
          ULID.encodeTime(100.1)
        }, Error)
      })
    })
  })

  describe("encodeRandom", function() {
    var prng = ULID.detectPrng()

    it("should return correct length", function() {
      assert.strictEqual(12, ULID.encodeRandom(12, prng).length)
    })
  })

  describe("decodeTime", function() {
    it("should return correct timestamp", function() {
      var timestamp = Date.now()
      var id = ulid(timestamp)
      assert.strictEqual(timestamp, ULID.decodeTime(id))
    })

    it("should accept the maximum allowed timestamp", function() {
      assert.strictEqual(281474976710655, ULID.decodeTime("7ZZZZZZZZZZZZZZZZZZZZZZZZZ"))
    })

    describe("should reject", function() {
      it("malformed strings of incorrect length", function() {
        assert.throws(function() {
          ULID.decodeTime("FFFF")
        }, Error)
      })

      it("strings with timestamps that are too high", function() {
        assert.throws(function() {
          ULID.decodeTime("80000000000000000000000000")
        }, Error)
      })
    })
  })

  describe("ulid", function() {
    it("should return correct length", function() {
      assert.strictEqual(26, ulid().length)
    })

    it("should return expected encoded time component result", function() {
      assert.strictEqual("01ARYZ6S41", ulid(1469918176385).substring(0, 10))
    })
  })

  describe("monotonicity", function() {
    function stubbedPrng() {
      return 0.96
    }

    var stubbedUlid = ULID.factory(stubbedPrng)

    describe("without seedTime", function() {
      var stubbedUlid = ULID.monotonicFactory(stubbedPrng)
      var clock

      before(function() {
        clock = lolex.install({
          now: 1469918176385,
          toFake: ["Date"],
        })
      })

      after(function() {
        clock.uninstall()
      })

      it("first call", function() {
        assert.strictEqual("01ARYZ6S41YYYYYYYYYYYYYYYY", stubbedUlid())
      })

      it("second call", function() {
        assert.strictEqual("01ARYZ6S41YYYYYYYYYYYYYYYZ", stubbedUlid())
      })

      it("third call", function() {
        assert.strictEqual("01ARYZ6S41YYYYYYYYYYYYYYZ0", stubbedUlid())
      })

      it("fourth call", function() {
        assert.strictEqual("01ARYZ6S41YYYYYYYYYYYYYYZ1", stubbedUlid())
      })
    })

    describe("with seedTime", function() {
      var stubbedUlid = ULID.monotonicFactory(stubbedPrng)

      it("first call", function() {
        assert.strictEqual("01ARYZ6S41YYYYYYYYYYYYYYYY", stubbedUlid(1469918176385))
      })

      it("second call with the same", function() {
        assert.strictEqual("01ARYZ6S41YYYYYYYYYYYYYYYZ", stubbedUlid(1469918176385))
      })

      it("third call with less than", function() {
        assert.strictEqual("01ARYZ6S41YYYYYYYYYYYYYYZ0", stubbedUlid(100000000))
      })

      it("fourth call with even more less than", function() {
        assert.strictEqual("01ARYZ6S41YYYYYYYYYYYYYYZ1", stubbedUlid(10000))
      })

      it("fifth call with 1 greater than", function() {
        assert.strictEqual("01ARYZ6S42YYYYYYYYYYYYYYYY", stubbedUlid(1469918176386))
      })
    })
  })

  describe("command line", function() {
    it("should return a valid ULID", function(done) {
      child_process.exec(path.join(__dirname, "bin/cli.js"), (error, stdout, stderr) => {
        if (stdout.length === 26 && !error && !stderr) {
          done()
        } else {
          done(error || stderr)
        }
      })
    })
  })

  describe("constants", function () {
    it("should export MIN_ULID", function () {
      assert.strictEqual(ULID.MIN_ULID, "00000000000000000000000000");
    });

    it("should export MAX_ULID", function () {
      assert.strictEqual(ULID.MAX_ULID, "7ZZZZZZZZZZZZZZZZZZZZZZZZZ");
    });
  });
})
