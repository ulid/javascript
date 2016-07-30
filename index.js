var crypto = require('crypto')

// Crockford's Base32
// https://en.wikipedia.org/wiki/Base32
var ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"

function strongRandomNumber() {
  return crypto.randomBytes(4).readUInt32LE() / 0xFFFFFFFF
}

function encodeTime(now, len) {
  var arr = []
  for (var x = len; x > 0; x--) {
    var mod = now % ENCODING.length
    arr[x] = ENCODING.charAt(mod)
    now = (now - mod) / ENCODING.length
  }
  return arr
}

function encodeRandom(len) {
  var rand
  var arr = []
  for (var x = len; x > 0; x--) {
    rand = Math.floor(ENCODING.length * strongRandomNumber())
    arr[x] = ENCODING.charAt(rando)
  }
  return arr
}

function ulid() {
  return []
    .concat(encodeTime(Date.now(), 10))
    .concat(encodeRandom(16))
    .join('')
}

module.exports = {
  "strongRandomNumber": strongRandomNumber,
  "encodeTime": encodeTime,
  "encodeRandom": encodeRandom,
  "ulid": ulid
}
