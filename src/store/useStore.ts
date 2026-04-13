import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Idol, Order, CartItem } from '@/types/idol';
import idolGanesha from '@/assets/idol-ganesha.jpg';
import idolGanesha2 from '@/assets/idol-ganesha-2.jpg';
import idolGanesha3 from '@/assets/idol-ganesha-3.jpg';
import idolLakshmi from '@/assets/idol-lakshmi.jpg';
import idolLakshmi2 from '@/assets/idol-lakshmi-2.jpg';
import idolLakshmi3 from '@/assets/idol-lakshmi-3.jpg';
import idolShiva from '@/assets/idol-shiva.jpg';
import idolShiva2 from '@/assets/idol-shiva-2.jpg';
import idolShiva3 from '@/assets/idol-shiva-3.jpg';
import idolKrishna from '@/assets/idol-krishna.jpg';
import idolKrishna2 from '@/assets/idol-krishna-2.jpg';
import idolKrishna3 from '@/assets/idol-krishna-3.jpg';
import idolHanuman from '@/assets/idol-hanuman.jpg';
import idolHanuman2 from '@/assets/idol-hanuman-2.jpg';
import idolHanuman3 from '@/assets/idol-hanuman-3.jpg';
import idolSaraswati from '@/assets/idol-saraswati.jpg';
import idolSaraswati2 from '@/assets/idol-saraswati-2.jpg';
import idolSaraswati3 from '@/assets/idol-saraswati-3.jpg';

const SAMPLE_IDOLS: Idol[] = [
  {
    id: '1',
    name: 'Lord Ganesha Brass Idol',
    category: 'Ganesha',
    material: 'Pure Brass',
    height: '6 inches',
    price: 2499,
    originalPrice: 3500,
    rating: 4.8,
    images: [idolGanesha, idolGanesha2, idolGanesha3],
    description: 'Beautifully handcrafted Lord Ganesha brass idol, blessed by priests. Perfect for home temple and gifting. Each piece is unique with intricate detailing.',
    featured: true,
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Goddess Lakshmi Brass Idol',
    category: 'Lakshmi',
    material: 'Pure Brass',
    height: '7 inches',
    price: 2999,
    originalPrice: 4000,
    rating: 4.9,
    images: [idolLakshmi, idolLakshmi2, idolLakshmi3],
    description: 'Exquisite Goddess Lakshmi idol crafted in pure brass. Brings prosperity and blessings to your home.',
    featured: true,
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Lord Shiva Nataraja Idol',
    category: 'Shiva',
    material: 'Bronze',
    height: '8 inches',
    price: 3499,
    originalPrice: 4500,
    rating: 4.7,
    images: [idolShiva, idolShiva2, idolShiva3],
    description: 'Majestic Lord Shiva in Nataraja form. Bronze crafted with divine precision.',
    featured: true,
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Lord Krishna with Flute',
    category: 'Krishna',
    material: 'Pure Brass',
    height: '5 inches',
    price: 1999,
    originalPrice: 2800,
    rating: 4.6,
    images: [idolKrishna, idolKrishna2, idolKrishna3],
    description: 'Charming Lord Krishna playing flute. Handcrafted in pure brass with antique finish.',
    featured: true,
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Hanuman Ji Brass Idol',
    category: 'Hanuman',
    material: 'Pure Brass',
    height: '6 inches',
    price: 2199,
    originalPrice: 3000,
    rating: 4.8,
    images: [idolHanuman, idolHanuman2, idolHanuman3],
    description: 'Powerful Hanuman Ji idol in pure brass. Symbol of strength and devotion.',
    featured: false,
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Goddess Saraswati Idol',
    category: 'Saraswati',
    material: 'Marble',
    height: '9 inches',
    price: 4500,
    originalPrice: 5500,
    rating: 4.9,
    images: [idolSaraswati, idolSaraswati2, idolSaraswati3],
    description: 'Elegant Goddess Saraswati in white marble. Brings wisdom and knowledge to your home.',
    featured: false,
    inStock: true,
    createdAt: new Date().toISOString(),
  },
];

interface Customer {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface StoreState {
  idols: Idol[];
  orders: Order[];
  cart: CartItem[];
  isAdminLoggedIn: boolean;
  customers: Customer[];
  currentCustomer: Customer | null;
  addIdol: (idol: Idol) => void;
  updateIdol: (id: string, idol: Partial<Idol>) => void;
  deleteIdol: (id: string) => void;
  addToCart: (idol: Idol, quantity?: number) => void;
  removeFromCart: (idolId: string) => void;
  updateCartQuantity: (idolId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  loginAdmin: (email: string, password: string) => boolean;
  logoutAdmin: () => void;
  registerCustomer: (name: string, email: string, phone: string, password: string) => boolean;
  loginCustomer: (email: string, password: string) => boolean;
  logoutCustomer: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      idols: SAMPLE_IDOLS,
      orders: [],
      cart: [],
      isAdminLoggedIn: false,
      customers: [],
      currentCustomer: null,

      addIdol: (idol) => set((s) => ({ idols: [...s.idols, idol] })),
      updateIdol: (id, data) =>
        set((s) => ({ idols: s.idols.map((i) => (i.id === id ? { ...i, ...data } : i)) })),
      deleteIdol: (id) => set((s) => ({ idols: s.idols.filter((i) => i.id !== id) })),

      addToCart: (idol, quantity = 1) =>
        set((s) => {
          const existing = s.cart.find((c) => c.idol.id === idol.id);
          if (existing) {
            return { cart: s.cart.map((c) => (c.idol.id === idol.id ? { ...c, quantity: c.quantity + quantity } : c)) };
          }
          return { cart: [...s.cart, { idol, quantity }] };
        }),
      removeFromCart: (idolId) => set((s) => ({ cart: s.cart.filter((c) => c.idol.id !== idolId) })),
      updateCartQuantity: (idolId, quantity) =>
        set((s) => ({
          cart: quantity <= 0 ? s.cart.filter((c) => c.idol.id !== idolId) : s.cart.map((c) => (c.idol.id === idolId ? { ...c, quantity } : c)),
        })),
      clearCart: () => set({ cart: [] }),

      placeOrder: (order) => set((s) => ({ orders: [order, ...s.orders] })),
      updateOrderStatus: (orderId, status) =>
        set((s) => ({ orders: s.orders.map((o) => (o.id === orderId ? { ...o, status } : o)) })),

      loginAdmin: (email, password) => {
        if (email === 'admin.mipar@gmail.com' && password === 'admin123') {
          set({ isAdminLoggedIn: true });
          return true;
        }
        return false;
      },
      logoutAdmin: () => set({ isAdminLoggedIn: false }),

      registerCustomer: (name, email, phone, password) => {
        const exists = get().customers.some((c) => c.email === email);
        if (exists) return false;
        const customer = { name, email, phone, password };
        set((s) => ({ customers: [...s.customers, customer], currentCustomer: customer }));
        return true;
      },
      loginCustomer: (email, password) => {
        const customer = get().customers.find((c) => c.email === email && c.password === password);
        if (customer) {
          set({ currentCustomer: customer });
          return true;
        }
        return false;
      },
      logoutCustomer: () => set({ currentCustomer: null }),
    }),
    { name: 'mipar-store' }
  )
);
