import { db } from './firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';

export const MOCK_PRODUCTS: Record<string, unknown>[] = [
  {
    name: 'Organic Gobar Manure (Cow Dung)',
    category: 'fertilizers',
    price: 120,
    unit: '10kg bag',
    rating: 4.8,
    stock: 500,
    status: 'approved',
    sellerId: 'admin',
    sellerName: 'Kishan Seva Store',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=800&auto=format&fit=crop',
    isOrganic: true,
    description: '100% pure and well-decomposed cow dung manure. Perfect for organic farming, enhances soil fertility and structure.',
    benefits: ['100% Organic', 'Enriches Soil Microbiome', 'Slow Release'],
    deliveryCharge: 0
  },
  {
    name: 'Organic Cow Dung Cakes (Gobar Upla)',
    category: 'fertilizers',
    price: 99,
    unit: 'Pack of 12',
    rating: 4.9,
    stock: 250,
    status: 'approved',
    sellerId: 'admin',
    sellerName: 'Kishan Seva Store',
    image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=800&auto=format&fit=crop',
    isOrganic: true,
    description: 'Traditionally prepared sun-dried organic cow dung cakes from desi cows. Ideal for religious ceremonies, havan, and natural heating.',
    benefits: ['Eco-friendly Fuel', 'Sun Dried', 'Desi Cow Dung'],
    deliveryCharge: 20
  },
  {
    name: 'Premium Organic Wheat Seeds',
    category: 'seeds',
    price: 240,
    unit: '5kg pack',
    rating: 4.7,
    stock: 150,
    status: 'approved',
    sellerId: 'admin',
    sellerName: 'Kishan Seva Store',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800&auto=format&fit=crop',
    isOrganic: true,
    description: 'High-germination certified organic wheat seeds. Treated naturally to prevent seed-borne diseases.',
    benefits: ['High Germination Rate', 'Chemically Untreated', 'Premium Quality'],
    deliveryCharge: 0
  },
  {
    name: 'Organic Mustard Seeds (Sarso)',
    category: 'seeds',
    price: 120,
    unit: '1kg pack',
    rating: 4.8,
    stock: 200,
    status: 'approved',
    sellerId: 'admin',
    sellerName: 'Kishan Seva Store',
    image: 'https://images.unsplash.com/photo-1600122971206-886981882103?q=80&w=800&auto=format&fit=crop',
    isOrganic: true,
    description: '100% natural and untreated mustard seeds. Perfect for oil extraction and organic cultivation.',
    benefits: ['High Oil Yield', '100% Natural', 'Untreated Seeds'],
    deliveryCharge: 0
  },
  {
    name: 'Organic Vegetable Seeds Combo',
    category: 'seeds',
    price: 180,
    unit: '5 variety packets',
    rating: 4.9,
    stock: 300,
    status: 'approved',
    sellerId: 'admin',
    sellerName: 'Kishan Seva Store',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800&auto=format&fit=crop',
    isOrganic: true,
    description: 'A collection of 5 essential organic vegetable seeds (Tomato, Chilli, Brinjal, Ladies Finger, Coriander) for home gardening.',
    benefits: ['5 Organic Varieties', 'High Germination', 'Ideal for Kitchen Garden'],
    deliveryCharge: 20
  }
];

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
