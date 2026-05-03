const INGREDIENT_ALIASES = new Map([
  ['chicken breast', 'chicken'],
  ['chicken breasts', 'chicken'],
  ['chicken thigh', 'chicken'],
  ['chicken thighs', 'chicken'],
  ['minced beef', 'beef'],
  ['ground beef', 'beef'],
  ['penne rigate', 'pasta'],
  ['spaghetti', 'pasta'],
  ['macaroni', 'pasta'],
  ['basmati rice', 'rice'],
  ['long grain rice', 'rice'],
  ['tomatoes', 'tomato_sauce'],
  ['tomato', 'tomato_sauce'],
  ['tomato puree', 'tomato_sauce'],
  ['tomato passata', 'tomato_sauce'],
  ['onions', 'onion'],
  ['red onion', 'onion'],
  ['spring onions', 'onion'],
  ['garlic clove', 'garlic'],
  ['garlic cloves', 'garlic'],
  ['lime', 'lemon'],
  ['limes', 'lemon'],
  ['carrots', 'carrot'],
  ['red peppers', 'bell_pepper'],
  ['green peppers', 'bell_pepper'],
  ['black beans', 'beans'],
  ['kidney beans', 'beans'],
  ['chickpeas', 'beans'],
  ['red pepper', 'bell_pepper'],
  ['green pepper', 'bell_pepper'],
  ['yellow pepper', 'bell_pepper'],
  ['parmesan', 'cheese'],
  ['cheddar cheese', 'cheese'],
  ['mozzarella', 'cheese'],
]);

const KNOWN_INGREDIENTS = new Set([
  'eggs', 'pasta', 'rice', 'cheese', 'tuna', 'bread', 'butter', 'onion',
  'garlic', 'tomato_sauce', 'chicken', 'beans', 'oats', 'milk', 'yogurt',
  'spinach', 'potato', 'olive_oil', 'lemon', 'bell_pepper', 'banana',
  'apple', 'peanut_butter', 'cucumber', 'carrot', 'mushrooms', 'ham',
  'flour', 'tortilla', 'canned_corn', 'peas', 'hummus',
  'avocado',
]);

function normalizeIngredient(value) {
  const clean = String(value || '').trim().toLowerCase();
  if (!clean) return null;
  const aliased = INGREDIENT_ALIASES.get(clean) || clean;
  const id = aliased.replace(/[\s-]+/g, '_').replace(/[^a-z0-9_]/g, '');
  return KNOWN_INGREDIENTS.has(id) ? id : `custom:${id}`;
}

function collectIngredients(apiMeal) {
  const ids = [];
  for (let i = 1; i <= 20; i += 1) {
    const id = normalizeIngredient(apiMeal[`strIngredient${i}`]);
    if (id && !ids.includes(id)) ids.push(id);
  }
  return ids;
}

function estimateTime(apiMeal, ingredientCount) {
  const text = `${apiMeal.strInstructions || ''} ${apiMeal.strMeal || ''}`.toLowerCase();
  if (text.includes('slow') || text.includes('bake') || text.includes('roast')) return 35;
  if (ingredientCount <= 3) return 12;
  if (ingredientCount <= 6) return 20;
  return 30;
}

function estimatePrice(ingredients, category) {
  const costly = new Set(['chicken', 'beef', 'tuna', 'ham']);
  let price = 1.1 + ingredients.length * 0.35;
  price += ingredients.filter((id) => costly.has(id)).length * 1.4;
  if (category === 'Seafood') price += 1.5;
  return Number(Math.min(8.5, Math.max(1.1, price)).toFixed(2));
}

function tagsFor(apiMeal, ingredients, time, price) {
  const tags = [];
  const text = `${apiMeal.strMeal || ''} ${apiMeal.strCategory || ''}`.toLowerCase();
  const hasProtein = ingredients.some((id) => ['chicken', 'tuna', 'eggs', 'beans', 'yogurt', 'ham'].includes(id));
  if (price <= 2.5) tags.push('budget');
  if (time <= 15) tags.push('lazy');
  if (hasProtein || text.includes('chicken') || text.includes('protein')) tags.push('fitness');
  if (price <= 4.5) tags.push('student');
  return tags.length ? [...new Set(tags)] : ['student'];
}

function firstSteps(instructions) {
  return String(instructions || '')
    .split(/\r?\n|(?<=\.)\s+/)
    .map((step) => step.trim())
    .filter(Boolean)
    .slice(0, 3);
}

export function mapTheMealDbMeal(apiMeal) {
  const ingredients = collectIngredients(apiMeal).slice(0, 5);
  if (!apiMeal?.idMeal || !apiMeal?.strMeal || ingredients.length === 0) return null;

  const time = estimateTime(apiMeal, ingredients.length);
  const price = estimatePrice(ingredients, apiMeal.strCategory);

  return {
    id: `mealdb_${apiMeal.idMeal}`,
    externalId: apiMeal.idMeal,
    source: 'themealdb',
    name: apiMeal.strMeal,
    emoji: ingredients.includes('chicken') ? '🍗' : ingredients.includes('pasta') ? '🍝' : ingredients.includes('rice') ? '🍚' : '🍽️',
    image: apiMeal.strMealThumb || null,
    ingredients,
    optional: collectIngredients(apiMeal).slice(5, 9),
    time,
    price,
    protein: tagsFor(apiMeal, ingredients, time, price).includes('fitness') ? 'high' : 'medium',
    tags: tagsFor(apiMeal, ingredients, time, price),
    why: apiMeal.strArea ? `${apiMeal.strArea} recipe, mapped into your pantry.` : 'External recipe, mapped into your pantry.',
    steps: firstSteps(apiMeal.strInstructions),
    bgTone: 'oklch(0.93 0.05 100)',
  };
}
