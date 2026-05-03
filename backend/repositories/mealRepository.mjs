import { fetchFromLocalDatabase } from './localMealSource.mjs';
import { fetchFromTheMealDb } from './theMealDbSource.mjs';

const DATA_SOURCE = process.env.MEAL_SOURCE || 'hybrid';

function mergeMeals(localMeals, apiMeals) {
  const byId = new Map();
  for (const meal of [...localMeals, ...apiMeals]) byId.set(meal.id, meal);
  return [...byId.values()];
}

export async function getMealsFromRepository(query = {}) {
  if (DATA_SOURCE === 'local') return fetchFromLocalDatabase();
  if (DATA_SOURCE === 'api') return fetchFromTheMealDb(query);

  const localMeals = await fetchFromLocalDatabase();
  if (localMeals.length >= 20) return localMeals;

  try {
    const apiMeals = await fetchFromTheMealDb(query);
    return mergeMeals(localMeals, apiMeals);
  } catch (error) {
    console.warn('[meals] TheMealDB unavailable, using local fallback:', error.message);
    return localMeals;
  }
}
