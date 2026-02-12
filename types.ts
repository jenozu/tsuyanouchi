export interface ProductSize {
  label: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // Selling Price
  cost?: number; // Cost of Goods Sold (COGS)
  category: string;
  imageUrl: string;
  stock: number;
  sizes?: ProductSize[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: ProductSize;
}

export enum ViewState {
  HOME = 'HOME',
  SHOP = 'SHOP',
  ADMIN = 'ADMIN',
  PRODUCT = 'PRODUCT',
  FAVOURITES = 'FAVOURITES',
  ACCOUNT = 'ACCOUNT'
}

export type AdminTab = 'DASHBOARD' | 'PRODUCTS' | 'SETTINGS';