"use strict";

function factory(prng) {

  // Crockford's Base32
  // https://en.wikipedia.org/wiki/Base32
  var ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"
  var ENCODING_LOWER = "0123456789abcdefghjkmnpqrstvwxyz"
  var ENCODING_LEN = ENCODING.length
  var TIME_MAX = 281474976710655
  var TIME_LEN = 10
  var RANDOM_LEN = 16

  function encodeTime(now, len) {
    if (isNaN(now)) {
      throw new Error(now + " must be a number")
    }
    if (now > TIME_MAX) {
      throw new Error("cannot encode time greater than " + TIME_MAX)
    }
    if (now < 0) {
      throw new Error("time must be a positive integer")
    }
    var mod
    var now
    var str = ""
    for (var x = len; x > 0; x--) {
      mod = now % ENCODING_LEN
      str = ENCODING.charAt(mod) + str
      now = (now - mod) / ENCODING_LEN
    }
    return str
  }

  function encodeRandom(len) {
    var rand
    var str = ""
    for (var x = 0; x < len; x++) {
      rand = Math.floor(ENCODING_LEN * prng())
      str = ENCODING.charAt(rand) + str
    }
    return str
  }

  function ulid(seedTime) {
    if (!seedTime) {
      seedTime = Date.now();
    }
    return encodeTime(seedTime, TIME_LEN) + encodeRandom(RANDOM_LEN)
  }

  function lower(seedTime) {
    ENCODING = ENCODING_LOWER
    return ulid(seedTime)
  }

  ulid.prng = prng
  ulid.encodeTime = encodeTime
  ulid.encodeRandom = encodeRandom
  ulid.lower = lower

  return ulid

}


/* istanbul ignore next */
function _prng(root) {

  if (root) {
    try {
      var crypto = root.crypto || root.msCrypto
      return function() {
        return crypto.getRandomValues(new Uint16Array(1))[0] / 0xFFFF
      }
    }
    catch (e) {}
  } else {
    try {
      var crypto = require("crypto")
      return function() {
        return crypto.randomBytes(2).readUInt16LE() / 0xFFFF
      }
    }
    catch (e) {}
  }

  if (typeof prng !== "function") {
    if (typeof console !== "undefined" && console.warn) {
      console.warn("[ulid] crypto not usable, falling back to insecure Math.random()");
    }
    return function() {
      return Math.random()
    }
  }

}


/* istanbul ignore next */
(function(root, fn) {

  var prng = _prng(root)
  var ulid = fn(prng)

  if (("undefined" !== typeof module) && module.exports) {
    module.exports = ulid
  }
  else if (typeof define === "function" && define.amd) {
    define(function() {
      return ulid
    })
  }
  else {
    root.ulid = ulid
  }

})(typeof window !== "undefined" ? window : null, factory)
