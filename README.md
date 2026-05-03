# MealPick

A mobile-first meal decision app prototype. It suggests three meals based on pantry ingredients, budget, time, and mode.

## Run

```bash
node server.mjs
```

Then open:

- `http://localhost:5173/MealPick.html` for the app
- `http://localhost:5173/MealPick.html?canvas` for the Claude design canvas
- `http://localhost:5173/api/meals` for the unified meals API

The frontend calls only the local backend (`/api/meals`). The backend decides whether meals come from TheMealDB, `data/meals.local.json`, or the built-in frontend fallback catalog.

Data source mode:

```bash
MEAL_SOURCE=hybrid node server.mjs  # default
MEAL_SOURCE=api node server.mjs     # TheMealDB only
MEAL_SOURCE=local node server.mjs   # data/meals.local.json only
```

USDA ingredient resolving:

```bash
USDA_API_KEY=your_key node server.mjs
```

Or create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Then edit `.env`:

```text
PORT=5175
MEAL_SOURCE=hybrid
USDA_API_KEY=your_key
THEMEALDB_API_KEY=1
```

And run:

```bash
node server.mjs
```

Without `USDA_API_KEY`, `/api/ingredients/resolve` still returns a small fallback category/nutrition estimate for common custom ingredients such as salmon, tofu, zucchini, broccoli, quinoa, and mango.

The prototype uses React and Babel from CDN, so the browser needs internet access on first load. The TheMealDB source also needs network access from the backend.

## What Works

- Home input screen with mode, budget, time, and pantry summary
- Results screen with one top pick and two alternatives
- Meal detail with ingredients, steps, and cost breakdown
- Pantry editing with local storage and custom ingredients
- Saved/history tab for confirmed meals
- Backend abstraction layer for API → database migration
- USDA-style ingredient resolver for custom pantry items
