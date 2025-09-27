// src/lib/details/cache.ts
export const mapCache = <K, V>() => {
  const m = new Map<K, V>();
  return {
    get: (k: K) => m.get(k),
    set: (k: K, v: V) => (m.set(k, v), v),
    has: (k: K) => m.has(k),
    clear: () => m.clear()
  };
};
