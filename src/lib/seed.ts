import { db } from './firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';

export const MOCK_PRODUCTS = [
  {
    name: 'Hybrid Paddy Seeds (PR-126)',
    category: 'seeds',
    price: 480,
    unit: '5kg bag',
    rating: 4.8,
    stock: 150,
    status: 'approved',
    sellerId: 'admin',
    sellerName: 'Kishan Seva Store',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800&auto=format&fit=crop',
    isOrganic: false,
    description: 'High-yield hybrid paddy seeds suitable for kharif season. Resistant to blast disease and stem borer. Produces 35-40 quintals per acre under good management.',
    benefits: ['High Yield', 'Disease Resistant', 'Short Duration (125 days)'],
    deliveryCharge: 0
  },
  {
    name: 'NPK Granular Fertilizer (19:19:19)',
    category: 'fertilizers',
    price: 1350,
    unit: '50kg bag',
    rating: 4.7,
    stock: 200,
    status: 'approved',
    sellerId: 'admin',
    sellerName: 'Kishan Seva Store',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=800&auto=format&fit=crop',
    isOrganic: false,
    description: 'Balanced NPK water-soluble granular fertilizer in 19:19:19 ratio. Ideal for all crops at the vegetative growth stage. Promotes root development and uniform crop growth.',
    benefits: ['Balanced Nutrition', 'Water Soluble', 'Boosts Root Growth'],
    deliveryCharge: 50
  },
  {
    name: 'Neem Oil Bio-Pesticide Spray',
    category: 'pesticides',
    price: 320,
    unit: '1 litre',
    rating: 4.9,
    stock: 80,
    status: 'approved',
    sellerId: 'admin',
    sellerName: 'Kishan Seva Store',
    image: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?q=80&w=800&auto=format&fit=crop',
    isOrganic: true,
    description: 'Cold-pressed pure neem oil (Azadirachtin 3000ppm). Effective against aphids, whiteflies, mites, and fungal diseases. Safe for bees and beneficial insects when used as directed.',
    benefits: ['100% Organic', 'Broad Spectrum', 'Safe for Pollinators'],
    deliveryCharge: 0
  },
  {
    name: 'Premium Basmati Rice',
    category: 'grains',
    price: 120,
    unit: '1kg',
    rating: 4.9,
    stock: 500,
    status: 'approved',
    sellerId: 'admin',
    sellerName: 'Kishan Seva Store',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800&auto=format&fit=crop',
    isOrganic: true,
    description: 'Traditional long-grain Basmati rice, aged to perfection. Naturally grown and processed with minimal intervention.',
    benefits: ['Aged', 'Natural', 'Non-GMO'],
    deliveryCharge: 0
  },
  {
    name: 'Vermicompost Organic Manure',
    category: 'fertilizers',
    price: 280,
    unit: '25kg bag',
    rating: 5.0,
    stock: 300,
    status: 'approved',
    sellerId: 'admin',
    sellerName: 'Kishan Seva Store',
    image: 'https://images.unsplash.com/photo-1603912699214-92627f304eb6?q=80&w=800&auto=format&fit=crop',
    isOrganic: true,
    description: 'Premium quality vermicompost prepared from organic cow dung and crop residues. Rich in humus, macro and micro nutrients. Improves soil structure, water retention and beneficial microbial activity.',
    benefits: ['100% Organic', 'Improves Soil Health', 'Slow Release Nutrients'],
    deliveryCharge: 0
  },
  {
    name: 'Organic Farm Fresh Tomatoes',
    category: 'fresh',
    price: 45,
    unit: '1kg',
    rating: 4.7,
    stock: 200,
    status: 'approved',
    sellerId: 'admin',
    sellerName: 'Kishan Seva Store',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800&auto=format&fit=crop',
    isOrganic: true,
    description: 'Juicy, farm-fresh organic tomatoes grown without synthetic pesticides. Rich in Lycopene and vitamin C.',
    benefits: ['Chemical Free', 'Farm Fresh', 'High Nutrition'],
    deliveryCharge: 20
  },
  {
    name: 'Organic Turmeric Finger',
    category: 'fresh',
    price: 220,
    unit: '1kg',
    rating: 4.9,
    stock: 300,
    status: 'approved',
    sellerId: 'admin',
    sellerName: 'Kishan Seva Store',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=800&auto=format&fit=crop',
    isOrganic: true,
    description: 'High-curcumin organic turmeric fingers. Directly sourced from farmers following traditional organic methods.',
    benefits: ['High Curcumin', 'Natural Antiseptic', 'Direct from Farm'],
    deliveryCharge: 0
  },
  {
    name: 'Hybrid Mustard Seeds (Varuna)',
    category: 'seeds',
    price: 420,
    unit: '2kg pack',
    rating: 4.7,
    stock: 180,
    status: 'approved',
    sellerId: 'admin',
    sellerName: 'Kishan Seva Store',
    image: 'https://images.unsplash.com/photo-1600122971206-886981882103?q=80&w=800&auto=format&fit=crop',
    isOrganic: false,
    description: 'High-yield hybrid mustard seeds. Resistant to white rust and powdery mildew. Oil content approx 40-42%.',
    benefits: ['High Oil Content', 'Disease Resistant', 'Fast Maturity'],
    deliveryCharge: 0
  },
  {
    name: 'Organic Black Gram (Urad)',
    category: 'grains',
    price: 160,
    unit: '1kg pack',
    rating: 4.8,
    stock: 250,
    status: 'approved',
    sellerId: 'admin',
    sellerName: 'Kishan Seva Store',
    image: 'https://images.unsplash.com/photo-1585914924626-45adac9e6b42?q=80&w=800&auto=format&fit=crop',
    isOrganic: true,
    description: 'Unpolished organic black gram. Rich in protein and iron. Grown using natural fertilizers in the Bundelkhand region.',
    benefits: ['High Protein', 'Unpolished', 'Naturally Grown'],
    deliveryCharge: 0
  },
  {
    name: 'Bio-Fertilizer (Azotobacter)',
    category: 'fertilizers',
    price: 180,
    unit: '500ml',
    rating: 4.6,
    stock: 150,
    status: 'approved',
    sellerId: 'admin',
    sellerName: 'Kishan Seva Store',
    image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=800&auto=format&fit=crop',
    isOrganic: true,
    description: 'Bacterial bio-fertilizer that fixes atmospheric nitrogen in the soil. Enhances seed germination and plant growth.',
    benefits: ['Nitrogen Fixing', 'Eco Friendly', 'Cost Effective'],
    deliveryCharge: 0
  },
  {
    name: 'Bt Cotton Seeds (Hybrid)',
    category: 'seeds',
    price: 860,
    unit: '450g pack',
    rating: 4.7,
    stock: 100,
    status: 'approved',
    sellerId: 'admin',
    sellerName: 'Kishan Seva Store',
    image: 'https://images.unsplash.com/photo-1594903582424-8146449a7a11?q=80&w=800&auto=format&fit=crop',
    isOrganic: false,
    description: 'Bollgard II technology Bt cotton seeds. Excellent resistance to American Bollworm and other pests. High boll weight and superior fiber quality.',
    benefits: ['Pest Resistant', 'High Boll Weight', 'Quality Fiber'],
    deliveryCharge: 50
  },
  {
    name: 'Farm Fresh Organic Potatoes',
    category: 'fresh',
    price: 35,
    unit: '1kg',
    rating: 4.8,
    stock: 500,
    status: 'approved',
    sellerId: 'admin',
    sellerName: 'Kishan Seva Store',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=800&auto=format&fit=crop',
    isOrganic: true,
    description: 'Soil-grown organic potatoes, harvested fresh. No synthetic fertilizers used.',
    benefits: ['Fresh Harvest', 'Chemical Free', 'Great Taste'],
    deliveryCharge: 10
  },
  {
    name: 'Sunflower Seeds (Hybrid)',
    category: 'seeds',
    price: 750,
    unit: '1kg pack',
    rating: 4.8,
    stock: 100,
    status: 'approved',
    sellerId: 'admin',
    sellerName: 'Kishan Seva Store',
    image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=800&auto=format&fit=crop',
    isOrganic: false,
    description: 'High-oil content hybrid sunflower seeds. Suitable for all seasons with good irrigation.',
    benefits: ['High Oil Yield', 'All Season', 'Drought Tolerant'],
    deliveryCharge: 0
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
  console.log('Database seeded successfully with agricultural products!');
}
