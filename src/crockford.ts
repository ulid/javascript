// Code from https://github.com/devbanana/crockford-base32/blob/develop/src/index.ts
import { B32_CHARACTERS, ENCODING, ENCODING_LEN } from "./constants.js";
import { ULIDError, ULIDErrorCode } from "./error.js";
import { replaceCharAt } from "./utils.js";

export function crockfordEncode(input: Uint8Array): string {
    const output: number[] = [];
    let bitsRead = 0;
    let buffer = 0;
    const reversedInput = new Uint8Array(input.slice().reverse());
    for (const byte of reversedInput) {
        buffer |= byte << bitsRead;
        bitsRead += 8;

        while (bitsRead >= 5) {
            output.unshift(buffer & 0x1f);
            buffer >>>= 5;
            bitsRead -= 5;
        }
    }
    if (bitsRead > 0) {
        output.unshift(buffer & 0x1f);
    }
    return output.map(byte => B32_CHARACTERS.charAt(byte)).join("");
}

export function crockfordDecode(input: string): Uint8Array {
    const sanitizedInput = input.toUpperCase().split("").reverse().join("");
    const output: number[] = [];
    let bitsRead = 0;
    let buffer = 0;
    for (const character of sanitizedInput) {
        const byte = B32_CHARACTERS.indexOf(character);
        if (byte === -1) {
            throw new Error(`Invalid base 32 character found in string: ${character}`);
        }
        buffer |= byte << bitsRead;
        bitsRead += 5;
        while (bitsRead >= 8) {
            output.unshift(buffer & 0xff);
            buffer >>>= 8;
            bitsRead -= 8;
        }
    }
    if (bitsRead >= 5 || buffer > 0) {
        output.unshift(buffer & 0xff);
    }
    return new Uint8Array(output);
}

/**
 * Fix a ULID's Base32 encoding -
 * i and l (case-insensitive) will be treated as 1 and o (case-insensitive) will be treated as 0.
 * hyphens are ignored during decoding.
 * @param id The ULID
 * @returns The cleaned up ULID
 */
export function fixULIDBase32(id: string): string {
    return id.replace(/i/gi, "1").replace(/l/gi, "1").replace(/o/gi, "0").replace(/-/g, "");
}

export function incrementBase32(str: string): string {
    let done: string | undefined = undefined,
        index = str.length,
        char: string,
        charIndex: number,
        output = str;
    const maxCharIndex = ENCODING_LEN - 1;
    while (!done && index-- >= 0) {
        char = output[index];
        charIndex = ENCODING.indexOf(char);
        if (charIndex === -1) {
            throw new ULIDError(
                ULIDErrorCode.Base32IncorrectEncoding,
                "Incorrectly encoded string"
            );
        }
        if (charIndex === maxCharIndex) {
            output = replaceCharAt(output, index, ENCODING[0]);
            continue;
        }
        done = replaceCharAt(output, index, ENCODING[charIndex + 1]);
    }
    if (typeof done === "string") {
        return done;
    }
    throw new ULIDError(ULIDErrorCode.Base32IncorrectEncoding, "Failed incrementing string");
}
