import { describe, expect, it } from "vitest";
import { incrementBase32 } from "../../";

describe("incrementBase32", () => {
    it("increments correctly", () => {
        expect(incrementBase32("A109C")).toEqual("A109D");
    })

    it("carries correctly", () => {
        expect(incrementBase32("A1YZZ")).toEqual("A1Z00");
    })

    it("double increments correctly", () => {
        expect(incrementBase32(incrementBase32("A1YZZ"))).toEqual("A1Z01");
    })

    it("throws when it cannot increment", () => {
        expect(() => {
            incrementBase32("ZZZ")
        }).toThrow(/B32_ENC_INVALID/);
    })
});
