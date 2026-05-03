import { getMealsFromRepository } from '../repositories/mealRepository.mjs';

export async function getMeals(query) {
  return getMealsFromRepository(query);
}
