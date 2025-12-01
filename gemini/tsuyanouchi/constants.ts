import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Obsidian Vase',
    description: 'Hand-carved volcanic glass vase with a matte finish. Perfect for minimalist arrangements.',
    price: 1250,
    cost: 450,
    category: 'Home Decor',
    imageUrl: 'https://picsum.photos/id/24/800/800',
    stock: 5,
    sizes: []
  },
  {
    id: 'p2',
    name: 'Ukiyo-e Print: The Wave',
    description: 'High-quality Giclée print on archival rice paper. Capturing the essence of the floating world.',
    price: 45,
    cost: 12,
    category: 'Art Prints',
    imageUrl: 'https://picsum.photos/id/22/800/800',
    stock: 50,
    sizes: [
        { label: '8" x 10"', price: 45 },
        { label: '11" x 14"', price: 55 },
        { label: '16" x 20"', price: 75 },
        { label: '24" x 36"', price: 120 }
    ]
  },
  {
    id: 'p3',
    name: 'Ceramic Tea Set',
    description: 'Wabi-sabi inspired tea set including a pot and four cups. Earthy tones and organic shapes.',
    price: 340,
    cost: 120,
    category: 'Kitchen',
    imageUrl: 'https://picsum.photos/id/225/800/800',
    stock: 8,
    sizes: []
  },
  {
    id: 'p4',
    name: 'Sandalwood Incense',
    description: 'Aged sandalwood incense sticks from Kyoto. Creates a calming atmosphere for meditation.',
    price: 45,
    cost: 15,
    category: 'Wellness',
    imageUrl: 'https://picsum.photos/id/364/800/800',
    stock: 100,
    sizes: [
        { label: 'Box of 20', price: 45 },
        { label: 'Box of 50', price: 90 }
    ]
  },
  {
    id: 'p5',
    name: 'Japanese Garden Print',
    description: 'A serene depiction of a traditional garden in autumn. Muted pigments on textured paper.',
    price: 48,
    cost: 14,
    category: 'Art Prints',
    imageUrl: 'https://picsum.photos/id/433/800/800',
    stock: 25,
     sizes: [
        { label: '8" x 10"', price: 48 },
        { label: '12" x 18"', price: 65 },
        { label: '18" x 24"', price: 85 }
    ]
  },
];

export const APP_NAME = "Tsuyanouchi";