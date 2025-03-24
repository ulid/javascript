import { describe, expect, it } from "vitest";
import { ulidToUUID, uuidToULID } from "../../";

describe("ulidToUUID", () => {
    it("converts ULIDs to UUIDs", () => {
        expect(ulidToUUID("01ARYZ6S41TSV4RRFFQ69G5FAV")).to.equal("01563DF3-6481-D676-4C61-EFB99302BD5B");
        expect(ulidToUUID("01JQ4T23H220KM7X0B3V1109DQ")).to.equal("0195C9A1-0E22-1027-43F4-0B1EC21025B7");
    });
});

describe("uuidToULID", () => {
    it("converts UUIDs to ULIDs", () => {
        expect(uuidToULID("0195C9A4-2E32-C014-5F4F-A7CEF5BE83D5")).to.equal("01JQ4T8BHJR0A5YKX7SVTVX0YN");
        expect(uuidToULID("0195C9A4-74CC-5149-BCC4-0A556A0CF19D")).to.equal("01JQ4T8X6CA54VSH0AANN0SWCX");
    });
});
