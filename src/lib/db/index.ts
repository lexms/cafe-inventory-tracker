import { createRxDatabase, addRxPlugin } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { inventorySchema } from './schema';

// Define database schema types
export type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  date: string;
  createdAt: number;
};

export type InventoryDatabase = {
  inventoryItems: {
    find: Function;
    insert: Function;
    findOne: Function;
    update: Function;
    remove: Function;
  };
};

let dbPromise: Promise<InventoryDatabase> | null = null;

export const getDB = async (): Promise<InventoryDatabase> => {
  if (dbPromise) return dbPromise;

  dbPromise = createRxDatabase({
    name: 'cafeInventoryDB',
    storage: getRxStorageDexie(),
  }).then(async (db) => {
    // Create collections
    await db.addCollections({
      inventoryItems: {
        schema: inventorySchema,
      },
    });

    return db as unknown as InventoryDatabase;
  });

  return dbPromise;
};

// Helper functions for inventory management
export const addInventoryItem = async (item: Omit<InventoryItem, 'id' | 'createdAt'>) => {
  const db = await getDB();
  const id = `item_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  
  const newItem = {
    id,
    ...item,
    createdAt: Date.now(),
  };
  
  await db.inventoryItems.insert(newItem);
  return newItem;
};

export const getInventoryItems = async () => {
  const db = await getDB();
  const items = await db.inventoryItems.find().sort({ createdAt: 'desc' }).exec();
  return items;
}; 