import { readFile } from 'node:fs/promises';

export async function fetchFromLocalDatabase() {
  try {
    const raw = await readFile(new URL('../../data/meals.local.json', import.meta.url), 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
