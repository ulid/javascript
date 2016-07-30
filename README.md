![ULID](logo.png)

# Universally Unique Lexicographically Sortable Identifier

UUID can be suboptimal for many uses-cases because:

- It isn't the most character efficient way of encoding 128 bits of randomness
- The string format itself is apparently based on the original MAC & time version (UUIDv1 from Wikipedia)
- It provides no other information than randomness

Instead, herein is proposed ULID:

- 128-bit compatibility with UUID
- 1.21e+24 unique ULIDs per millisecond
- Canonically encoded as a 26 character string (all caps), as opposed to the 36 character UUID
- Uses Crockford's base32 for length efficiency and readability (5 bits per character or 5 characters per octet)
- Encodes the current UNIX-time in milliseconds for lexicographic sorting
- Case insensitive
- No special characters (URL safe)

## Components

**Timestamp**
- 48 bit integer
- UNIX-time in milliseconds
- Won't run out of space till the year 10895 AD.

**Randomness**
- 80 bits
- Cryptographically secure source of randomness, if possible

## Binary Layout and Byte Order

The components are encoded as 16 octets. Each component is encoded with the Most Significant Byte first (network byte order).

```
0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                      32_bit_uint_time_low                     |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|     16_bit_uint_time_high     |       16_bit_uint_random      |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                       32_bit_uint_random                      |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                       32_bit_uint_random                      |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

## String Representation

```
vttttttttttrrrrrrrrrrrrrrrrr

where
v is the current version number
t is the current epoch time (in milliseconds)
r is 10 bytes of randomness
```

## Sorting

The left-most character must be sorted first, and the right-most character sorted last. The default ASCII order is used for sorting.

## Example

```
   1       01AN4Z07BY      79KA1307SR9X4MV3A

  |-|     |----------|    |-----------------|
version    epoch time         randomness
1 char      10 chars           15 chars
3 bits       50bits             75bits
 int         base32             base32
```
