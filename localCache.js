const store = new Map();

function set(key, value, ttlMs) {
  const expiry = Date.now() + ttlMs;
  store.set(key, { value, expiry });
}

function get(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (entry.expiry < Date.now()) {
    store.delete(key);
    return null;
  }
  return entry.value;
}

function del(key) {
  store.delete(key);
}

function debugAll() {
  return Object.fromEntries(store.entries());
}

module.exports = { set, get, del, debugAll };
