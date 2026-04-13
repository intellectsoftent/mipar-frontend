export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
  sort_order: number;
}

export interface ReviewProps {
  id: number;
  rating: number;
  comment: string;
  user?: { id: number; name: string; profile_image?: string };
  created_at: string;
}

export interface Idol {
  id: string | number;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  price: number;
  sale_price?: number;
  stock_quantity: number;
  stock_status: 'in_stock' | 'out_of_stock' | 'on_backorder';
  category_id: number;
  category?: Category;
  images?: ProductImage[];
  weight?: number;
  dimensions?: string;
  material?: string;
  deity?: string;
  is_featured: boolean;
  is_active: boolean;
  is_bestseller: boolean;
  rating_avg: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
  reviews?: ReviewProps[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  profile_image?: string;
  created_at: string;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'refunded';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method: string;
  subtotal: number;
  discount_amount: number;
  shipping_amount: number;
  tax_amount: number;
  total_amount: number;
  shipping_name: string;
  shipping_phone: string;
  shipping_address_line1: string;
  shipping_address_line2?: string;
  shipping_city: string;
  shipping_state: string;
  shipping_pincode: string;
  shipping_country: string;
  notes?: string;
  cancelled_reason?: string;
  delivered_at?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  product_image?: string;
  product_sku?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  price_at_add: number;
  product?: Idol;
}
