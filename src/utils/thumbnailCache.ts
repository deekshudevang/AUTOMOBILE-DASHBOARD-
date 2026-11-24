/**
 * AUTOVERSE — Persistent Vehicle Build WebP Thumbnail Cache
 * Uses IndexedDB (with localStorage fallback) to store lightweight WebP preview
 * thumbnails (400x225) of saved vehicle configurations.
 */

const DB_NAME = 'autoverse_thumbnails_db';
const STORE_NAME = 'thumbnails';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;
const memoryCache = new Map<string, string>();

function getDb(): Promise<IDBDatabase> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.reject(new Error('IndexedDB not supported in this environment'));
  }

  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = window.indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'buildId' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  return dbPromise;
}

export async function saveBuildThumbnail(buildId: string, dataUrl: string): Promise<void> {
  memoryCache.set(buildId, dataUrl);
  try {
    const db = await getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put({ buildId, dataUrl, updatedAt: Date.now() });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Fallback to localStorage
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(`thumb_${buildId}`, dataUrl);
      }
    } catch {
      // Ignore quota error
    }
  }
}

export async function getBuildThumbnail(buildId: string): Promise<string | null> {
  try {
    const db = await getDb();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(buildId);
      req.onsuccess = () => {
        resolve(req.result ? req.result.dataUrl : (memoryCache.get(buildId) ?? null));
      };
      req.onerror = () => resolve(memoryCache.get(buildId) ?? null);
    });
  } catch {
    // Fallback to localStorage or memoryCache
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = window.localStorage.getItem(`thumb_${buildId}`);
        if (item) return item;
      }
    } catch {
      // ignore
    }
    return memoryCache.get(buildId) ?? null;
  }
}
