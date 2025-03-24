import { ENCODING, ENCODING_LEN } from "./constants.js";
import { PRNG } from "./types.js";

export function randomChar(prng: PRNG): string {
    let rand = Math.floor(prng() * ENCODING_LEN);
    if (rand === ENCODING_LEN) {
        rand = ENCODING_LEN - 1;
    }
    return ENCODING.charAt(rand);
}

export function replaceCharAt(str: string, index: number, char: string): string {
    if (index > str.length - 1) {
        return str;
    }
    return str.substr(0, index) + char + str.substr(index + 1);
}
