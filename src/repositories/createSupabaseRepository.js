import { createInitialDb } from "../data/initialDb";

export function createSupabaseRepository() {
  return {
    name: "Supabase",
    mode: "supabase",

    async load() {
      throw new Error("Adapter Supabase ainda não conectado neste protótipo.");
    },

    async save(db) {
      return db;
    },

    async reset() {
      return createInitialDb();
    },
  };
}