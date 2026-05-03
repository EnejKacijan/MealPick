// MealPick — meal database, pantry defaults, modes, helpers
// Plain data + small pure helpers. No React.

const MODES = [
  {
    id: 'student',
    name: 'Student',
    blurb: 'cheap & filling',
    icon: '◆',
    color: 'oklch(0.85 0.13 90)',  // citrus
  },
  {
    id: 'fitness',
    name: 'Fitness',
    blurb: 'high protein',
    icon: '▲',
    color: 'oklch(0.72 0.14 145)', // herb green
  },
  {
    id: 'lazy',
    name: 'Lazy Day',
    blurb: 'minimal effort',
    icon: '●',
    color: 'oklch(0.78 0.10 60)',  // peach
  },
  {
    id: 'budget',
    name: 'Budget',
    blurb: 'cheapest possible',
    icon: '■',
    color: 'oklch(0.80 0.09 30)',  // terracotta-ish
  },
];

const FOOD_GOALS = [
  { id: 'save_money', name: 'Save money', blurb: 'cheaper total meals', icon: '€' },
  { id: 'more_protein', name: 'More protein', blurb: 'higher protein picks', icon: 'P' },
  { id: 'use_pantry', name: 'Use pantry first', blurb: 'buy less, use what you have', icon: '✓' },
  { id: 'eat_fast', name: 'Eat fast', blurb: 'quick meals win', icon: '⏱' },
  { id: 'eat_lighter', name: 'Eat lighter', blurb: 'lower kcal picks', icon: 'L' },
];

const PANTRY_DEFAULTS = [
  { id: 'eggs', name: 'eggs', emoji: '🥚', category: 'fridge' },
  { id: 'pasta', name: 'pasta', emoji: '🍝', category: 'cupboard' },
  { id: 'rice', name: 'rice', emoji: '🍚', category: 'cupboard' },
  { id: 'cheese', name: 'cheese', emoji: '🧀', category: 'fridge' },
  { id: 'tuna', name: 'tuna', emoji: '🐟', category: 'cupboard' },
  { id: 'bread', name: 'bread', emoji: '🍞', category: 'cupboard' },
  { id: 'butter', name: 'butter', emoji: '🧈', category: 'fridge' },
  { id: 'onion', name: 'onion', emoji: '🧅', category: 'cupboard' },
  { id: 'garlic', name: 'garlic', emoji: '🧄', category: 'cupboard' },
  { id: 'tomato_sauce', name: 'tomato sauce', emoji: '🥫', category: 'cupboard' },
  { id: 'chicken', name: 'chicken', emoji: '🍗', category: 'fridge' },
  { id: 'beans', name: 'beans', emoji: '🫘', category: 'cupboard' },
  { id: 'oats', name: 'oats', emoji: '🥣', category: 'cupboard' },
  { id: 'milk', name: 'milk', emoji: '🥛', category: 'fridge' },
  { id: 'yogurt', name: 'yogurt', emoji: '🍶', category: 'fridge' },
  { id: 'spinach', name: 'spinach', emoji: '🥬', category: 'fridge' },
  { id: 'potato', name: 'potato', emoji: '🥔', category: 'cupboard' },
  { id: 'olive_oil', name: 'olive oil', emoji: '🫒', category: 'cupboard' },
  { id: 'lemon', name: 'lemon', emoji: '🍋', category: 'fridge' },
  { id: 'bell_pepper', name: 'bell pepper', emoji: '🫑', category: 'fridge' },
  { id: 'banana', name: 'banana', emoji: '🍌', category: 'cupboard' },
  { id: 'apple', name: 'apple', emoji: '🍎', category: 'fridge' },
  { id: 'peanut_butter', name: 'peanut butter', emoji: '🥜', category: 'cupboard' },
  { id: 'cucumber', name: 'cucumber', emoji: '🥒', category: 'fridge' },
  { id: 'carrot', name: 'carrot', emoji: '🥕', category: 'fridge' },
  { id: 'mushrooms', name: 'mushrooms', emoji: '🍄', category: 'fridge' },
  { id: 'ham', name: 'ham', emoji: '🥓', category: 'fridge' },
  { id: 'flour', name: 'flour', emoji: '🌾', category: 'cupboard' },
  { id: 'tortilla', name: 'tortilla', emoji: '🌯', category: 'cupboard' },
  { id: 'canned_corn', name: 'corn', emoji: '🌽', category: 'cupboard' },
  { id: 'peas', name: 'peas', emoji: '🟢', category: 'cupboard' },
  { id: 'hummus', name: 'hummus', emoji: '🧆', category: 'fridge' },
  { id: 'avocado', name: 'avocado', emoji: '🥑', category: 'fridge' },
];

const PANTRY_INDEX = Object.fromEntries(PANTRY_DEFAULTS.map((i) => [i.id, i]));
const CUSTOM_INGREDIENT_ALIASES = {
  tomato: 'tomato_sauce',
  tomatoes: 'tomato_sauce',
  sauce: 'tomato_sauce',
  noodles: 'pasta',
  spaghetti: 'pasta',
  macaroni: 'pasta',
  egg: 'eggs',
  canned_tuna: 'tuna',
  fish: 'tuna',
  toast: 'bread',
  loaf: 'bread',
  mozzarella: 'cheese',
  cheddar: 'cheese',
  parmesan: 'cheese',
  oil: 'olive_oil',
  pepper: 'bell_pepper',
  peppers: 'bell_pepper',
  salad: 'spinach',
  lettuce: 'spinach',
  greens: 'spinach',
  cucumber: 'cucumber',
  cucumbers: 'cucumber',
  mushroom: 'mushrooms',
  corn: 'canned_corn',
  sweetcorn: 'canned_corn',
  chickpeas: 'beans',
  kidney_beans: 'beans',
  black_beans: 'beans',
  ham: 'chicken',
  turkey: 'chicken',
  meat: 'chicken',
  pb: 'peanut_butter',
  peanut: 'peanut_butter',
  bananas: 'banana',
  apples: 'apple',
  wrap: 'tortilla',
  wraps: 'tortilla',
  avocados: 'avocado',
  avo: 'avocado',
};

function normalizeIngredientName(name) {
  return String(name || '').trim().toLowerCase().replace(/\s+/g, '_');
}

function resolveIngredientId(id) {
  if (!id?.startsWith('custom:')) return id;
  const raw = normalizeIngredientName(id.slice(7));
  return PANTRY_INDEX[raw] ? raw : (CUSTOM_INGREDIENT_ALIASES[raw] || id);
}

function getPantryItem(id) {
  if (PANTRY_INDEX[id]) return PANTRY_INDEX[id];
  if (id?.startsWith('custom:')) {
    return { id, name: id.slice(7), emoji: '+', category: 'custom' };
  }
  return { id, name: String(id || '').replaceAll('_', ' '), emoji: '·', category: 'custom' };
}

function resolvedFact(id, resolvedIngredients = {}) {
  const item = resolvedIngredients[id];
  if (!item) return null;
  return {
    kcal: item.kcal || 80,
    protein: item.protein || 2,
    cost: item.cost || 0.75,
    unit: item.name || id.replace('custom:', ''),
  };
}

