import { DB_KEY } from "../data/constants";
import { createInitialDb } from "../data/initialDb";

function localLoadDb() {
  if (typeof window === "undefined") return createInitialDb();

  try {
    const raw = window.localStorage.getItem(DB_KEY);
    if (!raw) return createInitialDb();
    return JSON.parse(raw);
  } catch {
    return createInitialDb();
  }
}

function localSaveDb(db) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export function createLocalRepository() {
  return {
    name: "Local Storage",
    mode: "local",

    async load() {
      return localLoadDb();
    },

    async save(db) {
      localSaveDb(db);
      return db;
    },

    async reset() {
      const fresh = createInitialDb();
      localSaveDb(fresh);
      return fresh;
    },
  };
}