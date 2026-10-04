export type UserRole = 'customer' | 'seller' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  city?: string;
  address?: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  description: string;
  created_at?: string;
}

export type ProductStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export interface Product {
  id: string;
  seller_id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price?: number;
  stock_quantity: number;
  image_urls: string[];
  material: string;
  origin_city: string; // e.g., 'Karimabad, Hunza', 'Gilgit', 'Skardu', 'Gojal', 'Nagar', 'Khaplu'
  is_featured: boolean;
  status: ProductStatus;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at?: string;
  seller_name?: string;
  category_name?: string;
}

export interface CartItem {
  id: string;
  user_id?: string;
  product_id: string;
  quantity: number;
  product: Product;
  created_at?: string;
}

export interface WishlistItem {
  id: string;
  user_id?: string;
  product_id: string;
  product: Product;
  created_at?: string;
}

export type PaymentMethod = 'cod' | 'bank_transfer' | 'easypaisa_jazzcash';
export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type OrderStatus = 'placed' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  full_name: string;
  phone: string;
  city: string;
  delivery_address: string;
  notes?: string;
  total_amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  items?: OrderItem[];
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  seller_id: string;
  product_name: string;
  product_image: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

export interface Review {
  id: string;
  user_id: string;
  user_name: string;
  product_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface SellerApplication {
  id: string;
  user_id: string;
  user_email?: string;
  user_name?: string;
  business_name: string;
  description: string;
  city: string;
  phone: string;
  product_type: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
}

export interface ArtisanSeller {
  id: string;
  name: string;
  location: string;
  specialty: string;
  bio: string;
  avatar_url: string;
  experience_years: number;
  story: string;
}
