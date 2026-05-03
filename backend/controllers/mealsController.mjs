import { getMeals } from '../services/mealService.mjs';

export async function handleMealsRequest(request, response) {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const ingredients = (url.searchParams.get('ingredients') || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  const meals = await getMeals({ ingredients });
  response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify({ meals }));
}
