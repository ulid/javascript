<h1 align="center">
	<br>
	<br>
	<img width="360" src="logo.png" alt="ulid">
	<br>
	<br>
	<br>
</h1>

[![Build Status](https://travis-ci.org/alizain/ulid.svg?branch=master)](https://travis-ci.org/alizain/ulid) [![codecov](https://codecov.io/gh/alizain/ulid/branch/master/graph/badge.svg)](https://codecov.io/gh/alizain/ulid)

# Universally Unique Lexicographically Sortable Identifier

UUID can be suboptimal for many uses-cases because:

- It isn't the most character efficient way of encoding 128 bits of randomness
- The string format itself is apparently based on the original MAC & time version (UUIDv1 from Wikipedia)
- It provides no other information than randomness

Instead, herein is proposed ULID:

- 128-bit compatibility with UUID
- 1.21e+24 unique ULIDs per millisecond
- Lexicographically sortable!
- Canonically encoded as a 26 character string, as opposed to the 36 character UUID
- Uses Crockford's base32 for better efficiency and readability (5 bits per character)
- Case insensitive
- No special characters (URL safe)

## JavaScript

### Installation

```
npm install --save ulid
```

### Usage

```javascript
import ulid from 'ulid'

ulid() // 01ARZ3NDEKTSV4RRFFQ69G5FAV
```

## Implementations in other languages

From the community!

| Language | Author | Binary Implementation |
| -------- | ------ | --------------------- |
| [Crystal](https://github.com/SuperPaintman/ulid) | [SuperPaintman](https://github.com/SuperPaintman) |
| [Erlang](https://github.com/savonarola/ulid) | [savonarola](https://github.com/savonarola) |
| [Elixir](https://github.com/merongivian/ulid) | [merongivian](https://github.com/merongivian) |
| [Go](https://github.com/imdario/go-ulid) | [imdario](https://github.com/imdario/) |
| [Go](https://github.com/oklog/ulid) | [oklog](https://github.com/oklog) | ✓ |
| [Java](https://github.com/huxi/sulky/tree/master/sulky-ulid) | [huxi](https://github.com/huxi) | ✓ |
| [Java](https://github.com/Lewiscowles1986/jULID) | [Lewiscowles1986](https://github.com/Lewiscowles1986) |
| [Julia](https://github.com/ararslan/ULID.jl) | [ararslan](https://github.com/ararslan) |
| [.NET](https://github.com/RobThree/NUlid) | [RobThree](https://github.com/RobThree)
| [.NET](https://github.com/fvilers/ulid.net) | [fvilers](https://github.com/fvilers)
| [PHP](https://github.com/Lewiscowles1986/ulid) | [Lewiscowles1986](https://github.com/Lewiscowles1986) |
| [Python](https://github.com/mdipierro/ulid) | [mdipierro](https://github.com/mdipierro) |
| [Ruby](https://github.com/rafaelsales/ulid) | [rafaelsales](https://github.com/rafaelsales) |
| [Rust](https://github.com/mmacedoeu/rulid.rs) | [mmacedoeu](https://github.com/mmacedoeu/rulid.rs) |

## Specification

Below is the current specification of ULID as implemented in this repository. *Note: the binary format has not been implemented.*

```
 01AN4Z07BY      79KA1307SR9X4MV3

|----------|    |----------------|
 Timestamp          Randomness
  10 chars           16 chars
   48bits             80bits
   base32             base32
```

### Components

**Timestamp**
- 48 bit integer
- UNIX-time in milliseconds
- Won't run out of space till the year 10895 AD.

**Randomness**
- 80 bits
- Cryptographically secure source of randomness, if possible

### Sorting

The left-most character must be sorted first, and the right-most character sorted last (lexical order). The default ASCII character set must be used. Within the same millisecond, sort order is not guaranteed

### Encoding

Crockford's Base32 is used as shown. This alphabet excludes the letters I, L, O, and U to avoid confusion and abuse.

```
0123456789ABCDEFGHJKMNPQRSTVWXYZ
```

### Binary Layout and Byte Order

The components are encoded as 16 octets. Each component is encoded with the Most Significant Byte first (network byte order).

```
0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                      32_bit_uint_time_high                    |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|     16_bit_uint_time_low      |       16_bit_uint_random      |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                       32_bit_uint_random                      |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                       32_bit_uint_random                      |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

### String Representation

```
ttttttttttrrrrrrrrrrrrrrrr

where
t is Timestamp
r is Randomness
```

## Prior Art

Partly inspired by:
- http://instagram-engineering.tumblr.com/post/10853187575/sharding-ids-at-instagram
- https://firebase.googleblog.com/2015/02/the-2120-ways-to-ensure-unique_68.html


## Test Suite

```
npm test
```

## Performance

```
npm run perf
```

```
ulid
336,331,131 op/s » encodeTime
102,041,736 op/s » encodeRandom
17,408 op/s » generate


Suites:  1
Benches: 3
Elapsed: 7,285.75 ms
```
