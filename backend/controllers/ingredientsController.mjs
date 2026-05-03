import { resolveIngredientQuery } from '../services/ingredientService.mjs';

export async function handleIngredientResolveRequest(request, response) {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const query = url.searchParams.get('query') || '';

  if (!query.trim()) {
    response.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify({ error: 'query is required' }));
    return;
  }

  const ingredient = await resolveIngredientQuery(query);
  response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify({ ingredient }));
}
