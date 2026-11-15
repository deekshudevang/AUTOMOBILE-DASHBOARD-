/**
 * Jenkins One-At-A-Time (joaat) 32-bit unsigned hashing algorithm.
 * Used by GTA V and Cherax Entity formats for entity model identifiers.
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
  return hash >>> 0;
}

/**
 * Format 32-bit integer as hex string (e.g. 0x10635A0E)
 */
export function toHex32(num: number): string {
  return '0x' + (num >>> 0).toString(16).toUpperCase().padStart(8, '0');
}