// Nutrition/cost estimates are ingredient-level, modeled after USDA FoodData
// Central style data. In production, these should be refreshed from FDC by ID.
const INGREDIENT_FACTS = {
  eggs: { kcal: 143, protein: 12.6, cost: 0.55, unit: '2 eggs' },
  pasta: { kcal: 371, protein: 13, cost: 0.55, unit: '100g dry' },
  rice: { kcal: 360, protein: 7, cost: 0.35, unit: '100g dry' },
  cheese: { kcal: 200, protein: 12.5, cost: 0.75, unit: '50g' },
  tuna: { kcal: 132, protein: 29, cost: 1.35, unit: '1 can' },
  bread: { kcal: 265, protein: 9, cost: 0.35, unit: '2 slices' },
  butter: { kcal: 72, protein: 0.1, cost: 0.20, unit: '10g' },
  onion: { kcal: 40, protein: 1.1, cost: 0.20, unit: '1/2 onion' },
  garlic: { kcal: 149, protein: 6.4, cost: 0.08, unit: '1 clove' },
  tomato_sauce: { kcal: 44, protein: 2, cost: 0.55, unit: '150g' },
  chicken: { kcal: 248, protein: 46, cost: 2.30, unit: '150g' },
  beans: { kcal: 160, protein: 10, cost: 0.70, unit: '1/2 can' },
  oats: { kcal: 233, protein: 10, cost: 0.30, unit: '60g' },
  milk: { kcal: 61, protein: 3.2, cost: 0.25, unit: '200ml' },
  yogurt: { kcal: 61, protein: 10, cost: 0.70, unit: '170g' },
  spinach: { kcal: 23, protein: 2.9, cost: 0.70, unit: 'handful' },
  potato: { kcal: 230, protein: 6, cost: 0.35, unit: '1 large' },
  olive_oil: { kcal: 119, protein: 0, cost: 0.20, unit: '1 tbsp' },
  lemon: { kcal: 29, protein: 1.1, cost: 0.35, unit: '1/2 lemon' },
  bell_pepper: { kcal: 31, protein: 1, cost: 0.65, unit: '1 pepper' },
  banana: { kcal: 105, protein: 1.3, cost: 0.30, unit: '1 banana' },
  apple: { kcal: 95, protein: 0.5, cost: 0.35, unit: '1 apple' },
  peanut_butter: { kcal: 190, protein: 8, cost: 0.35, unit: '2 tbsp' },
  cucumber: { kcal: 16, protein: 0.7, cost: 0.45, unit: '1/2 cucumber' },
  carrot: { kcal: 41, protein: 0.9, cost: 0.20, unit: '1 carrot' },
  mushrooms: { kcal: 22, protein: 3.1, cost: 0.75, unit: 'handful' },
  ham: { kcal: 145, protein: 21, cost: 0.90, unit: '80g' },
  flour: { kcal: 364, protein: 10, cost: 0.15, unit: '100g' },
  tortilla: { kcal: 220, protein: 6, cost: 0.45, unit: '1 wrap' },
  canned_corn: { kcal: 96, protein: 3.4, cost: 0.45, unit: '1/2 can' },
  peas: { kcal: 84, protein: 5.4, cost: 0.45, unit: 'handful' },
  hummus: { kcal: 166, protein: 8, cost: 0.80, unit: '100g' },
  avocado: { kcal: 160, protein: 2, cost: 1.20, unit: '1/2 avocado' },
};

function mealNutrition(meal, servings = 1, resolvedIngredients = {}) {
  const ids = meal.ingredients;
  const totals = ids.reduce((sum, id) => {
    const fact = INGREDIENT_FACTS[id] || resolvedFact(id, resolvedIngredients);
    if (!fact) return sum;
    return {
      kcal: sum.kcal + fact.kcal,
      protein: sum.protein + fact.protein,
      estimatedCost: sum.estimatedCost + fact.cost,
    };
  }, { kcal: 0, protein: 0, estimatedCost: 0 });

  return {
    kcal: Math.round(totals.kcal * servings),
    protein: Math.round(totals.protein * servings),
    estimatedCost: Number((totals.estimatedCost * servings).toFixed(2)),
  };
}

