import { mapUsdaFoodToIngredient } from '../mappers/usdaIngredientMapper.mjs';

const BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

export async function resolveWithUsda(query) {
  const apiKey = process.env.USDA_API_KEY;
  if (!apiKey || apiKey === 'put_your_usda_key_here') {
    return mapUsdaFoodToIngredient(query, null);
  }

  const url = new URL(`${BASE_URL}/foods/search`);
  url.searchParams.set('query', query);
  url.searchParams.set('pageSize', '1');
  url.searchParams.set('dataType', 'Foundation,SR Legacy,Survey (FNDDS)');
  url.searchParams.set('api_key', apiKey);

  const response = await fetch(url);
  if (!response.ok) throw new Error(`USDA request failed: ${response.status}`);

  const data = await response.json();
  return mapUsdaFoodToIngredient(query, data.foods?.[0] || null);
}
