import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'kage-cache';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('exercises')) {
          db.createObjectStore('exercises', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('programs')) {
          db.createObjectStore('programs', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

export async function cacheExercises(exercises: unknown[]): Promise<void> {
  const db = await getDb();
  const tx = db.transaction('exercises', 'readwrite');
  for (const ex of exercises) {
    await tx.store.put(ex);
  }
  await tx.done;
}

export async function getCachedExercises<T>(): Promise<T[]> {
  const db = await getDb();
  return (await db.getAll('exercises')) as T[];
}

export async function cachePrograms(programs: unknown[]): Promise<void> {
  const db = await getDb();
  const tx = db.transaction('programs', 'readwrite');
  for (const p of programs) {
    await tx.store.put(p);
  }
  await tx.done;
}

export async function getCachedPrograms<T>(): Promise<T[]> {
  const db = await getDb();
  return (await db.getAll('programs')) as T[];
}

export async function clearCache(): Promise<void> {
  const db = await getDb();
  await db.clear('exercises');
  await db.clear('programs');
}