// Each meal lists ingredients (required) + optional. Tags drive mode filter.
// `why` is the blunt one-liner. `steps` is the cooking script.
const MEALS = [
  {
    id: 'tuna_pasta',
    name: 'Tuna pasta',
    emoji: '🍝',
    ingredients: ['pasta', 'tuna', 'tomato_sauce'],
    optional: ['cheese', 'garlic'],
    time: 12, price: 2.80, protein: 'medium',
    tags: ['student', 'lazy', 'budget'],
    why: 'Quick. Cheap. Filling.',
    steps: [
      'Boil pasta in salted water (8–10 min).',
      'Drain tuna. Warm tomato sauce in a pan.',
      'Toss everything together. Cheese on top.',
    ],
    bgTone: 'oklch(0.92 0.05 60)',
  },
  {
    id: 'cheese_omelette',
    name: 'Cheese omelette',
    emoji: '🍳',
    ingredients: ['eggs', 'cheese'],
    optional: ['butter', 'bread'],
    time: 8, price: 1.90, protein: 'high',
    tags: ['lazy', 'fitness', 'budget'],
    why: 'Pan to plate in 8 minutes.',
    steps: [
      'Whisk 3 eggs with salt.',
      'Melt butter in pan, pour eggs.',
      'Add cheese, fold, serve.',
    ],
    bgTone: 'oklch(0.93 0.07 90)',
  },
  {
    id: 'cheese_pasta',
    name: 'Cheese pasta',
    emoji: '🧀',
    ingredients: ['pasta', 'cheese'],
    optional: ['butter', 'garlic'],
    time: 10, price: 1.50, protein: 'low',
    tags: ['student', 'lazy', 'budget'],
    why: 'The cheapest hot meal you can make.',
    steps: [
      'Cook pasta. Save a cup of water.',
      'Off heat, add butter + grated cheese.',
      'Loosen with pasta water until creamy.',
    ],
    bgTone: 'oklch(0.93 0.06 80)',
  },
  {
    id: 'fried_rice',
    name: 'Egg fried rice',
    emoji: '🍚',
    ingredients: ['rice', 'eggs'],
    optional: ['onion', 'garlic', 'spinach'],
    time: 12, price: 1.80, protein: 'medium',
    tags: ['student', 'lazy', 'budget'],
    why: 'Empties the fridge. No leftovers.',
    steps: [
      'Heat oil. Scramble eggs, set aside.',
      'Fry onion + garlic, add cold rice.',
      'Toss eggs back in. Salt. Done.',
    ],
    bgTone: 'oklch(0.94 0.05 95)',
  },
  {
    id: 'chicken_rice_bowl',
    name: 'Chicken rice bowl',
    emoji: '🍗',
    ingredients: ['chicken', 'rice'],
    optional: ['spinach', 'lemon', 'garlic'],
    time: 18, price: 4.20, protein: 'high',
    tags: ['fitness'],
    why: 'High protein, low fuss.',
    steps: [
      'Season chicken. Pan-sear 5 min per side.',
      'Cook rice while chicken rests.',
      'Slice chicken on top. Lemon over.',
    ],
    bgTone: 'oklch(0.92 0.06 130)',
  },
  {
    id: 'tuna_toast',
    name: 'Tuna toast',
    emoji: '🥪',
    ingredients: ['bread', 'tuna'],
    optional: ['cheese', 'butter', 'lemon'],
    time: 5, price: 2.10, protein: 'high',
    tags: ['lazy', 'fitness', 'budget'],
    why: 'Five minutes. Zero pans.',
    steps: [
      'Toast bread.',
      'Mix tuna with a squeeze of lemon.',
      'Pile on top. Cheese melts in residual heat.',
    ],
    bgTone: 'oklch(0.93 0.06 70)',
  },
  {
    id: 'beans_on_toast',
    name: 'Beans on toast',
    emoji: '🫘',
    ingredients: ['bread', 'beans'],
    optional: ['cheese', 'butter'],
    time: 6, price: 1.20, protein: 'medium',
    tags: ['student', 'lazy', 'budget'],
    why: 'A pantry meal at its purest.',
    steps: [
      'Warm beans in a pan or microwave.',
      'Toast bread, butter it.',
      'Pour beans on top. Pepper.',
    ],
    bgTone: 'oklch(0.94 0.06 50)',
  },
  {
    id: 'oat_bowl',
    name: 'Protein oat bowl',
    emoji: '🥣',
    ingredients: ['oats', 'milk'],
    optional: ['yogurt', 'lemon'],
    time: 5, price: 1.10, protein: 'high',
    tags: ['fitness', 'lazy', 'budget'],
    why: 'Five-minute fuel. No cooking.',
    steps: [
      'Combine oats + milk.',
      'Microwave 90 seconds.',
      'Top with yogurt.',
    ],
    bgTone: 'oklch(0.94 0.04 100)',
  },
  {
    id: 'spinach_omelette',
    name: 'Spinach omelette',
    emoji: '🥬',
    ingredients: ['eggs', 'spinach'],
    optional: ['cheese', 'garlic', 'butter'],
    time: 9, price: 2.30, protein: 'high',
    tags: ['fitness', 'lazy'],
    why: 'Greens in. Done in 9 minutes.',
    steps: [
      'Wilt spinach in butter, set aside.',
      'Whisk eggs, pour into pan.',
      'Spinach + cheese, fold.',
    ],
    bgTone: 'oklch(0.92 0.07 140)',
  },
  {
    id: 'garlic_pasta',
    name: 'Garlic oil pasta',
    emoji: '🍝',
    ingredients: ['pasta', 'garlic', 'olive_oil'],
    optional: ['cheese', 'spinach'],
    time: 12, price: 1.40, protein: 'low',
    tags: ['student', 'budget', 'lazy'],
    why: 'Pasta. Garlic. Oil. That\u2019s it.',
    steps: [
      'Cook pasta.',
      'Slowly fry sliced garlic in olive oil.',
      'Toss pasta in oil. Salt. Plate.',
    ],
    bgTone: 'oklch(0.94 0.05 90)',
  },
  {
    id: 'baked_potato',
    name: 'Loaded baked potato',
    emoji: '🥔',
    ingredients: ['potato', 'cheese'],
    optional: ['butter', 'beans'],
    time: 25, price: 1.60, protein: 'medium',
    tags: ['student', 'budget'],
    why: 'Ten minutes of work, twenty of patience.',
    steps: [
      'Microwave potato 8 min, then oven 10.',
      'Split. Stuff with cheese + butter.',
      'Beans on top if you have them.',
    ],
    bgTone: 'oklch(0.93 0.06 75)',
  },
  {
    id: 'yogurt_bowl',
    name: 'Yogurt protein bowl',
    emoji: '🍶',
    ingredients: ['yogurt', 'oats'],
    optional: ['lemon'],
    time: 3, price: 1.40, protein: 'high',
    tags: ['fitness', 'lazy'],
    why: 'No stove. No dishes.',
    steps: [
      'Spoon yogurt in a bowl.',
      'Top with oats.',
      'Eat.',
    ],
    bgTone: 'oklch(0.94 0.04 110)',
  },
  {
    id: 'rice_beans_bowl',
    name: 'Rice and beans bowl',
    emoji: '🍚',
    ingredients: ['rice', 'beans', 'onion'],
    optional: ['bell_pepper', 'cheese', 'garlic'],
    time: 16, price: 1.55, protein: 'medium',
    tags: ['student', 'budget'],
    why: 'Cheap carbs plus real protein.',
    steps: [
      'Cook rice or reheat leftover rice.',
      'Warm beans with onion and garlic.',
      'Pile beans over rice. Cheese if you have it.',
    ],
    bgTone: 'oklch(0.93 0.06 80)',
  },
  {
    id: 'chicken_pasta_spinach',
    name: 'Chicken spinach pasta',
    emoji: '🍗',
    ingredients: ['chicken', 'pasta', 'spinach'],
    optional: ['garlic', 'cheese', 'olive_oil'],
    time: 20, price: 4.80, protein: 'high',
    tags: ['fitness'],
    why: 'Protein meal that still feels like dinner.',
    steps: [
      'Cook pasta while chicken sears.',
      'Wilt spinach with garlic.',
      'Slice chicken and toss everything together.',
    ],
    bgTone: 'oklch(0.92 0.06 135)',
  },
  {
    id: 'potato_egg_hash',
    name: 'Potato egg hash',
    emoji: '🥔',
    ingredients: ['potato', 'eggs', 'onion'],
    optional: ['cheese', 'bell_pepper'],
    time: 18, price: 1.70, protein: 'medium',
    tags: ['student', 'budget'],
    why: 'One pan. Properly filling.',
    steps: [
      'Dice potato small and pan-fry with onion.',
      'Make two spaces and crack in eggs.',
      'Cover until eggs set. Cheese if wanted.',
    ],
    bgTone: 'oklch(0.94 0.06 75)',
  },
  {
    id: 'tuna_rice_lemon',
    name: 'Lemon tuna rice',
    emoji: '🐟',
    ingredients: ['rice', 'tuna', 'lemon'],
    optional: ['spinach', 'olive_oil'],
    time: 10, price: 2.20, protein: 'high',
    tags: ['fitness', 'lazy', 'budget'],
    why: 'Cold bowl, high protein, no drama.',
    steps: [
      'Use warm or leftover rice.',
      'Flake tuna over it.',
      'Add lemon, olive oil, and spinach if you have it.',
    ],
    bgTone: 'oklch(0.93 0.05 105)',
  },
  {
    id: 'grilled_cheese_beans',
    name: 'Grilled cheese and beans',
    emoji: '🥪',
    ingredients: ['bread', 'cheese', 'beans'],
    optional: ['butter'],
    time: 9, price: 1.85, protein: 'medium',
    tags: ['student', 'lazy', 'budget'],
    why: 'Comfort food with a little protein.',
    steps: [
      'Toast cheese sandwich in a pan.',
      'Warm beans on the side.',
      'Eat together. Done.',
    ],
    bgTone: 'oklch(0.94 0.07 70)',
  },
  {
    id: 'pepper_egg_rice',
    name: 'Pepper egg rice',
    emoji: '🫑',
    ingredients: ['rice', 'eggs', 'bell_pepper'],
    optional: ['onion', 'garlic'],
    time: 14, price: 1.95, protein: 'medium',
    tags: ['student', 'lazy', 'budget'],
    why: 'A better fried rice when you have veg.',
    steps: [
      'Fry bell pepper and onion.',
      'Add rice and scramble in eggs.',
      'Salt hard. Garlic if you have it.',
    ],
    bgTone: 'oklch(0.93 0.07 120)',
  },
  {
    id: 'spinach_tuna_toast',
    name: 'Spinach tuna toast',
    emoji: '🥬',
    ingredients: ['bread', 'tuna', 'spinach'],
    optional: ['lemon', 'cheese'],
    time: 7, price: 2.65, protein: 'high',
    tags: ['fitness', 'lazy'],
    why: 'High protein, barely cooking.',
    steps: [
      'Toast bread.',
      'Mix tuna with lemon.',
      'Add spinach and pile it on toast.',
    ],
    bgTone: 'oklch(0.92 0.07 145)',
  },
  {
    id: 'tomato_egg_pasta',
    name: 'Tomato egg pasta',
    emoji: '🍝',
    ingredients: ['pasta', 'eggs', 'tomato_sauce'],
    optional: ['garlic', 'cheese'],
    time: 13, price: 1.95, protein: 'medium',
    tags: ['student', 'budget', 'lazy'],
    why: 'Cheap pasta, but not sad pasta.',
    steps: [
      'Cook pasta.',
      'Warm tomato sauce with garlic.',
      'Stir in beaten egg off heat until glossy.',
    ],
    bgTone: 'oklch(0.93 0.06 55)',
  },
  {
    id: 'chicken_potato_plate',
    name: 'Chicken potato plate',
    emoji: '🍽️',
    ingredients: ['chicken', 'potato'],
    optional: ['spinach', 'lemon', 'olive_oil'],
    time: 24, price: 4.10, protein: 'high',
    tags: ['fitness'],
    why: 'Simple gym food without pretending.',
    steps: [
      'Microwave potato until soft.',
      'Pan-sear chicken.',
      'Add lemon and spinach on the side.',
    ],
    bgTone: 'oklch(0.92 0.05 120)',
  },
  {
    id: 'savory_oats_egg',
    name: 'Savory oats with egg',
    emoji: '🥣',
    ingredients: ['oats', 'eggs', 'cheese'],
    optional: ['spinach'],
    time: 8, price: 1.45, protein: 'high',
    tags: ['fitness', 'budget', 'lazy'],
    why: 'Looks weird. Works shockingly well.',
    steps: [
      'Cook oats with water and salt.',
      'Stir in cheese.',
      'Top with a fried or soft egg.',
    ],
    bgTone: 'oklch(0.94 0.05 100)',
  },
  {
    id: 'butter_rice_omelette',
    name: 'Butter rice omelette',
    emoji: '🍳',
    ingredients: ['rice', 'eggs', 'butter'],
    optional: ['cheese', 'onion'],
    time: 10, price: 1.35, protein: 'medium',
    tags: ['student', 'lazy', 'budget'],
    why: 'Leftover rice rescue mission.',
    steps: [
      'Warm rice in butter.',
      'Make a quick omelette.',
      'Fold omelette over rice.',
    ],
    bgTone: 'oklch(0.94 0.06 85)',
  },
  {
    id: 'pb_banana_oats',
    name: 'Peanut banana oats',
    emoji: '🍌',
    ingredients: ['oats', 'banana', 'peanut_butter'],
    optional: ['milk', 'yogurt'],
    time: 5, price: 0.95, protein: 'medium',
    tags: ['student', 'lazy', 'budget', 'fitness'],
    why: 'Cheap breakfast that actually holds you.',
    steps: ['Cook oats with water or milk.', 'Slice banana on top.', 'Swirl in peanut butter.'],
    bgTone: 'oklch(0.94 0.06 90)',
  },
  {
    id: 'apple_yogurt_oats',
    name: 'Apple yogurt oats',
    emoji: '🍎',
    ingredients: ['oats', 'yogurt', 'apple'],
    optional: ['milk', 'peanut_butter'],
    time: 4, price: 1.35, protein: 'medium',
    tags: ['fitness', 'lazy', 'budget'],
    why: 'Cold, crunchy, no stove.',
    steps: ['Spoon yogurt into a bowl.', 'Add oats.', 'Chop apple over the top.'],
    bgTone: 'oklch(0.94 0.05 100)',
  },
  {
    id: 'banana_pb_toast',
    name: 'Banana peanut toast',
    emoji: '🍞',
    ingredients: ['bread', 'banana', 'peanut_butter'],
    optional: ['milk'],
    time: 4, price: 1.00, protein: 'medium',
    tags: ['student', 'lazy', 'budget'],
    why: 'Four minutes. Zero cooking.',
    steps: ['Toast bread.', 'Spread peanut butter.', 'Add banana slices.'],
    bgTone: 'oklch(0.95 0.06 85)',
  },
  {
    id: 'hummus_cucumber_toast',
    name: 'Hummus cucumber toast',
    emoji: '🥒',
    ingredients: ['bread', 'hummus', 'cucumber'],
    optional: ['lemon'],
    time: 5, price: 1.60, protein: 'medium',
    tags: ['lazy', 'budget', 'eat_lighter'],
    why: 'Fresh enough to feel responsible.',
    steps: ['Toast bread.', 'Spread hummus.', 'Top with cucumber and lemon.'],
    bgTone: 'oklch(0.93 0.06 135)',
  },
  {
    id: 'chicken_tortilla_wrap',
    name: 'Chicken tortilla wrap',
    emoji: '🌯',
    ingredients: ['tortilla', 'chicken', 'spinach'],
    optional: ['cheese', 'cucumber', 'lemon'],
    time: 10, price: 3.40, protein: 'high',
    tags: ['fitness', 'lazy'],
    why: 'Portable protein. No fork needed.',
    steps: ['Warm tortilla.', 'Add chicken and spinach.', 'Wrap tight. Lemon if you have it.'],
    bgTone: 'oklch(0.92 0.06 125)',
  },
  {
    id: 'tuna_bean_wrap',
    name: 'Tuna bean wrap',
    emoji: '🌯',
    ingredients: ['tortilla', 'tuna', 'beans'],
    optional: ['cucumber', 'lemon'],
    time: 7, price: 2.50, protein: 'high',
    tags: ['fitness', 'lazy', 'budget'],
    why: 'Protein bomb without cooking.',
    steps: ['Drain tuna and beans.', 'Mash lightly together.', 'Wrap in tortilla.'],
    bgTone: 'oklch(0.93 0.05 115)',
  },
  {
    id: 'egg_cheese_wrap',
    name: 'Egg cheese wrap',
    emoji: '🌯',
    ingredients: ['tortilla', 'eggs', 'cheese'],
    optional: ['spinach', 'ham'],
    time: 8, price: 1.75, protein: 'high',
    tags: ['student', 'lazy', 'budget', 'fitness'],
    why: 'Breakfast wrap energy, any time.',
    steps: ['Scramble eggs.', 'Melt cheese on tortilla.', 'Fill and fold.'],
    bgTone: 'oklch(0.94 0.06 80)',
  },
  {
    id: 'ham_cheese_toastie',
    name: 'Ham cheese toastie',
    emoji: '🥪',
    ingredients: ['bread', 'ham', 'cheese'],
    optional: ['butter', 'spinach'],
    time: 7, price: 1.90, protein: 'high',
    tags: ['student', 'lazy', 'budget'],
    why: 'A sandwich, upgraded by heat.',
    steps: ['Build sandwich.', 'Toast in pan.', 'Press until cheese melts.'],
    bgTone: 'oklch(0.94 0.06 70)',
  },
  {
    id: 'ham_egg_rice',
    name: 'Ham egg rice',
    emoji: '🍚',
    ingredients: ['rice', 'ham', 'eggs'],
    optional: ['peas', 'onion'],
    time: 12, price: 2.00, protein: 'high',
    tags: ['student', 'budget', 'lazy'],
    why: 'Fried rice with actual bite.',
    steps: ['Fry ham and rice.', 'Scramble in eggs.', 'Add peas if you have them.'],
    bgTone: 'oklch(0.93 0.05 95)',
  },
  {
    id: 'mushroom_cheese_omelette',
    name: 'Mushroom cheese omelette',
    emoji: '🍄',
    ingredients: ['eggs', 'mushrooms', 'cheese'],
    optional: ['butter', 'spinach'],
    time: 10, price: 2.25, protein: 'high',
    tags: ['fitness', 'lazy'],
    why: 'Feels like brunch. Takes ten minutes.',
    steps: ['Fry mushrooms.', 'Add beaten eggs.', 'Fold with cheese.'],
    bgTone: 'oklch(0.92 0.04 105)',
  },
  {
    id: 'mushroom_garlic_pasta',
    name: 'Mushroom garlic pasta',
    emoji: '🍄',
    ingredients: ['pasta', 'mushrooms', 'garlic'],
    optional: ['cheese', 'olive_oil'],
    time: 14, price: 1.85, protein: 'medium',
    tags: ['student', 'budget', 'lazy'],
    why: 'Cheap pasta that tastes intentional.',
    steps: ['Cook pasta.', 'Fry mushrooms and garlic.', 'Toss together with oil.'],
    bgTone: 'oklch(0.93 0.04 95)',
  },
  {
    id: 'peas_cheese_pasta',
    name: 'Peas cheese pasta',
    emoji: '🟢',
    ingredients: ['pasta', 'peas', 'cheese'],
    optional: ['butter', 'garlic'],
    time: 11, price: 1.55, protein: 'medium',
    tags: ['student', 'budget', 'lazy'],
    why: 'Green dots make cheap pasta less bleak.',
    steps: ['Cook pasta and peas together.', 'Drain.', 'Stir in cheese and butter.'],
    bgTone: 'oklch(0.93 0.06 120)',
  },
  {
    id: 'corn_bean_rice',
    name: 'Corn bean rice',
    emoji: '🌽',
    ingredients: ['rice', 'beans', 'canned_corn'],
    optional: ['bell_pepper', 'cheese'],
    time: 13, price: 1.60, protein: 'medium',
    tags: ['student', 'budget', 'lazy'],
    why: 'Pantry bowl with texture.',
    steps: ['Warm rice.', 'Heat beans and corn.', 'Mix and top with cheese.'],
    bgTone: 'oklch(0.94 0.07 90)',
  },
  {
    id: 'corn_tuna_pasta',
    name: 'Corn tuna pasta',
    emoji: '🌽',
    ingredients: ['pasta', 'tuna', 'canned_corn'],
    optional: ['yogurt', 'lemon'],
    time: 12, price: 2.30, protein: 'high',
    tags: ['fitness', 'student', 'lazy'],
    why: 'Cold pasta salad, student edition.',
    steps: ['Cook pasta.', 'Mix tuna and corn.', 'Add lemon or yogurt if available.'],
    bgTone: 'oklch(0.94 0.06 90)',
  },
  {
    id: 'carrot_egg_fried_rice',
    name: 'Carrot egg fried rice',
    emoji: '🥕',
    ingredients: ['rice', 'eggs', 'carrot'],
    optional: ['onion', 'peas'],
    time: 13, price: 1.45, protein: 'medium',
    tags: ['student', 'budget', 'lazy'],
    why: 'Cheap, colorful, done fast.',
    steps: ['Grate carrot.', 'Fry rice and carrot.', 'Scramble in eggs.'],
    bgTone: 'oklch(0.94 0.06 75)',
  },
  {
    id: 'carrot_hummus_wrap',
    name: 'Carrot hummus wrap',
    emoji: '🥕',
    ingredients: ['tortilla', 'hummus', 'carrot'],
    optional: ['cucumber', 'spinach'],
    time: 5, price: 1.70, protein: 'medium',
    tags: ['lazy', 'budget'],
    why: 'Crunchy lunch without cooking.',
    steps: ['Spread hummus on tortilla.', 'Add grated carrot.', 'Wrap and eat.'],
    bgTone: 'oklch(0.94 0.07 80)',
  },
  {
    id: 'potato_peas_hash',
    name: 'Potato pea hash',
    emoji: '🥔',
    ingredients: ['potato', 'peas', 'onion'],
    optional: ['eggs', 'cheese'],
    time: 20, price: 1.20, protein: 'medium',
    tags: ['student', 'budget'],
    why: 'One pan, very cheap, properly filling.',
    steps: ['Dice potato small.', 'Fry with onion.', 'Add peas near the end.'],
    bgTone: 'oklch(0.94 0.06 95)',
  },
  {
    id: 'loaded_bean_potato',
    name: 'Loaded bean potato',
    emoji: '🥔',
    ingredients: ['potato', 'beans', 'cheese'],
    optional: ['canned_corn'],
    time: 18, price: 1.75, protein: 'medium',
    tags: ['student', 'budget'],
    why: 'Microwave dinner that eats like a meal.',
    steps: ['Microwave potato.', 'Warm beans.', 'Split potato and load it.'],
    bgTone: 'oklch(0.94 0.06 75)',
  },
  {
    id: 'chicken_pepper_wrap',
    name: 'Chicken pepper wrap',
    emoji: '🫑',
    ingredients: ['tortilla', 'chicken', 'bell_pepper'],
    optional: ['cheese', 'onion'],
    time: 12, price: 3.20, protein: 'high',
    tags: ['fitness', 'lazy'],
    why: 'Fast dinner with crunch.',
    steps: ['Slice pepper.', 'Warm chicken.', 'Wrap with pepper and cheese.'],
    bgTone: 'oklch(0.92 0.07 120)',
  },
  {
    id: 'chicken_corn_rice',
    name: 'Chicken corn rice',
    emoji: '🍗',
    ingredients: ['rice', 'chicken', 'canned_corn'],
    optional: ['bell_pepper', 'lemon'],
    time: 15, price: 3.40, protein: 'high',
    tags: ['fitness'],
    why: 'Meal prep bowl without the spreadsheet.',
    steps: ['Warm rice.', 'Add chicken and corn.', 'Finish with lemon.'],
    bgTone: 'oklch(0.93 0.06 105)',
  },
  {
    id: 'chicken_pea_pasta',
    name: 'Chicken pea pasta',
    emoji: '🍝',
    ingredients: ['pasta', 'chicken', 'peas'],
    optional: ['cheese', 'garlic'],
    time: 16, price: 3.70, protein: 'high',
    tags: ['fitness', 'student'],
    why: 'High protein pasta, not complicated.',
    steps: ['Cook pasta and peas.', 'Warm chicken.', 'Toss everything together.'],
    bgTone: 'oklch(0.92 0.06 120)',
  },
  {
    id: 'tuna_cucumber_rice',
    name: 'Tuna cucumber rice',
    emoji: '🥒',
    ingredients: ['rice', 'tuna', 'cucumber'],
    optional: ['lemon'],
    time: 8, price: 2.20, protein: 'high',
    tags: ['fitness', 'lazy', 'budget'],
    why: 'Cold bowl. Fresh crunch. Done.',
    steps: ['Use cooked rice.', 'Top with tuna.', 'Add cucumber and lemon.'],
    bgTone: 'oklch(0.93 0.05 130)',
  },
  {
    id: 'egg_mushroom_rice',
    name: 'Egg mushroom rice',
    emoji: '🍄',
    ingredients: ['rice', 'eggs', 'mushrooms'],
    optional: ['garlic', 'onion'],
    time: 12, price: 1.80, protein: 'medium',
    tags: ['student', 'lazy', 'budget'],
    why: 'Fried rice with more flavor.',
    steps: ['Fry mushrooms.', 'Add rice.', 'Scramble in eggs.'],
    bgTone: 'oklch(0.93 0.04 100)',
  },
  {
    id: 'spinach_cheese_wrap',
    name: 'Spinach cheese wrap',
    emoji: '🥬',
    ingredients: ['tortilla', 'spinach', 'cheese'],
    optional: ['eggs'],
    time: 7, price: 1.80, protein: 'medium',
    tags: ['lazy', 'budget'],
    why: 'Warm, green, and barely effort.',
    steps: ['Warm tortilla.', 'Add spinach and cheese.', 'Toast until melty.'],
    bgTone: 'oklch(0.92 0.07 140)',
  },
  {
    id: 'egg_pancake',
    name: 'Emergency pancake',
    emoji: '🥞',
    ingredients: ['flour', 'eggs', 'milk'],
    optional: ['banana', 'peanut_butter'],
    time: 12, price: 0.95, protein: 'medium',
    tags: ['student', 'budget'],
    why: 'When the cupboard is almost empty.',
    steps: ['Mix flour, egg, and milk.', 'Cook small pancakes.', 'Top with banana if you have it.'],
    bgTone: 'oklch(0.94 0.06 85)',
  },
  {
    id: 'banana_pancake',
    name: 'Banana pancake',
    emoji: '🥞',
    ingredients: ['banana', 'eggs', 'flour'],
    optional: ['milk', 'peanut_butter'],
    time: 10, price: 1.00, protein: 'medium',
    tags: ['student', 'lazy', 'budget'],
    why: 'Sweet enough without trying hard.',
    steps: ['Mash banana.', 'Mix with egg and flour.', 'Pan-fry small pancakes.'],
    bgTone: 'oklch(0.95 0.07 90)',
  },
  {
    id: 'yogurt_pb_banana',
    name: 'Yogurt peanut banana',
    emoji: '🍶',
    ingredients: ['yogurt', 'banana', 'peanut_butter'],
    optional: ['oats'],
    time: 3, price: 1.35, protein: 'high',
    tags: ['fitness', 'lazy'],
    why: 'Dessert energy, decent macros.',
    steps: ['Add yogurt to bowl.', 'Slice banana.', 'Spoon peanut butter on top.'],
    bgTone: 'oklch(0.94 0.05 95)',
  },
  {
    id: 'apple_pb_toast',
    name: 'Apple peanut toast',
    emoji: '🍎',
    ingredients: ['bread', 'apple', 'peanut_butter'],
    optional: ['yogurt'],
    time: 5, price: 1.10, protein: 'medium',
    tags: ['student', 'lazy', 'budget'],
    why: 'Crunchy, sweet, and cheap.',
    steps: ['Toast bread.', 'Spread peanut butter.', 'Add thin apple slices.'],
    bgTone: 'oklch(0.94 0.05 80)',
  },
  {
    id: 'cucumber_tuna_wrap',
    name: 'Cucumber tuna wrap',
    emoji: '🌯',
    ingredients: ['tortilla', 'tuna', 'cucumber'],
    optional: ['yogurt', 'lemon'],
    time: 6, price: 2.35, protein: 'high',
    tags: ['fitness', 'lazy'],
    why: 'No-cook protein wrap.',
    steps: ['Drain tuna.', 'Slice cucumber.', 'Wrap with lemon or yogurt.'],
    bgTone: 'oklch(0.93 0.06 125)',
  },
  {
    id: 'ham_spinach_omelette',
    name: 'Ham spinach omelette',
    emoji: '🍳',
    ingredients: ['eggs', 'ham', 'spinach'],
    optional: ['cheese'],
    time: 9, price: 2.15, protein: 'high',
    tags: ['fitness', 'lazy'],
    why: 'High protein, one pan.',
    steps: ['Warm ham and spinach.', 'Pour in eggs.', 'Fold when set.'],
    bgTone: 'oklch(0.92 0.06 130)',
  },
  {
    id: 'beans_cheese_wrap',
    name: 'Beans cheese wrap',
    emoji: '🌯',
    ingredients: ['tortilla', 'beans', 'cheese'],
    optional: ['canned_corn', 'bell_pepper'],
    time: 8, price: 1.60, protein: 'medium',
    tags: ['student', 'budget', 'lazy'],
    why: 'Basically a lazy burrito.',
    steps: ['Warm beans.', 'Add cheese to tortilla.', 'Fill, fold, toast.'],
    bgTone: 'oklch(0.94 0.06 75)',
  },
  {
    id: 'pepper_bean_wrap',
    name: 'Pepper bean wrap',
    emoji: '🫑',
    ingredients: ['tortilla', 'beans', 'bell_pepper'],
    optional: ['cheese', 'onion'],
    time: 10, price: 1.75, protein: 'medium',
    tags: ['student', 'budget', 'lazy'],
    why: 'Cheap wrap with crunch.',
    steps: ['Slice pepper.', 'Warm beans.', 'Wrap with pepper and cheese.'],
    bgTone: 'oklch(0.93 0.07 120)',
  },
  {
    id: 'rice_peas_omelette',
    name: 'Rice peas omelette',
    emoji: '🍳',
    ingredients: ['rice', 'peas', 'eggs'],
    optional: ['cheese'],
    time: 11, price: 1.40, protein: 'medium',
    tags: ['student', 'budget', 'lazy'],
    why: 'Fast, cheap, and not just carbs.',
    steps: ['Warm rice and peas.', 'Make omelette.', 'Serve together.'],
    bgTone: 'oklch(0.94 0.06 105)',
  },
  {
    id: 'tomato_bean_pasta',
    name: 'Tomato bean pasta',
    emoji: '🥫',
    ingredients: ['pasta', 'beans', 'tomato_sauce'],
    optional: ['garlic', 'cheese'],
    time: 14, price: 1.80, protein: 'medium',
    tags: ['student', 'budget'],
    why: 'Budget pasta with extra staying power.',
    steps: ['Cook pasta.', 'Warm beans in tomato sauce.', 'Combine.'],
    bgTone: 'oklch(0.93 0.06 55)',
  },
  {
    id: 'tomato_chicken_rice',
    name: 'Tomato chicken rice',
    emoji: '🍅',
    ingredients: ['rice', 'chicken', 'tomato_sauce'],
    optional: ['bell_pepper'],
    time: 16, price: 3.35, protein: 'high',
    tags: ['fitness', 'student'],
    why: 'Simple bowl, real protein.',
    steps: ['Warm rice.', 'Heat chicken in tomato sauce.', 'Spoon over rice.'],
    bgTone: 'oklch(0.93 0.06 65)',
  },
  {
    id: 'spinach_mushroom_pasta',
    name: 'Spinach mushroom pasta',
    emoji: '🥬',
    ingredients: ['pasta', 'spinach', 'mushrooms'],
    optional: ['cheese', 'garlic'],
    time: 15, price: 2.15, protein: 'medium',
    tags: ['student', 'lazy'],
    why: 'Vegetable pasta that is still easy.',
    steps: ['Cook pasta.', 'Fry mushrooms and wilt spinach.', 'Toss together.'],
    bgTone: 'oklch(0.92 0.06 135)',
  },
  {
    id: 'hummus_rice_bowl',
    name: 'Hummus rice bowl',
    emoji: '🧆',
    ingredients: ['rice', 'hummus', 'cucumber'],
    optional: ['lemon', 'spinach'],
    time: 6, price: 1.85, protein: 'medium',
    tags: ['lazy', 'budget'],
    why: 'Cold bowl, surprisingly complete.',
    steps: ['Add rice to bowl.', 'Spoon hummus on top.', 'Add cucumber and lemon.'],
    bgTone: 'oklch(0.93 0.06 125)',
  },
  {
    id: 'cucumber_cheese_sandwich',
    name: 'Cucumber cheese sandwich',
    emoji: '🥪',
    ingredients: ['bread', 'cucumber', 'cheese'],
    optional: ['butter'],
    time: 4, price: 1.45, protein: 'medium',
    tags: ['lazy', 'budget'],
    why: 'The quiet lunch option.',
    steps: ['Slice cucumber.', 'Add cheese to bread.', 'Assemble and eat.'],
    bgTone: 'oklch(0.94 0.06 130)',
  },
  {
    id: 'ham_potato_hash',
    name: 'Ham potato hash',
    emoji: '🥔',
    ingredients: ['potato', 'ham', 'onion'],
    optional: ['eggs', 'cheese'],
    time: 20, price: 2.00, protein: 'high',
    tags: ['student', 'budget'],
    why: 'Dinner from leftovers.',
    steps: ['Dice potato and onion.', 'Fry until crisp.', 'Add ham at the end.'],
    bgTone: 'oklch(0.94 0.06 80)',
  },
  {
    id: 'mushroom_potato_egg',
    name: 'Mushroom potato egg',
    emoji: '🍄',
    ingredients: ['potato', 'mushrooms', 'eggs'],
    optional: ['onion'],
    time: 20, price: 1.90, protein: 'medium',
    tags: ['student', 'budget'],
    why: 'One-pan breakfast-for-dinner.',
    steps: ['Fry potato cubes.', 'Add mushrooms.', 'Top with eggs.'],
    bgTone: 'oklch(0.93 0.05 95)',
  },
  {
    id: 'lemon_chicken_pasta',
    name: 'Lemon chicken pasta',
    emoji: '🍋',
    ingredients: ['pasta', 'chicken', 'lemon'],
    optional: ['spinach', 'olive_oil'],
    time: 16, price: 3.60, protein: 'high',
    tags: ['fitness'],
    why: 'Fresh high-protein pasta.',
    steps: ['Cook pasta.', 'Warm chicken.', 'Toss with lemon and oil.'],
    bgTone: 'oklch(0.94 0.06 105)',
  },
  {
    id: 'lemon_tuna_pasta',
    name: 'Lemon tuna pasta',
    emoji: '🍋',
    ingredients: ['pasta', 'tuna', 'lemon'],
    optional: ['olive_oil', 'spinach'],
    time: 11, price: 2.25, protein: 'high',
    tags: ['fitness', 'student', 'lazy'],
    why: 'Cleaner than tuna pasta with sauce.',
    steps: ['Cook pasta.', 'Add tuna.', 'Finish with lemon and oil.'],
    bgTone: 'oklch(0.94 0.06 100)',
  },
  {
    id: 'corn_pea_rice',
    name: 'Corn pea rice',
    emoji: '🌽',
    ingredients: ['rice', 'canned_corn', 'peas'],
    optional: ['eggs', 'cheese'],
    time: 10, price: 1.25, protein: 'medium',
    tags: ['student', 'budget', 'lazy'],
    why: 'Freezer/can rescue bowl.',
    steps: ['Warm rice.', 'Add corn and peas.', 'Top with egg if you have it.'],
    bgTone: 'oklch(0.94 0.07 100)',
  },
  {
    id: 'avocado_toast',
    name: 'Avocado toast',
    emoji: '🥑',
    ingredients: ['bread', 'avocado', 'lemon'],
    optional: ['eggs', 'cheese'],
    time: 6, price: 1.90, protein: 'low',
    tags: ['lazy', 'budget'],
    why: 'Fresh, fast, and actually satisfying.',
    steps: ['Toast bread.', 'Mash avocado with lemon and salt.', 'Spread it thick.'],
    bgTone: 'oklch(0.92 0.08 135)',
  },
  {
    id: 'egg_avocado_toast',
    name: 'Egg avocado toast',
    emoji: '🥚',
    ingredients: ['bread', 'avocado', 'eggs'],
    optional: ['lemon', 'spinach'],
    time: 9, price: 2.25, protein: 'medium',
    tags: ['fitness', 'lazy'],
    why: 'The useful version of brunch.',
    steps: ['Toast bread.', 'Fry or boil eggs.', 'Mash avocado and stack eggs on top.'],
    bgTone: 'oklch(0.92 0.08 130)',
  },
  {
    id: 'tuna_avocado_wrap',
    name: 'Tuna avocado wrap',
    emoji: '🌯',
    ingredients: ['tortilla', 'tuna', 'avocado'],
    optional: ['cucumber', 'lemon', 'spinach'],
    time: 7, price: 3.05, protein: 'high',
    tags: ['fitness', 'lazy'],
    why: 'High protein, creamy, no cooking.',
    steps: ['Drain tuna.', 'Mash avocado with lemon.', 'Wrap everything in tortilla.'],
    bgTone: 'oklch(0.92 0.07 135)',
  },
  {
    id: 'chicken_avocado_rice',
    name: 'Chicken avocado rice',
    emoji: '🍚',
    ingredients: ['rice', 'chicken', 'avocado'],
    optional: ['lemon', 'cucumber', 'bell_pepper'],
    time: 12, price: 3.85, protein: 'high',
    tags: ['fitness', 'lazy'],
    why: 'Gym bowl, but not dry.',
    steps: ['Warm rice and chicken.', 'Slice avocado.', 'Finish with lemon and salt.'],
    bgTone: 'oklch(0.92 0.07 130)',
  },
  {
    id: 'bean_avocado_wrap',
    name: 'Bean avocado wrap',
    emoji: '🫘',
    ingredients: ['tortilla', 'beans', 'avocado'],
    optional: ['canned_corn', 'cheese'],
    time: 8, price: 2.35, protein: 'medium',
    tags: ['student', 'budget', 'lazy'],
    why: 'Cheap burrito logic, softer landing.',
    steps: ['Warm beans.', 'Mash avocado.', 'Fill tortilla and toast if you want.'],
    bgTone: 'oklch(0.92 0.07 125)',
  },
  {
    id: 'avocado_cucumber_toast',
    name: 'Avocado cucumber toast',
    emoji: '🥒',
    ingredients: ['bread', 'avocado', 'cucumber'],
    optional: ['lemon', 'hummus'],
    time: 5, price: 2.00, protein: 'low',
    tags: ['lazy'],
    why: 'Cold, crunchy, no pan.',
    steps: ['Toast bread.', 'Spread mashed avocado.', 'Add cucumber slices.'],
    bgTone: 'oklch(0.92 0.08 140)',
  },
  {
    id: 'avocado_egg_rice',
    name: 'Avocado egg rice',
    emoji: '🥑',
    ingredients: ['rice', 'avocado', 'eggs'],
    optional: ['lemon', 'spinach'],
    time: 10, price: 2.20, protein: 'medium',
    tags: ['student', 'lazy', 'budget'],
    why: 'Rice bowl with creamy backup.',
    steps: ['Warm rice.', 'Cook eggs however you like.', 'Add avocado and lemon.'],
    bgTone: 'oklch(0.93 0.07 120)',
  },
];

