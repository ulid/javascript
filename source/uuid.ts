import { UUID } from "crypto";
import { ULID_REGEX, UUID_REGEX } from "./constants.js";
import { crockfordDecode, crockfordEncode } from "./crockford.js";
import { ULIDError, ULIDErrorCode } from "./error.js";
import { ULID } from "./types.js";

/**
 * Convert a ULID to a UUID
 * @param ulid The ULID to convert
 * @returns A UUID string
 */
export function ulidToUUID(ulid: ULID): UUID {
    const isValid = ULID_REGEX.test(ulid);
    if (!isValid) {
        throw new ULIDError(ULIDErrorCode.ULIDInvalid, `Invalid ULID: ${ulid}`);
    }
    const uint8Array = crockfordDecode(ulid);
    let uuid = Array.from(uint8Array)
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
    uuid =
        uuid.substring(0, 8) +
        "-" +
        uuid.substring(8, 12) +
        "-" +
        uuid.substring(12, 16) +
        "-" +
        uuid.substring(16, 20) +
        "-" +
        uuid.substring(20);
    return uuid.toUpperCase() as UUID;
}

/**
 * Convert a UUID to a ULID
 * @param uuid The UUID to convert
 * @returns A ULID string
 */
export function uuidToULID(uuid: string): ULID {
    const isValid = UUID_REGEX.test(uuid);
    if (!isValid) {
        throw new ULIDError(ULIDErrorCode.UUIDInvalid, `Invalid UUID: ${uuid}`);
    }
    const bytes = uuid.replace(/-/g, "").match(/.{1,2}/g);
    if (!bytes) {
        throw new ULIDError(ULIDErrorCode.Unexpected, `Failed parsing UUID bytes: ${uuid}`);
    }
    const uint8Array = new Uint8Array(bytes.map(byte => parseInt(byte, 16)));
    return crockfordEncode(uint8Array);
}
