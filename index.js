(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.factory = function (prng) {
        // These values should NEVER change. If
        // they do, we're no longer making ulids!
        var ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"; // Crockford's Base32
        var ENCODING_LEN = ENCODING.length;
        var TIME_MAX = Math.pow(2, 48) - 1;
        var TIME_LEN = 10;
        var RANDOM_LEN = 16;
        function replaceCharAt(str, index, char) {
            if (index > str.length - 1) {
                return str;
            }
            return str.substr(0, index) + char + str.substr(index + 1);
        }
        function incrementBase32(str) {
            var done = undefined;
            var index = str.length;
            var char;
            var charIndex;
            var maxCharIndex = ENCODING_LEN - 1;
            while (!done && index-- >= 0) {
                char = str[index];
                charIndex = ENCODING.indexOf(char);
                if (charIndex === -1) {
                    throw new Error("incorrectly encoded string");
                }
                if (charIndex === maxCharIndex) {
                    str = replaceCharAt(str, index, ENCODING[0]);
                    continue;
                }
                done = replaceCharAt(str, index, ENCODING[charIndex + 1]);
            }
            if (typeof done === "string") {
                return done;
            }
            throw new Error("cannot increment this string");
        }
        function randomChar() {
            var rand = Math.floor(prng() * ENCODING_LEN);
            if (rand === ENCODING_LEN) {
                rand = ENCODING_LEN - 1;
            }
            return ENCODING.charAt(rand);
        }
        function encodeTime(now, len) {
            if (isNaN(now)) {
                throw new Error(now + " must be a number");
            }
            if (now > TIME_MAX) {
                throw new Error("cannot encode time greater than " + TIME_MAX);
            }
            if (now < 0) {
                throw new Error("time must be positive");
            }
            if (Number.isInteger(now) === false) {
                throw new Error("time must be an integer");
            }
            var mod;
            var str = "";
            for (var x = len; x > 0; x--) {
                mod = now % ENCODING_LEN;
                str = ENCODING.charAt(mod) + str;
                now = (now - mod) / ENCODING_LEN;
            }
            return str;
        }
        function encodeRandom(len) {
            var str = "";
            for (; len > 0; len--) {
                str = randomChar() + str;
            }
            return str;
        }
        function decodeTime(id) {
            if (id.length !== TIME_LEN + RANDOM_LEN) {
                throw new Error("malformed ulid");
            }
            var time = id
                .substr(0, TIME_LEN)
                .split('')
                .reverse()
                .reduce(function (carry, char, index) {
                var encodingIndex = ENCODING.indexOf(char);
                if (encodingIndex === -1) {
                    throw new Error("invalid character found: " + char);
                }
                return carry += encodingIndex * Math.pow(ENCODING_LEN, index);
            }, 0);
            if (time > TIME_MAX) {
                throw new Error("malformed ulid, timestamp too large");
            }
            return time;
        }
        function createMonotonic() {
            var lastTime = 0;
            var lastRandom;
            return function ulid(seedTime) {
                if (isNaN(seedTime)) {
                    seedTime = Date.now();
                }
                if (seedTime <= lastTime) {
                    var incrementedRandom = lastRandom = incrementBase32(lastRandom);
                    return encodeTime(lastTime, TIME_LEN) + incrementedRandom;
                }
                lastTime = seedTime;
                var newRandom = lastRandom = encodeRandom(RANDOM_LEN);
                return encodeTime(seedTime, TIME_LEN) + newRandom;
            };
        }
        var ulid = function ulid(seedTime) {
            if (isNaN(seedTime)) {
                seedTime = Date.now();
            }
            return encodeTime(seedTime, TIME_LEN) + encodeRandom(RANDOM_LEN);
        };
        ulid.prng = prng;
        ulid.createMonotonic = createMonotonic;
        ulid.incrementBase32 = incrementBase32;
        ulid.randomChar = randomChar;
        ulid.encodeTime = encodeTime;
        ulid.encodeRandom = encodeRandom;
        ulid.decodeTime = decodeTime;
        return ulid;
    };
    /* istanbul ignore next */
    function _prng(root) {
        var browserCrypto = root && (root.crypto || root.msCrypto);
        if (browserCrypto) {
            try {
                return function () {
                    return browserCrypto.getRandomValues(new Uint8Array(1))[0] / 0xFF;
                };
            }
            catch (e) { }
        }
        else {
            try {
                var nodeCrypto_1 = require("crypto");
                return function () {
                    return nodeCrypto_1.randomBytes(1).readUInt8() / 0xFF;
                };
            }
            catch (e) { }
        }
        throw new Error("[ulid] secure crypto unusable, falling back to insecure Math.random()!");
    }
    var root = typeof window !== "undefined" ? window : null;
    var prng = _prng(root);
    exports["default"] = exports.factory(prng);
});
