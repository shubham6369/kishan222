import { db } from './firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';

const MOCK_PRODUCTS = [
  {
    name: 'Pure Sharbati Wheat',
    category: 'Grains',
    price: 1200,
    unit: '25kg',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800&auto=format&fit=crop',
    farmer: 'Shivram Yadav',
    isOrganic: true,
    description: 'Traditional Sharbati wheat grown without synthetic fertilizers. Known for its soft texture and nutritional value.',
    benefits: ['Rich in Protein', 'Chemical Free', 'Easy to Digest']
  },
  {
    name: 'Raw Forest Honey',
    category: 'Dairy & Sweeteners',
    price: 450,
    unit: '500g',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800&auto=format&fit=crop',
    farmer: 'Amrita Devi',
    isOrganic: true,
    description: 'Multi-floral honey collected from protected forest areas. Unprocessed and nutrient-dense.',
    benefits: ['Natural Antioxidant', 'Immunity Booster', 'Pure & Raw']
  },
  {
    name: 'Organic Desi Ghee',
    category: 'Dairy & Sweeteners',
    price: 850,
    unit: '1L',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1631557053051-5121f1d19888?q=80&w=800&auto=format&fit=crop',
    farmer: 'Kishan Seva Cooperative',
    isOrganic: true,
    description: 'A2 cow ghee made using traditional Bilona method. Packed with vitamins and healthy fats.',
    benefits: ['A2 Quality', 'Hand-churned', 'Nutritious']
  }
];

export async function seedProducts() {
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
  console.log('Database seeded successfully!');
}
