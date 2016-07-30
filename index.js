import { randomBytes } from 'crypto';

// Crockford's Base32
// https://en.wikipedia.org/wiki/Base32
const ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"

function strongRandomNumber() {
  return randomBytes(4).readUInt32LE() / 0xFFFFFFFF
}

function encodeTime(now, len) {
  let arr = []
  for (let x = len; x > 0; x--) {
    let mod = now % ENCODING.length
    arr[x] = ENCODING.charAt(mod)
    now = (now - mod) / ENCODING.length
  }
  return arr
}

function encodeRandom(len) {
  let arr = []
  for (let x = len; x > 0; x--) {
    let rando = Math.floor(ENCODING.length * strongRandomNumber())
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

export {
  strongRandomNumber,
  encodeTime,
  encodeRandom
}

export default ulid
