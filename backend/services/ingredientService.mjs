import { resolveIngredient } from '../repositories/ingredientRepository.mjs';

export async function resolveIngredientQuery(query) {
  return resolveIngredient(query);
}
