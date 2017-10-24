"use strict";

const factory = (prng) => {

  // These values should NEVER change. If
  // they do, we're no longer making ulids!
  const ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ" // Crockford's Base32
  const ENCODING_LEN = ENCODING.length
  const TIME_MAX = Math.pow(2, 48) - 1
  const TIME_LEN = 10
  const RANDOM_LEN = 16

  function replaceCharAt(str: string, index: number, char: string) {
    if (index > str.length - 1) {
      return str;
    }
    return str.substr(0, index) + char + str.substr(index + 1);
  }

  function incrementBase32(str: string): string {
    let done: string = undefined
    let index = str.length
    let char
    let charIndex
    const maxCharIndex = ENCODING_LEN - 1
    while (!done && index-- >= 0) {
      char = str[index]
      charIndex = ENCODING.indexOf(char)
      if (charIndex === -1) {
        throw new Error("incorrectly encoded string")
      }
      if (charIndex === maxCharIndex) {
        str = replaceCharAt(str, index, ENCODING[0])
        continue
      }
      done = replaceCharAt(str, index, ENCODING[charIndex + 1])
    }
    if (typeof done === "string") {
      return done
    }
    throw new Error("cannot increment this string")
  }

  function randomChar(): string {
    let rand = Math.floor(prng() * ENCODING_LEN)
    if (rand === ENCODING_LEN) {
      rand = ENCODING_LEN - 1
    }
    return ENCODING.charAt(rand)
  }

  function encodeTime(now: number, len: number): string {
    if (isNaN(now)) {
      throw new Error(now + " must be a number")
    }
    if (now > TIME_MAX) {
      throw new Error("cannot encode time greater than " + TIME_MAX)
    }
    if (now < 0) {
      throw new Error("time must be positive")
    }
    if (Number.isInteger(now) === false) {
      throw new Error("time must be an integer")
    }
    let mod
    let str = ""
    for (let x = len; x > 0; x--) {
      mod = now % ENCODING_LEN
      str = ENCODING.charAt(mod) + str
      now = (now - mod) / ENCODING_LEN
    }
    return str
  }

  function encodeRandom(len: number): string {
    return new Array(len).fill(true)
      .map(_ => randomChar())
      .join('')
  }

  function decodeTime(id: string): number {
    if (id.length !== TIME_LEN + RANDOM_LEN) {
      throw new Error("malformed ulid")
    }
    var time = id
      .substr(0, TIME_LEN)
      .split('')
      .reverse()
      .reduce((carry, char, index) => {
        const encodingIndex = ENCODING.indexOf(char)
        if (encodingIndex === -1) {
          throw new Error("invalid character found: " + char)
        }
        return carry += encodingIndex * Math.pow(ENCODING_LEN, index)
      }, 0)
    if (time > TIME_MAX) {
      throw new Error("malformed ulid, timestamp too large")
    }
    return time
  }

  interface ULID {
    (seedTime?: number): string
    prng(): number
    incrementBase32(str: string): string
    randomChar(): string
    encodeTime(now: number, len: number): string
    encodeRandom(len: number): string
    decodeTime(id: string): number
    factory(prng: any): ULID
  }

  let lastEncodedTime: string
  let lastRandom: string

  const ulid = function ulid(seedTime?: number): string {
    if (isNaN(seedTime) === false) {
      return encodeTime(seedTime, TIME_LEN) + encodeRandom(RANDOM_LEN)
    }
    const currTime = Date.now()
    const encodedTime = encodeTime(currTime, TIME_LEN)
    if (encodedTime === lastEncodedTime) {
      const incrementedRandom = lastRandom = incrementBase32(lastRandom)
      return encodedTime + incrementedRandom
    }
    lastEncodedTime = encodedTime
    const newRandom = lastRandom = encodeRandom(RANDOM_LEN)
    return encodedTime + newRandom
  } as ULID

  ulid.prng = prng
  ulid.incrementBase32 = incrementBase32
  ulid.randomChar = randomChar
  ulid.encodeTime = encodeTime
  ulid.encodeRandom = encodeRandom
  ulid.decodeTime = decodeTime
  ulid.factory = factory

  return ulid

}

/* istanbul ignore next */
function _prng(root) {
  var browserCrypto = root && (root.crypto || root.msCrypto)

  if (browserCrypto) {
    try {
      return function() {
        return browserCrypto.getRandomValues(new Uint8Array(1))[0] / 0xFF
      }
    } catch (e) {}
  } else {
    try {
      var nodeCrypto = require("crypto")
      return function() {
        return nodeCrypto.randomBytes(1).readUInt8() / 0xFF
      }
    } catch (e) {}
  }

  if (typeof console !== "undefined" && console.warn) {
    console.warn("[ulid] secure crypto unusable, falling back to insecure Math.random()!")
  }
  return function() {
    return Math.random()
  }
}

/* istanbul ignore next */
(function(root, fn) {

  var prng = _prng(root)
  var ulid = fn(prng)

  if (("undefined" !== typeof module) && module.exports) {
    module.exports = ulid
  } else if (typeof define === "function" && define.amd) {
    define(function() {
      return ulid
    })
  } else {
    root.ulid = ulid
  }

})(typeof window !== "undefined" ? window : null, factory)