let API_MEALS = [];
let GENERATED_MEALS = [];

function setApiMeals(meals) {
  API_MEALS = Array.isArray(meals) ? meals : [];
}

function getMealCatalog() {
  const byId = new Map();
  for (const meal of [...GENERATED_MEALS, ...API_MEALS, ...MEALS]) byId.set(meal.id, meal);
  return [...byId.values()];
}

function getMealById(id) {
  return getMealCatalog().find((meal) => meal.id === id);
}

function makeGenericMeals(pantry, resolvedIngredients = {}) {
  const have = new Set(pantry.map(resolveIngredientId));
  const resolved = pantry
    .map((id) => resolvedIngredients[id] || resolvedIngredients[resolveIngredientId(id)])
    .filter(Boolean);
  const byCategory = (category) => resolved.find((item) => item.category === category);
  const allByCategory = (category) => resolved.filter((item) => item.category === category);
  const protein = byCategory('protein');
  const veg = byCategory('vegetable');
  const fruit = byCategory('fruit');
  const carb = byCategory('carb');
  const fat = byCategory('fat');
  const sauce = byCategory('sauce');
  const other = byCategory('other');
  const proteins = allByCategory('protein');
  const vegetables = allByCategory('vegetable');
  const fruits = allByCategory('fruit');
  const carbs = allByCategory('carb');
  const fats = allByCategory('fat');
  const meals = [];

  const add = (meal) => meals.push({ source: 'generated', bgTone: 'oklch(0.93 0.05 120)', optional: [], ...meal });

  if (protein && have.has('rice')) add({
    id: `gen_${protein.id.slice(7)}_rice_bowl`,
    name: `${protein.name} rice bowl`,
    emoji: '🍚',
    ingredients: [protein.id, 'rice'],
    optional: ['spinach', 'lemon', 'bell_pepper'],
    time: 16,
    price: (protein.cost || 1.5) + 0.5,
    protein: 'high',
    tags: ['fitness', 'student'],
    why: 'Generated from your custom protein plus rice.',
    steps: [`Cook or warm ${protein.name}.`, 'Serve over rice.', 'Add any veg or lemon you have.'],
  });

  if (protein && have.has('pasta')) add({
    id: `gen_${protein.id.slice(7)}_pasta`,
    name: `${protein.name} pasta`,
    emoji: '🍝',
    ingredients: [protein.id, 'pasta'],
    optional: ['tomato_sauce', 'garlic', 'cheese'],
    time: 16,
    price: (protein.cost || 1.5) + 0.7,
    protein: 'high',
    tags: ['fitness', 'student'],
    why: 'Generated from your custom protein plus pasta.',
    steps: [`Cook or warm ${protein.name}.`, 'Cook pasta.', 'Toss together with any sauce or cheese.'],
  });

  if (protein && have.has('tortilla')) add({
    id: `gen_${protein.id.slice(7)}_wrap`,
    name: `${protein.name} wrap`,
    emoji: '🌯',
    ingredients: [protein.id, 'tortilla'],
    optional: ['spinach', 'cucumber', 'cheese'],
    time: 10,
    price: (protein.cost || 1.5) + 0.7,
    protein: 'high',
    tags: ['fitness', 'lazy'],
    why: 'Generated wrap from your custom ingredient.',
    steps: [`Warm ${protein.name}.`, 'Fill tortilla.', 'Add greens or cheese if you have them.'],
  });

  if (veg && have.has('eggs')) add({
    id: `gen_${veg.id.slice(7)}_omelette`,
    name: `${veg.name} omelette`,
    emoji: '🍳',
    ingredients: [veg.id, 'eggs'],
    optional: ['cheese', 'butter'],
    time: 10,
    price: (veg.cost || 0.6) + 0.9,
    protein: 'medium',
    tags: ['lazy', 'budget'],
    why: 'Generated because veg plus eggs is a reliable move.',
    steps: [`Cook ${veg.name} briefly.`, 'Add beaten eggs.', 'Fold and serve.'],
  });

  if (veg && have.has('pasta')) add({
    id: `gen_${veg.id.slice(7)}_pasta`,
    name: `${veg.name} pasta`,
    emoji: '🍝',
    ingredients: [veg.id, 'pasta'],
    optional: ['garlic', 'cheese', 'olive_oil'],
    time: 14,
    price: (veg.cost || 0.6) + 0.7,
    protein: 'medium',
    tags: ['student', 'lazy', 'budget'],
    why: 'Generated vegetable pasta from your pantry.',
    steps: [`Cook ${veg.name} briefly.`, 'Cook pasta.', 'Toss together with oil or cheese.'],
  });

  if (veg && have.has('rice')) add({
    id: `gen_${veg.id.slice(7)}_rice`,
    name: `${veg.name} rice bowl`,
    emoji: '🍚',
    ingredients: [veg.id, 'rice'],
    optional: ['eggs', 'beans', 'lemon'],
    time: 12,
    price: (veg.cost || 0.6) + 0.5,
    protein: 'medium',
    tags: ['student', 'lazy', 'budget'],
    why: 'Generated simple rice bowl from your custom veg.',
    steps: ['Warm rice.', `Cook or slice ${veg.name}.`, 'Combine and season.'],
  });

  if ((fruit || fat) && have.has('bread')) {
    const item = fruit || fat;
    add({
      id: `gen_${item.id.slice(7)}_toast`,
      name: `${item.name} toast`,
      emoji: fruit ? '🍞' : '🥑',
      ingredients: [item.id, 'bread'],
      optional: ['yogurt', 'peanut_butter'],
      time: 5,
      price: (item.cost || 0.5) + 0.4,
      protein: 'low',
      tags: ['lazy', 'budget'],
      why: 'Generated no-cook toast from your pantry.',
      steps: ['Toast bread.', `Add ${item.name}.`, 'Eat immediately.'],
    });
  }

  if (fat && have.has('tortilla')) add({
    id: `gen_${fat.id.slice(7)}_wrap`,
    name: `${fat.name} wrap`,
    emoji: '🌯',
    ingredients: [fat.id, 'tortilla'],
    optional: ['beans', 'spinach', 'cheese'],
    time: 6,
    price: (fat.cost || 0.7) + 0.6,
    protein: 'medium',
    tags: ['lazy', 'budget'],
    why: 'Generated quick wrap from your custom fat.',
    steps: [`Add ${fat.name} to tortilla.`, 'Add any beans, greens, or cheese.', 'Wrap and eat.'],
  });

  if ((fruit || carb) && have.has('oats')) {
    const item = fruit || carb;
    add({
      id: `gen_${item.id.slice(7)}_oats`,
      name: `${item.name} oats`,
      emoji: '🥣',
      ingredients: [item.id, 'oats'],
      optional: ['milk', 'yogurt'],
      time: 5,
      price: (item.cost || 0.5) + 0.4,
      protein: 'medium',
      tags: ['student', 'lazy', 'budget'],
      why: 'Generated breakfast bowl from your custom ingredient.',
      steps: ['Cook or soak oats.', `Add ${item.name}.`, 'Add milk or yogurt if available.'],
    });
  }

  if (fruit && have.has('yogurt')) add({
    id: `gen_${fruit.id.slice(7)}_yogurt_bowl`,
    name: `${fruit.name} yogurt bowl`,
    emoji: '🍶',
    ingredients: [fruit.id, 'yogurt'],
    optional: ['oats', 'peanut_butter'],
    time: 3,
    price: (fruit.cost || 0.6) + 0.9,
    protein: 'medium',
    tags: ['fitness', 'lazy'],
    why: 'Generated because fruit plus yogurt is the obvious no-cook win.',
    steps: ['Spoon yogurt into a bowl.', `Add ${fruit.name}.`, 'Add oats if you want it filling.'],
  });

  if (fruit && fat && have.has('yogurt')) add({
    id: `gen_${fruit.id.slice(7)}_${fat.id.slice(7)}_yogurt`,
    name: `${fruit.name} coconut yogurt bowl`,
    emoji: '🥥',
    ingredients: [fruit.id, fat.id, 'yogurt'],
    optional: ['oats'],
    time: 4,
    price: (fruit.cost || 0.6) + (fat.cost || 0.7) + 0.8,
    protein: 'medium',
    tags: ['lazy'],
    why: 'Generated tropical bowl from your custom ingredients.',
    steps: ['Add yogurt to bowl.', `Top with ${fruit.name} and ${fat.name}.`, 'Add oats if you need more fuel.'],
  });

  if (fruit && fat && have.has('oats')) add({
    id: `gen_${fruit.id.slice(7)}_${fat.id.slice(7)}_oats`,
    name: `${fruit.name} coconut oats`,
    emoji: '🥣',
    ingredients: [fruit.id, fat.id, 'oats'],
    optional: ['milk', 'yogurt'],
    time: 5,
    price: (fruit.cost || 0.6) + (fat.cost || 0.7) + 0.4,
    protein: 'medium',
    tags: ['student', 'lazy', 'budget'],
    why: 'Generated breakfast from fruit plus coconut.',
    steps: ['Cook or soak oats.', `Add ${fruit.name} and ${fat.name}.`, 'Use milk or yogurt if available.'],
  });

  if (protein && veg) add({
    id: `gen_${protein.id.slice(7)}_${veg.id.slice(7)}_plate`,
    name: `${protein.name} ${veg.name} plate`,
    emoji: '🍽️',
    ingredients: [protein.id, veg.id],
    optional: ['rice', 'potato', 'bread'],
    time: 18,
    price: (protein.cost || 1.5) + (veg.cost || 0.6),
    protein: 'high',
    tags: ['fitness'],
    why: 'Generated because protein plus veg is already a meal.',
    steps: [`Cook or warm ${protein.name}.`, `Cook or slice ${veg.name}.`, 'Add any carb if you need it filling.'],
  });

  if (carb && protein) add({
    id: `gen_${protein.id.slice(7)}_${carb.id.slice(7)}_bowl`,
    name: `${protein.name} ${carb.name} bowl`,
    emoji: '🍲',
    ingredients: [protein.id, carb.id],
    optional: ['spinach', 'lemon', 'sauce'],
    time: 16,
    price: (protein.cost || 1.5) + (carb.cost || 0.7),
    protein: 'high',
    tags: ['fitness', 'student'],
    why: 'Generated from your custom protein and carb.',
    steps: [`Cook ${carb.name}.`, `Cook or warm ${protein.name}.`, 'Combine and season.'],
  });

  if (carb && veg) add({
    id: `gen_${veg.id.slice(7)}_${carb.id.slice(7)}_bowl`,
    name: `${veg.name} ${carb.name} bowl`,
    emoji: '🍲',
    ingredients: [veg.id, carb.id],
    optional: ['eggs', 'beans', 'cheese'],
    time: 14,
    price: (veg.cost || 0.6) + (carb.cost || 0.7),
    protein: 'medium',
    tags: ['student', 'budget', 'lazy'],
    why: 'Generated from your custom carb and veg.',
    steps: [`Cook ${carb.name}.`, `Cook or slice ${veg.name}.`, 'Add any protein if you have it.'],
  });

  if (sauce && protein) add({
    id: `gen_${protein.id.slice(7)}_${sauce.id.slice(7)}`,
    name: `${sauce.name} ${protein.name}`,
    emoji: '🍽️',
    ingredients: [protein.id, sauce.id],
    optional: ['rice', 'pasta', 'bread'],
    time: 12,
    price: (protein.cost || 1.5) + (sauce.cost || 0.5),
    protein: 'high',
    tags: ['lazy', 'fitness'],
    why: 'Generated because sauce plus protein is a fast base.',
    steps: [`Warm ${protein.name}.`, `Add ${sauce.name}.`, 'Serve with any carb you have.'],
  });

  if (other) add({
    id: `gen_${other.id.slice(7)}_snack`,
    name: `${other.name} snack plate`,
    emoji: '🍽️',
    ingredients: [other.id],
    optional: ['bread', 'yogurt', 'cheese', 'rice'],
    time: 5,
    price: other.cost || 0.75,
    protein: other.protein >= 10 ? 'high' : 'medium',
    tags: ['lazy'],
    why: 'Generated from a resolved custom food. Add a staple if you want a fuller meal.',
    steps: [`Use ${other.name} as the base.`, 'Pair with any bread, rice, yogurt, or cheese you have.', 'Keep it simple.'],
  });

  if (resolved.length >= 2 && meals.length === 0) {
    const first = resolved[0];
    const second = resolved[1];
    add({
      id: `gen_${first.id.slice(7)}_${second.id.slice(7)}_plate`,
      name: `${first.name} ${second.name} plate`,
      emoji: '🍽️',
      ingredients: [first.id, second.id],
      optional: ['bread', 'rice', 'eggs', 'yogurt'],
      time: 10,
      price: (first.cost || 0.75) + (second.cost || 0.75),
      protein: first.protein + second.protein >= 15 ? 'high' : 'medium',
      tags: ['lazy'],
      why: 'Generated from the foods you added.',
      steps: [`Use ${first.name} and ${second.name}.`, 'Add any staple you have.', 'Season and eat.'],
    });
  }

  return meals;
}

