
import { Product, Order, CartItem } from '../types';
import { PRODUCTS } from '../constants';

const PRODUCTS_KEY = 'argania_products_db';
const ORDERS_KEY = 'argania_orders_db';

// Initialize DB with default products if empty
export const initDB = () => {
  const storedProducts = localStorage.getItem(PRODUCTS_KEY);
  if (!storedProducts) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(PRODUCTS));
  }
};

// --- Products Operations ---

export const getProducts = (): Product[] => {
  const stored = localStorage.getItem(PRODUCTS_KEY);
  return stored ? JSON.parse(stored) : PRODUCTS;
};

export const saveProduct = (product: Product) => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === product.id);
  
  if (index >= 0) {
    // Update existing
    products[index] = product;
  } else {
    // Add new
    product.id = Date.now(); // Generate ID
    products.push(product);
  }
  
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  return products;
};

export const deleteProduct = (id: number) => {
  const products = getProducts().filter(p => p.id !== id);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  return products;
};

// --- Orders Operations ---

export const getOrders = (): Order[] => {
  const stored = localStorage.getItem(ORDERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getOrdersByEmail = (email: string): Order[] => {
  const orders = getOrders();
  return orders.filter(o => o.email === email);
};

export const saveOrder = (cart: CartItem[], customer: any, total: number) => {
  const orders = getOrders();
  const newOrder: Order = {
    id: `ORD-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString(),
    total: total,
    status: 'pending',
    items: cart,
    // Store customer info inside the order object
    ...customer
  };
  
  orders.unshift(newOrder); // Add to top
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  return newOrder;
};

export const updateOrderStatus = (id: string, status: 'pending' | 'completed') => {
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === id);
  if (index >= 0) {
    orders[index].status = status;
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }
  return orders;
};

export const deleteOrder = (id: string) => {
  const orders = getOrders().filter(o => o.id !== id);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  return orders;
};
