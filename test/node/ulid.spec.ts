import { describe, expect, it } from "vitest";
import { monotonicFactory, ulid } from "../../";

const ULID_REXP = /^[0-7][0-9a-hjkmnp-tv-zA-HJKMNP-TV-Z]{25}$/;

describe("monotonicFactory", () => {
    it("creates a factory", () => {
        const factory = monotonicFactory();
        expect(factory).toBeTypeOf("function");
    });

    describe("returned factory", () => {
        it("generates a ULID", () => {
            const factory = monotonicFactory();
            const id = factory();
            expect(id).toMatch(ULID_REXP);
        });
    });
});

describe("ulid", () => {
    it("generates a ULID", () => {
        const id = ulid();
        expect(id).toMatch(ULID_REXP);
    });
});
