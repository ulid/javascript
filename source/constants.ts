// These values should NEVER change. The values are precisely for
// generating ULIDs.
export const B32_CHARACTERS = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
export const ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"; // Crockford's Base32
export const ENCODING_LEN = 32; // from ENCODING.length;
export const MAX_ULID = "7ZZZZZZZZZZZZZZZZZZZZZZZZZ";
export const MIN_ULID = "00000000000000000000000000";
export const RANDOM_LEN = 16;
export const TIME_LEN = 10;
export const TIME_MAX = 281474976710655; // from Math.pow(2, 48) - 1;
export const ULID_REGEX = /^[0-7][0-9a-hjkmnp-tv-zA-HJKMNP-TV-Z]{25}$/;
export const UUID_REGEX = /^[0-9a-fA-F]{8}-(?:[0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$/;

// fast lookup of index, avoid O(n) indexOf calls
export const ENCODING_LOOKUP = new Map<string, number>(
    ENCODING.split("").map((char, index) => [char, index])
);
export const B32_CHARACTERS_LOOKUP = new Map<string, number>(
    B32_CHARACTERS.split("").map((char, index) => [char, index])
);
