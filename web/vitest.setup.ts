import "@testing-library/jest-dom/vitest";

// jsdom's localStorage is unreliable across Node/jsdom versions here
// (Node's experimental global can shadow it without a full Storage API).
// Provide a deterministic in-memory implementation for tests.
class MemoryStorage implements Storage {
  #store = new Map<string, string>();
  get length() {
    return this.#store.size;
  }
  clear() {
    this.#store.clear();
  }
  getItem(key: string) {
    return this.#store.has(key) ? this.#store.get(key)! : null;
  }
  key(index: number) {
    return [...this.#store.keys()][index] ?? null;
  }
  removeItem(key: string) {
    this.#store.delete(key);
  }
  setItem(key: string, value: string) {
    this.#store.set(key, String(value));
  }
}

Object.defineProperty(globalThis, "localStorage", {
  value: new MemoryStorage(),
  configurable: true,
  writable: true,
});
