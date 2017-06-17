interface Ulid {
    prng(): number
    encodeTime(time: number, len: number): string
    encodeRandom(len: number): string
    decodeTime(id: string): number
    (time?: number): string
}

declare var ulid: Ulid
export = ulid
