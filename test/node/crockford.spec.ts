import { describe, expect, it } from "vitest";
import { fixULIDBase32, incrementBase32 } from "../../";

describe("fixULIDBase32", () => {
    it("fixes mis-encoded ULIDs", () => {
        expect(fixULIDBase32("oLARYZ6-S41TSV4RRF-FQ69G5FAV")).to.equal(
            "01ARYZ6S41TSV4RRFFQ69G5FAV"
        );
    });
});

describe("incrementBase32", () => {
    it("increments correctly", () => {
        expect(incrementBase32("A109C")).toEqual("A109D");
    });

    it("carries correctly", () => {
        expect(incrementBase32("A1YZZ")).toEqual("A1Z00");
    });

    it("double increments correctly", () => {
        expect(incrementBase32(incrementBase32("A1YZZ"))).toEqual("A1Z01");
    });

    it("throws when it cannot increment", () => {
        expect(() => {
            incrementBase32("ZZZ");
        }).toThrow(/B32_ENC_INVALID/);
    });
});
