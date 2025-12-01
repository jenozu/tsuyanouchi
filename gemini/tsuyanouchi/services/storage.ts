import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../constants';

const PRODUCTS_KEY = 'tsuyanouchi_products';

export const getProducts = (): Product[] => {
  const stored = localStorage.getItem(PRODUCTS_KEY);
  if (!stored) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  return JSON.parse(stored);
};

export const saveProduct = (product: Product): void => {
  const products = getProducts();
  const existingIndex = products.findIndex((p) => p.id === product.id);
  
  if (existingIndex >= 0) {
    products[existingIndex] = product;
  } else {
    products.push(product);
  }
  
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const saveProducts = (newProducts: Product[]): void => {
  const currentProducts = getProducts();
  const updatedProducts = [...currentProducts, ...newProducts];
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));
};

export const deleteProduct = (id: string): void => {
  const products = getProducts();
  const filtered = products.filter((p) => p.id !== id);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(filtered));
};

export const resetData = (): void => {
  localStorage.removeItem(PRODUCTS_KEY);
  window.location.reload();
};