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
- UUID v1/v2 is impractical in many environments, as it requires access to a unique, stable MAC address
- UUID v3/v5 requires a unique seed and produces randomly distributed IDs, which can cause fragmentation in many data structures
- UUID v4 provides no other information than randomness which can cause fragmentation in many data structures

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

// You can also input a seed time which will consistently give you the same time component
// This is useful for migrating to ulid
ulid(1469918176385) // 01ARYZ6S41TSV4RRFFQ69G5FAV
```

## Implementations in other languages

From the community!

| Language | Author | Binary Implementation |
| -------- | ------ | --------------------- |
| [C++](https://github.com/suyash/ulid) | [suyash](https://github.com/suyash) | ✓ |
| [Objective-C](https://github.com/whitesmith/ulid) | [ricardopereira](https://github.com/ricardopereira) |
| [Crystal](https://github.com/SuperPaintman/ulid) | [SuperPaintman](https://github.com/SuperPaintman) |
| [Dart](https://github.com/agilord/ulid) | [isoos](https://github.com/isoos) | ✓ |
| [Delphi](https://github.com/martinusso/ulid) | [matinusso](https://github.com/martinusso) |
| [D](https://github.com/enckse/ulid) | [enckse](https://github.com/enckse) |
| [Erlang](https://github.com/savonarola/ulid) | [savonarola](https://github.com/savonarola) |
| [Elixir](https://github.com/merongivian/ulid) | [merongivian](https://github.com/merongivian) |
| [Go](https://github.com/imdario/go-ulid) | [imdario](https://github.com/imdario/) |
| [Go](https://github.com/oklog/ulid) | [oklog](https://github.com/oklog) | ✓ |
| [Haskell](https://github.com/steven777400/ulid) | [steven777400](https://github.com/steven777400) | ✓ |
| [Java](https://github.com/huxi/sulky/tree/master/sulky-ulid) | [huxi](https://github.com/huxi) | ✓ |
| [Java](https://github.com/azam/ulidj) | [azam](https://github.com/azam) |
| [Java](https://github.com/Lewiscowles1986/jULID) | [Lewiscowles1986](https://github.com/Lewiscowles1986) |
| [Julia](https://github.com/ararslan/ULID.jl) | [ararslan](https://github.com/ararslan) |
| [Lua](https://github.com/Tieske/ulid.lua) | [Tieske](https://github.com/Tieske) |
| [.NET](https://github.com/RobThree/NUlid) | [RobThree](https://github.com/RobThree) | ✓ |
| [.NET](https://github.com/fvilers/ulid.net) | [fvilers](https://github.com/fvilers)
| [Nim](https://github.com/adelq/ulid) | [adelq](https://github.com/adelq)
| [Perl 5](https://github.com/bk/Data-ULID) | [bk](https://github.com/bk) | ✓ |
| [PHP](https://github.com/Lewiscowles1986/ulid) | [Lewiscowles1986](https://github.com/Lewiscowles1986) |
| [PowerShell](https://github.com/PetterBomban/posh-ulid) | [PetterBomban](https://github.com/PetterBomban) |
| [Python](https://github.com/mdipierro/ulid) | [mdipierro](https://github.com/mdipierro) |
| [Python](https://github.com/ahawker/ulid) | [ahawker](https://github.com/ahawker) | ✓ |
| [Ruby](https://github.com/rafaelsales/ulid) | [rafaelsales](https://github.com/rafaelsales) |
| [Rust](https://github.com/mmacedoeu/rulid.rs) | [mmacedoeu](https://github.com/mmacedoeu/rulid.rs) | ✓ |
| [Rust](https://github.com/dylanhart/ulid-rs) | [dylanhart](https://github.com/dylanhart) | ✓ |
| [SQL-Microsoft](https://github.com/rmalayter/ulid-mssql) | [rmalayter](https://github.com/rmalayter) | ✓ |
| [Swift](https://github.com/simonwhitehouse/ULIDSwift) | [simonwhitehouse](https://github.com/simonwhitehouse) |
| [Tcl](https://tcl.wiki/48827) | [dbohdan](https://github.com/dbohdan) |

## Specification

Below is the current specification of ULID as implemented in this repository.

*Note: the binary format has not been implemented.*

```
 01AN4Z07BY      79KA1307SR9X4MV3

|----------|    |----------------|
 Timestamp          Randomness
   48bits             80bits
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
