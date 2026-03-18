import { createLocalRepository } from "./createLocalRepository";
import { createSupabaseRepository } from "./createSupabaseRepository";

export function createRepository(source) {
  if (source === "supabase") {
    return createSupabaseRepository();
  }

  return createLocalRepository();
}