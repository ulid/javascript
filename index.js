var crypto = require('crypto')

// Crockford's Base32
// https://en.wikipedia.org/wiki/Base32
var ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"

function strongRandomNumber() {
  return crypto.randomBytes(4).readUInt32LE() / 0xFFFFFFFF
}

function encodeTime(now, len) {
  var mod
  var now
  var str = ''
  for (var x = len; x > 0; x--) {
    mod = now % ENCODING.length
    str = ENCODING.charAt(mod) + str
    now = (now - mod) / ENCODING.length
  }
  return str
}

function encodeRandom(len) {
  var rand
  var str = ''
  for (var x = 0; x < len; x++) {
    rand = Math.floor(ENCODING.length * strongRandomNumber())
    str = ENCODING.charAt(rand) + str
  }
  return str
}

function ulid() {
  return encodeTime(Date.now(), 10) + encodeRandom(16)
}

ulid.strongRandomNumber = strongRandomNumber
ulid.encodeTime = encodeTime
ulid.encodeRandom = encodeRandom
module.exports = ulid
