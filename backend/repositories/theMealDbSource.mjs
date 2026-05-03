import { mapTheMealDbMeal } from '../mappers/theMealDbMapper.mjs';

const API_KEY = process.env.THEMEALDB_API_KEY || '1';
const BASE_URL = `https://www.themealdb.com/api/json/v1/${API_KEY}`;
const CACHE_MS = 1000 * 60 * 30;
const cache = new Map();

async function getJson(url) {
  const hit = cache.get(url);
  if (hit && Date.now() - hit.time < CACHE_MS) return hit.data;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`TheMealDB request failed: ${response.status}`);
  const data = await response.json();
  cache.set(url, { time: Date.now(), data });
  return data;
}

async function lookupMeal(id) {
  const data = await getJson(`${BASE_URL}/lookup.php?i=${encodeURIComponent(id)}`);
  return data.meals?.[0] || null;
}

async function mealsByIngredient(ingredient) {
  const data = await getJson(`${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`);
  const meals = (data.meals || []).slice(0, 4);
  const detailed = await Promise.all(meals.map((meal) => lookupMeal(meal.idMeal)));
  return detailed.filter(Boolean);
}

async function mealsByLetter(letter) {
  const data = await getJson(`${BASE_URL}/search.php?f=${encodeURIComponent(letter)}`);
  return (data.meals || []).slice(0, 8);
}

export async function fetchFromTheMealDb({ ingredients = [] } = {}) {
  const normalized = ingredients
    .map((id) => String(id).replace('tomato_sauce', 'tomato').replace('bell_pepper', 'pepper'))
    .filter((id) => id && !id.startsWith('custom:'))
    .slice(0, 4);

  const rawMeals = normalized.length
    ? (await Promise.all(normalized.map(mealsByIngredient))).flat()
    : (await Promise.all(['a', 'b', 'c', 'p'].map(mealsByLetter))).flat();

  const byId = new Map();
  for (const meal of rawMeals) byId.set(meal.idMeal, meal);

  return [...byId.values()]
    .map(mapTheMealDbMeal)
    .filter(Boolean)
    .slice(0, 40);
}
