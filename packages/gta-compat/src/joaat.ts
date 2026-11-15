/**
 * Jenkins One-At-A-Time (joaat) 32-bit hashing implementation.
 * Used by GTA V, FiveM, and Cherax Entity specifications.
 */

export function joaat(key: string): number {
  const normalized = key.toLowerCase();
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash += normalized.charCodeAt(i);
    hash += (hash << 10);
    hash ^= (hash >>> 6);
  }
  hash += (hash << 3);
  hash ^= (hash >>> 11);
  hash += (hash << 15);
  return hash >>> 0; // Return unsigned 32-bit integer
}

/**
 * Normalizes any signed or unsigned hash into a 32-bit unsigned integer.
 */
export function toUnsigned32(hash: number): number {
  return hash >>> 0;
}

/**
 * Normalizes any unsigned hash into a 32-bit signed integer.
 */
export function toSigned32(hash: number): number {
  return hash | 0;
}

/**
 * Formats a 32-bit hash as standard hexadecimal string (e.g. 0xF330CB6A).
 */
export function toHex32(hash: number): string {
  return '0x' + (hash >>> 0).toString(16).toUpperCase().padStart(8, '0');
}

/**
 * Official verified GTA V test vectors for regression testing.
 */
export const VERIFIED_JOAAT_TEST_VECTORS = [
  { name: 'jester3', unsigned: 4080061290, signed: -214906006, hex: '0xF330CB6A' },
  { name: 'cypher', unsigned: 1755697647, signed: 1755697647, hex: '0x68A5D1EF' },
  { name: 'tenf', unsigned: 3400983137, signed: -893984159, hex: '0xCAB6E261' },
  { name: 'italirsx', unsigned: 3145241962, signed: -1149725334, hex: '0xBB78956A' },
  { name: 'deluxo', unsigned: 1483171323, signed: 1483171323, hex: '0x586765FB' },
  { name: 'oppressor2', unsigned: 2069146067, signed: 2069146067, hex: '0x7B54A9D3' },
  { name: 'schlagen', unsigned: 3787471536, signed: -507495760, hex: '0xE1C03AB0' }
];

