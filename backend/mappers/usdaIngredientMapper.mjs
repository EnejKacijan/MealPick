const CATEGORY_RULES = [
  { category: 'protein', words: ['salmon', 'beef', 'pork', 'turkey', 'fish', 'tofu', 'shrimp', 'cod', 'egg', 'meat', 'sausage', 'lentil'] },
  { category: 'carb', words: ['quinoa', 'couscous', 'noodle', 'barley', 'cereal', 'rice', 'pasta', 'bread', 'potato', 'flour', 'grain'] },
  { category: 'vegetable', words: ['zucchini', 'broccoli', 'cauliflower', 'eggplant', 'lettuce', 'kale', 'pepper', 'carrot', 'cabbage', 'celery', 'cucumber', 'vegetable'] },
  { category: 'fruit', words: ['mango', 'berries', 'strawberry', 'blueberry', 'orange', 'pear', 'pineapple', 'banana', 'apple', 'fruit', 'grape'] },
  { category: 'fat', words: ['avocado', 'nuts', 'almond', 'walnut', 'peanut', 'coconut', 'oil', 'butter', 'cream'] },
  { category: 'sauce', words: ['salsa', 'pesto', 'mayonnaise', 'mustard', 'sauce', 'dressing', 'ketchup'] },
];

const FALLBACK_INGREDIENTS = {
  salmon: { category: 'protein', kcal: 208, protein: 20, cost: 3.2 },
  tofu: { category: 'protein', kcal: 144, protein: 17, cost: 1.6 },
  beef: { category: 'protein', kcal: 250, protein: 26, cost: 2.8 },
  zucchini: { category: 'vegetable', kcal: 17, protein: 1.2, cost: 0.6 },
  broccoli: { category: 'vegetable', kcal: 35, protein: 2.4, cost: 0.8 },
  quinoa: { category: 'carb', kcal: 368, protein: 14, cost: 0.9 },
  mango: { category: 'fruit', kcal: 60, protein: 0.8, cost: 0.9 },
  pineapple: { category: 'fruit', kcal: 50, protein: 0.5, cost: 0.8 },
  coconut: { category: 'fat', kcal: 354, protein: 3.3, cost: 0.9 },
  salsa: { category: 'sauce', kcal: 36, protein: 1.5, cost: 0.5 },
};

export function normalizeIngredientQuery(query) {
  return String(query || '').trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
}

function nutrient(food, nutrientName) {
  const found = (food.foodNutrients || []).find((item) =>
    String(item.nutrientName || '').toLowerCase().includes(nutrientName)
  );
  return Number(found?.value || 0);
}

function categoryFor(query, description = '') {
  const text = `${query} ${description}`.toLowerCase();
  for (const rule of CATEGORY_RULES) {
    if (rule.words.some((word) => text.includes(word))) return rule.category;
  }
  return 'other';
}

function categoryFromMacros(kcal, protein) {
  if (protein >= 12) return 'protein';
  if (kcal >= 250 && protein < 8) return 'carb';
  if (kcal >= 180 && protein < 12) return 'fat';
  if (kcal <= 80) return 'vegetable';
  return 'other';
}

export function mapUsdaFoodToIngredient(query, food) {
  const idName = normalizeIngredientQuery(query);
  if (!food) {
    const fallback = FALLBACK_INGREDIENTS[idName] || {};
    return {
      id: `custom:${idName}`,
      name: query.trim().toLowerCase(),
      source: fallback.category ? 'fallback' : 'custom',
      fdcId: null,
      category: fallback.category || categoryFor(query),
      kcal: fallback.kcal || 80,
      protein: fallback.protein || 2,
      cost: fallback.cost || 0.75,
    };
  }

  const kcal = Math.round(nutrient(food, 'energy') || 80);
  const protein = Number((nutrient(food, 'protein') || 2).toFixed(1));
  const textCategory = categoryFor(query, food.description);
  return {
    id: `custom:${idName}`,
    name: query.trim().toLowerCase(),
    source: 'usda',
    fdcId: food.fdcId,
    description: food.description,
    category: textCategory === 'other' ? categoryFromMacros(kcal, protein) : textCategory,
    kcal,
    protein,
    cost: FALLBACK_INGREDIENTS[idName]?.cost || 0.75,
  };
}
