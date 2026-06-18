import { describe, expect, it } from "vitest";
import { decodeTime, encodeTime, isValid, monotonicFactory, ulid, ULIDFactory } from "../../";

const ULID_REXP = /^[0-7][0-9a-hjkmnp-tv-zA-HJKMNP-TV-Z]{25}$/;

describe("decodeTime", function () {
    it("extracts a timestamp from a ULID", () => {
        expect(decodeTime("01ARYZ6S41TSV4RRFFQ69G5FAV")).to.equal(1469918176385);
    });
});

describe("encodeTime", function () {
    it("encodes a timestamp", () => {
        expect(encodeTime(1469918176385)).to.equal("01ARYZ6S41");
    });
});

describe("monotonicFactory", () => {
    function stubbedPrng() {
        return 0.96;
    }

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

        describe("during single point in time", function () {
            const SEED_TIME = 1469918176385;
            const stubbedUlid: ULIDFactory = monotonicFactory(stubbedPrng);

            it("first call", function () {
                expect(stubbedUlid(SEED_TIME)).to.equal("01ARYZ6S41YYYYYYYYYYYYYYYY");
            });

            it("second call", function () {
                expect(stubbedUlid(SEED_TIME)).to.equal("01ARYZ6S41YYYYYYYYYYYYYYYZ");
            });

            it("third call", function () {
                expect(stubbedUlid(SEED_TIME)).to.equal("01ARYZ6S41YYYYYYYYYYYYYYZ0");
            });

            it("fourth call", function () {
                expect(stubbedUlid(SEED_TIME)).to.equal("01ARYZ6S41YYYYYYYYYYYYYYZ1");
            });
        });

        describe("with specific seedTime", function () {
            const stubbedUlid: ULIDFactory = monotonicFactory(stubbedPrng);

            it("first call", function () {
                expect(stubbedUlid(1469918176385)).to.equal("01ARYZ6S41YYYYYYYYYYYYYYYY");
            });

            it("second call with the same", function () {
                expect(stubbedUlid(1469918176385)).to.equal("01ARYZ6S41YYYYYYYYYYYYYYYZ");
            });

            it("third call with less than", function () {
                expect(stubbedUlid(100000000)).to.equal("01ARYZ6S41YYYYYYYYYYYYYYZ0");
            });

            it("fourth call with even more less than", function () {
                expect(stubbedUlid(10000)).to.equal("01ARYZ6S41YYYYYYYYYYYYYYZ1");
            });

            it("fifth call with 1 greater than", function () {
                expect(stubbedUlid(1469918176386)).to.equal("01ARYZ6S42YYYYYYYYYYYYYYYY");
            });
        });
    });
});

describe("ulid", () => {
    it("generates a ULID", () => {
        const id = ulid();
        expect(id).toMatch(ULID_REXP);
    });
});

describe("isValid", () => {
    it("accepts a generated ULID, in either case", () => {
        const id = ulid();
        expect(isValid(id)).toBe(true);
        expect(isValid(id.toLowerCase())).toBe(true);
    });

    it("rejects non-strings, the wrong length and out-of-alphabet characters", () => {
        expect(isValid("")).toBe(false);
        expect(isValid("0".repeat(25))).toBe(false);
        expect(isValid("0I" + "0".repeat(24))).toBe(false); // I is not in Crockford base32
    });

    it("rejects a timestamp larger than the 48-bit maximum", () => {
        // The largest valid ULID is 7ZZ…; a leading character above 7 overflows
        // the 48-bit timestamp, which decodeTime rejects — so isValid must too.
        expect(isValid("8" + "0".repeat(25))).toBe(false);
        expect(isValid("Z".repeat(26))).toBe(false);
    });

    it("agrees with decodeTime", () => {
        const ids = ["7" + "Z".repeat(25), "8" + "0".repeat(25), "Z".repeat(26)];
        for (const id of ids) {
            let decodes = true;
            try {
                decodeTime(id);
            } catch {
                decodes = false;
            }
            expect(isValid(id)).toBe(decodes);
        }
    });
});