// ── Suggestion engine ──────────────────────────────────────────────────────
// Rank meals by pantry fit, constraints, mode goals, and rough nutrient value.
function suggestMeals({ pantry, mode, maxBudget, maxTime, servings = 1, foodGoal = 'save_money', resolvedIngredients = {}, offset = 0 }) {
  const haveSet = new Set(pantry.map(resolveIngredientId));
  GENERATED_MEALS = makeGenericMeals(pantry, resolvedIngredients);
  const scored = getMealCatalog().map((m) => {
    const required = m.ingredients;
    const haveCount = required.filter((i) => haveSet.has(i)).length;
    const need = required.filter((i) => !haveSet.has(i));
    const optionalHave = (m.optional || []).filter((i) => haveSet.has(i)).length;
    const totalPrice = m.price * servings;
    const inBudget = totalPrice <= maxBudget;
    const inTime = m.time <= maxTime;
    const modeMatch = m.tags.includes(mode);
    const nutrition = mealNutrition(m, servings, resolvedIngredients);
    const haveRatio = haveCount / required.length;
    const caloriesPerEuro = nutrition.kcal / Math.max(totalPrice, 0.5);

    let score = 0;
    score += haveCount * 28;
    score += haveRatio * 32;
    score += optionalHave * 5;
    score += modeMatch ? 22 : 0;
    score += inBudget ? 18 : -35;
    score += inTime ? 16 : -30;
    score -= need.length * 14;
    score += m.source === 'generated' ? 70 : 0;

    if (mode === 'fitness') {
      score += nutrition.protein * 1.7;
      score -= nutrition.kcal > 950 ? 12 : 0;
    }
    if (mode === 'budget') {
      score += Math.min(35, caloriesPerEuro / 8);
      score -= totalPrice * 4;
      score += need.length === 0 ? 18 : 0;
    }
    if (mode === 'lazy') {
      score += Math.max(0, 20 - m.time);
      score -= need.length * 10;
      score += m.time <= 10 ? 12 : 0;
    }
    if (mode === 'student') {
      score += Math.min(30, caloriesPerEuro / 10);
      score += nutrition.protein >= 25 ? 8 : 0;
      score -= totalPrice * 2;
    }

    if (foodGoal === 'save_money') {
      score -= totalPrice * 5;
      score += inBudget ? 10 : -18;
    }
    if (foodGoal === 'more_protein') {
      score += nutrition.protein * 1.4;
      score += nutrition.protein >= 35 * servings ? 14 : 0;
    }
    if (foodGoal === 'use_pantry') {
      score += haveRatio * 35;
      score += need.length === 0 ? 28 : 0;
      score -= need.length * 18;
    }
    if (foodGoal === 'eat_fast') {
      score += Math.max(0, 24 - m.time) * 1.3;
      score += m.time <= 10 ? 18 : 0;
      score -= m.time > maxTime ? 22 : 0;
    }
    if (foodGoal === 'eat_lighter') {
      const kcalPerServing = nutrition.kcal / servings;
      score += Math.max(0, 750 - kcalPerServing) / 18;
      score -= kcalPerServing > 850 ? 24 : 0;
    }

    return { meal: m, score, need, haveCount, modeMatch, inBudget, inTime, nutrition, totalPrice, servings };
  });
  scored.sort((a, b) => b.score - a.score);
  const pool = scored.slice(0, 9);
  const start = pool.length > 3 ? (offset * 3) % pool.length : 0;
  return [...pool.slice(start), ...pool.slice(0, start)].slice(0, 3);
}

Object.assign(window, {
  MODES, PANTRY_DEFAULTS, PANTRY_INDEX, INGREDIENT_FACTS,
  FOOD_GOALS,
  MEALS, setApiMeals, getMealCatalog, getMealById,
  makeGenericMeals,
  normalizeIngredientName, resolveIngredientId,
  getPantryItem, mealNutrition, suggestMeals,
});
