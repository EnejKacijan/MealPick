import { readFile, writeFile } from 'node:fs/promises';
import { resolveWithUsda } from './usdaIngredientSource.mjs';
import { normalizeIngredientQuery } from '../mappers/usdaIngredientMapper.mjs';

const CACHE_URL = new URL('../../data/ingredients.local.json', import.meta.url);

async function readCache() {
  try {
    return JSON.parse(await readFile(CACHE_URL, 'utf8'));
  } catch {
    return {};
  }
}

async function writeCache(cache) {
  await writeFile(CACHE_URL, JSON.stringify(cache, null, 2));
}

export async function resolveIngredient(query) {
  const key = normalizeIngredientQuery(query);
  const cache = await readCache();
  if (cache[key]) return cache[key];

  const ingredient = await resolveWithUsda(query);
  cache[key] = ingredient;
  await writeCache(cache);
  return ingredient;
}
