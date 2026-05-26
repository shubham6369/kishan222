import { db } from './firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';

export const MOCK_PRODUCTS: any[] = [];

export async function seedProducts() {
  if (MOCK_PRODUCTS.length === 0) {
    console.log('No mock products to seed.');
    return;
  }
  const batch = writeBatch(db);
  const productsRef = collection(db, 'products');

  MOCK_PRODUCTS.forEach((product) => {
    const newDocRef = doc(productsRef);
    batch.set(newDocRef, {
      ...product,
      createdAt: new Date().toISOString()
    });
  });

  await batch.commit();
  console.log('Database seeded successfully with agricultural products!');
}
