// Crockford's Base32
// https://en.wikipedia.org/wiki/Base32
const ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"
if (ENCODING.length !== 32) throw new Error('ENCODING')

// Current Version of SUID
const VERSION = 1

function encodeVersion() {
  if (VERSION >= 16) throw new Error('VERSION')
  return VERSION.toString(16)
}

function encodeTime(len) {
  let now = Date.now()
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
    let rando = Math.floor(ENCODING.length * Math.random())
    arr[x] = ENCODING.charAt(rando)
  }
  return arr
}

function fixedChar() {
  return "F"
}

function ulid() {
  return []
    .concat(encodeTime(10))
    .concat(encodeRandom(16))
    .join('')
    + fixedChar()
    + encodeVersion()
}

export default ulid
