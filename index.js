(function(_window) {

  "use strict";

  // Crockford"s Base32
  // https://en.wikipedia.org/wiki/Base32
  var ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"
  var ENCODING_LEN = ENCODING.length

  var prng

  if (_window) {
    try {
      var crypto = _window.crypto || _window.msCrypto
      prng = function() {
        return crypto.getRandomValues(new Uint16Array(1))[0] / 0xFFFF
      }
    }
    catch(e) {}
  }
  else {
    try {
      var crypto = require("crypto")
      prng = function() {
        return crypto.randomBytes(2).readUInt16LE() / 0xFFFF
      }
    }
    catch(e) {}
  }

  if (typeof prng !== "function") {
    prng = function() {
      return Math.random()
    }
    if (typeof console !== "undefined" && console.warn) {
      console.warn("[ulid] crypto not usable, falling back to insecure Math.random()");
    }
  }

  function encodeTime(now, len) {
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

  function ulid() {
    return encodeTime(Date.now(), 10) + encodeRandom(16)
  }

  ulid.prng = prng
  ulid.encodeTime = encodeTime
  ulid.encodeRandom = encodeRandom

  if (("undefined" !== typeof module) && module.exports) {
    module.exports = ulid
  }
  else if (typeof define === "function" && define.amd) {
    define(function() {
      return ulid;
    })
  }
  else {
    _window.ulid = ulid
  }


})("undefined" !== typeof window ? window : null)
