
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string; // Primary image for backward compatibility and thumbnails
  images: string[]; // Array of all product images including primary
  category: string;
  rating: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Testimonial {
  id: number;
  name: string;
  text: string;
  rating: number;
  role: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface User {
  name: string;
  email: string;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'completed';
  items: CartItem[];
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  paymentMethod?: string;
}

export type OrderStatus = 'pending' | 'completed';
