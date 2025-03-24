export enum ULIDErrorCode {
    Base32IncorrectEncoding = "B32_ENC_INVALID",
    DecodeTimeInvalidCharacter = "DEC_TIME_CHAR",
    DecodeTimeValueMalformed = "DEC_TIME_MALFORMED",
    EncodeTimeNegative = "ENC_TIME_NEG",
    EncodeTimeSizeExceeded = "ENC_TIME_SIZE_EXCEED",
    EncodeTimeValueMalformed = "ENC_TIME_MALFORMED",
    PRNGDetectFailure = "PRNG_DETECT",
    ULIDInvalid = "ULID_INVALID",
    Unexpected = "UNEXPECTED",
    UUIDInvalid = "UUID_INVALID"
}

export class ULIDError extends Error {
    public code: ULIDErrorCode;

    constructor(errorCode: ULIDErrorCode, message: string) {
        super(`${message} (${errorCode})`);

        this.name = "ULIDError";

        this.code = errorCode;
    }
}
