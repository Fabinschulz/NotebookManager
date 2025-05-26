import { db } from './db';
import { NewNotebook, notebooks } from './schema';

async function main() {
  const newNotebook: NewNotebook = {
    userName: 'Fábio',
    brand: 'Dell',
    ram: '16GB',
    processor: 'i7',
    storageType: 'SSD',
    storageSize: '512GB',
    phoneNumber: '(11) 99999-9999'
  };

  const res = await db.insert(notebooks).values(newNotebook).returning();
  console.log('Seeded notebook:', res);
}

main();
