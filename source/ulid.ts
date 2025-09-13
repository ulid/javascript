import crypto from "node:crypto";
import { incrementBase32 } from "./crockford.js";
import { ENCODING, ENCODING_LEN, RANDOM_LEN, TIME_LEN, TIME_MAX } from "./constants.js";
import { ULIDError, ULIDErrorCode } from "./error.js";
import { PRNG, ULID, ULIDFactory } from "./types.js";
import { randomChar } from "./utils.js";

/**
 * Decode time from a ULID
 * @param id The ULID
 * @returns The decoded timestamp
 */
export function decodeTime(id: ULID): number {
    if (id.length !== TIME_LEN + RANDOM_LEN) {
        throw new ULIDError(ULIDErrorCode.DecodeTimeValueMalformed, "Malformed ULID");
    }
    const time = id
        .substr(0, TIME_LEN)
        .toUpperCase()
        .split("")
        .reverse()
        .reduce((carry, char, index) => {
            const encodingIndex = ENCODING.indexOf(char);
            if (encodingIndex === -1) {
                throw new ULIDError(
                    ULIDErrorCode.DecodeTimeInvalidCharacter,
                    `Time decode error: Invalid character: ${char}`
                );
            }
            return (carry += encodingIndex * Math.pow(ENCODING_LEN, index));
        }, 0);
    if (time > TIME_MAX) {
        throw new ULIDError(
            ULIDErrorCode.DecodeTimeValueMalformed,
            `Malformed ULID: timestamp too large: ${time}`
        );
    }
    return time;
}

export function detectPRNGMemoized(): () => PRNG {
    let prng: PRNG | null = null;
    return (): PRNG => {
        if (prng === null) {
            prng = detectPRNG();
        }
        return prng;
    };
}

// memoized prng detector for performance
const getPRNG = detectPRNGMemoized();

/**
 * Detect the best PRNG (pseudo-random number generator)
 * @param root The root to check from (global/window)
 * @returns The PRNG function
 */
export function detectPRNG(root?: any): PRNG {
    const rootLookup = root || detectRoot();
    const globalCrypto =
        (rootLookup && (rootLookup.crypto || rootLookup.msCrypto)) ||
        (typeof crypto !== "undefined" ? crypto : null);
    if (typeof globalCrypto?.getRandomValues === "function") {
        const buffer = new Uint8Array(1);
        return () => {
            const buffer = new Uint8Array(1);
            globalCrypto.getRandomValues(buffer);
            return buffer[0] / 0xff;
        };
    } else if (typeof globalCrypto?.randomBytes === "function") {
        return () => globalCrypto.randomBytes(1).readUInt8() / 0xff;
    } else if (crypto?.randomBytes) {
        return () => crypto.randomBytes(1).readUInt8() / 0xff;
    }
    throw new ULIDError(ULIDErrorCode.PRNGDetectFailure, "Failed to find a reliable PRNG");
}

function detectRoot(): any {
    if (inWebWorker()) return self;
    if (typeof window !== "undefined") {
        return window;
    }
    if (typeof global !== "undefined") {
        return global;
    }
    if (typeof globalThis !== "undefined") {
        return globalThis;
    }
    return null;
}

export function encodeRandom(len: number, prng: PRNG): string {
    let str = "";
    for (; len > 0; len--) {
        str = randomChar(prng) + str;
    }
    return str;
}

/**
 * Encode the time portion of a ULID
 * @param now The current timestamp
 * @param len Length to generate
 * @returns The encoded time
 */
export function encodeTime(now: number, len: number = TIME_LEN): string {
    if (isNaN(now)) {
        throw new ULIDError(
            ULIDErrorCode.EncodeTimeValueMalformed,
            `Time must be a number: ${now}`
        );
    } else if (now > TIME_MAX) {
        throw new ULIDError(
            ULIDErrorCode.EncodeTimeSizeExceeded,
            `Cannot encode a time larger than ${TIME_MAX}: ${now}`
        );
    } else if (now < 0) {
        throw new ULIDError(ULIDErrorCode.EncodeTimeNegative, `Time must be positive: ${now}`);
    } else if (Number.isInteger(now) === false) {
        throw new ULIDError(
            ULIDErrorCode.EncodeTimeValueMalformed,
            `Time must be an integer: ${now}`
        );
    }
    let mod: number,
        str: string = "";
    for (let currentLen = len; currentLen > 0; currentLen--) {
        mod = now % ENCODING_LEN;
        str = ENCODING.charAt(mod) + str;
        now = (now - mod) / ENCODING_LEN;
    }
    return str;
}

function inWebWorker(): boolean {
    // @ts-ignore
    return typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
}

/**
 * Check if a ULID is valid
 * @param id The ULID to test
 * @returns True if valid, false otherwise
 * @example
 *   isValid("01HNZX8JGFACFA36RBXDHEQN6E"); // true
 *   isValid(""); // false
 */
export function isValid(id: string): boolean {
    return (
        typeof id === "string" &&
        id.length === TIME_LEN + RANDOM_LEN &&
        id
            .toUpperCase()
            .split("")
            .every(char => ENCODING.indexOf(char) !== -1)
    );
}

/**
 * Create a ULID factory to generate monotonically-increasing
 *  ULIDs
 * @param prng The PRNG to use
 * @returns A ulid factory
 * @example
 *  const ulid = monotonicFactory();
 *  ulid(); // "01HNZXD07M5CEN5XA66EMZSRZW"
 */
export function monotonicFactory(prng?: PRNG): ULIDFactory {
    const currentPRNG = prng || getPRNG();
    let lastTime: number = 0,
        lastRandom: string;
    return function _ulid(seedTime?: number): ULID {
        const seed = !seedTime || isNaN(seedTime) ? Date.now() : seedTime;
        if (seed <= lastTime) {
            const incrementedRandom = (lastRandom = incrementBase32(lastRandom));
            return encodeTime(lastTime, TIME_LEN) + incrementedRandom;
        }
        lastTime = seed;
        const newRandom = (lastRandom = encodeRandom(RANDOM_LEN, currentPRNG));
        return encodeTime(seed, TIME_LEN) + newRandom;
    };
}

/**
 * Generate a ULID
 * @param seedTime Optional time seed
 * @param prng Optional PRNG function
 * @returns A ULID string
 * @example
 *  ulid(); // "01HNZXD07M5CEN5XA66EMZSRZW"
 */
export function ulid(seedTime?: number, prng?: PRNG): ULID {
    const currentPRNG = prng || detectPRNG();
    const seed = !seedTime || isNaN(seedTime) ? Date.now() : seedTime;
    const currentPRNG = prng || getPRNG();
    return encodeTime(seed, TIME_LEN) + encodeRandom(RANDOM_LEN, currentPRNG);
}
