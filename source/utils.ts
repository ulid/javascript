import { ENCODING, ENCODING_LEN } from "./constants.js";
import { PRNG } from "./types.js";

export function randomChar(prng: PRNG): string {
    // Currently PRNGs generate fractions from 0 to _less than_ 1, so no "%" is necessary.
    // However, just in case a future PRNG can generate 1,
    // we are applying "% ENCODING LEN" to wrap back to the first character
    const randomPosition = Math.floor(prng() * ENCODING_LEN) % ENCODING_LEN;
    return ENCODING[randomPosition];
}

export function replaceCharAt(str: string, index: number, char: string): string {
    if (index > str.length - 1) {
        return str;
    }
    return str.substring(0, index) + char + str.substring(index + 1);
}
