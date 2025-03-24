import { describe, expect, it } from "vitest";
import { monotonicFactory, ulid, ULIDFactory } from "../../";

const ULID_REXP = /^[0-7][0-9a-hjkmnp-tv-zA-HJKMNP-TV-Z]{25}$/;

describe("monotonicFactory", () => {
    function stubbedPrng() {
        return 0.96
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

        describe("during single point in time", function() {
            const SEED_TIME = 1469918176385;
            const stubbedUlid: ULIDFactory = monotonicFactory(stubbedPrng);

            it("first call", function() {
                expect(stubbedUlid(SEED_TIME)).to.equal("01ARYZ6S41YYYYYYYYYYYYYYYY");
            })

            it("second call", function() {
                expect(stubbedUlid(SEED_TIME)).to.equal("01ARYZ6S41YYYYYYYYYYYYYYYZ");
            })

            it("third call", function() {
                expect(stubbedUlid(SEED_TIME)).to.equal("01ARYZ6S41YYYYYYYYYYYYYYZ0");
            })

            it("fourth call", function() {
                expect(stubbedUlid(SEED_TIME)).to.equal("01ARYZ6S41YYYYYYYYYYYYYYZ1");
            })
        })

        describe("with specific seedTime", function() {
            const stubbedUlid: ULIDFactory = monotonicFactory(stubbedPrng);

            it("first call", function() {
                expect(stubbedUlid(1469918176385)).to.equal("01ARYZ6S41YYYYYYYYYYYYYYYY");
            })

            it("second call with the same", function() {
                expect(stubbedUlid(1469918176385)).to.equal("01ARYZ6S41YYYYYYYYYYYYYYYZ");
            })

            it("third call with less than", function() {
                expect(stubbedUlid(100000000)).to.equal("01ARYZ6S41YYYYYYYYYYYYYYZ0");
            })

            it("fourth call with even more less than", function() {
                expect(stubbedUlid(10000)).to.equal("01ARYZ6S41YYYYYYYYYYYYYYZ1");
            })

            it("fifth call with 1 greater than", function() {
                expect(stubbedUlid(1469918176386)).to.equal("01ARYZ6S42YYYYYYYYYYYYYYYY");
            })
        });
    });
});

describe("ulid", () => {
    it("generates a ULID", () => {
        const id = ulid();
        expect(id).toMatch(ULID_REXP);
    });
});
