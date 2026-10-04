import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  Product, Category, CartItem, WishlistItem, Order, OrderItem, 
  Review, SellerApplication, ContactMessage, UserProfile, UserRole, OrderStatus, ProductStatus
} from '../types';
import { SEED_CATEGORIES, SEED_PRODUCTS, SEED_REVIEWS } from '../data/seedData';

// Local storage keys for state persistence
const STORAGE_KEYS = {
  PRODUCTS: 'hh_products',
  CATEGORIES: 'hh_categories',
  CART: 'hh_cart',
  WISHLIST: 'hh_wishlist',
  ORDERS: 'hh_orders',
  REVIEWS: 'hh_reviews',
  APPLICATIONS: 'hh_applications',
  MESSAGES: 'hh_messages',
  AUTH_USER: 'hh_auth_user',
  PROFILES: 'hh_profiles',
};

// Seed profiles
const SEED_PROFILES: UserProfile[] = [
  {
    id: 'user-admin-1',
    email: 'admin@hunzaheritage.com',
    full_name: 'Hunza Heritage Admin',
    role: 'admin',
    city: 'Gilgit',
    phone: '+92 300 1234567',
    address: 'Bazaar Road, Gilgit City',
    created_at: new Date().toISOString()
  },
  {
    id: 'user-seller-1',
    email: 'seller@hunzaheritage.com',
    full_name: 'Bibi Fatima Gulmiti',
    role: 'seller',
    city: 'Gulmit, Upper Hunza',
    phone: '+92 312 9876543',
    address: 'Old Silk Route Handicrafts Centre, Gulmit',
    created_at: new Date().toISOString()
  },
  {
    id: 'user-customer-1',
    email: 'customer@hunzaheritage.com',
    full_name: 'Ali Raza',
    role: 'customer',
    city: 'Islamabad',
    phone: '+92 333 5551234',
    address: 'Sector F-7/2, Islamabad',
    created_at: new Date().toISOString()
  }
];

// Helper to initialize local persistent storage if empty
function getLocalData<T>(key: string, defaultData: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(item) as T;
  } catch {
    return defaultData;
  }
}

function setLocalData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('LocalStorage write error', err);
  }
}

// Initializing state
export function initializeLocalStore() {
  getLocalData(STORAGE_KEYS.CATEGORIES, SEED_CATEGORIES);
  getLocalData(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
  getLocalData(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
  getLocalData(STORAGE_KEYS.PROFILES, SEED_PROFILES);
  getLocalData(STORAGE_KEYS.ORDERS, []);
  getLocalData(STORAGE_KEYS.APPLICATIONS, [
    {
      id: 'app-demo-1',
      user_id: 'user-customer-1',
      user_name: 'Sultan Karim',
      user_email: 'sultan@karimabad.pk',
      business_name: 'Baltit Wood Art',
      description: 'Handcarving local apricot and walnut wood panels, kitchen utensils, and miniature fort models.',
      city: 'Karimabad, Hunza',
      phone: '+92 313 4455667',
      product_type: 'Home Décor & Woodcraft',
      status: 'pending',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ]);
  getLocalData(STORAGE_KEYS.MESSAGES, [
    {
      id: 'msg-demo-1',
      name: 'Dr. Katherine Wood',
      email: 'katherine@heritagefoundation.org',
      subject: 'Inquiry on Bulk Handwoven Shawls for cultural exhibition',
      message: 'Hello Hunza Heritage, we are organizing an international textiles symposium in London and would love to acquire 15 certified handwoven Hunza shawls. Could you provide certification of origin?',
      status: 'new',
      created_at: new Date(Date.now() - 3600000 * 8).toISOString()
    }
  ]);
}

// Ensure store is primed
initializeLocalStore();

// ================= AUTH & PROFILES =================

export const dbAuth = {
  getCurrentUser: (): UserProfile | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      if (stored) return JSON.parse(stored);
      return null;
    } catch {
      return null;
    }
  },

  login: async (email: string, _password: string): Promise<UserProfile> => {
    // If Supabase is configured
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: _password
      });
      if (error) throw new Error(error.message);
      if (data.user) {
        // Fetch profile
        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        const profile: UserProfile = prof || {
          id: data.user.id,
          email: data.user.email || email,
          full_name: data.user.user_metadata?.full_name || email.split('@')[0],
          role: (data.user.user_metadata?.role as UserRole) || 'customer',
          created_at: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(profile));
        return profile;
      }
    }

    // Fallback: match local profiles or create session
    const profiles = getLocalData<UserProfile[]>(STORAGE_KEYS.PROFILES, SEED_PROFILES);
    const existing = profiles.find(p => p.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(existing));
      return existing;
    }

    // Default guest login creation
    const newProfile: UserProfile = {
      id: 'user-' + Date.now(),
      email,
      full_name: email.split('@')[0],
      role: 'customer',
      city: 'Pakistan',
      created_at: new Date().toISOString()
    };
    profiles.push(newProfile);
    setLocalData(STORAGE_KEYS.PROFILES, profiles);
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(newProfile));
    return newProfile;
  },

  register: async (email: string, _password: string, fullName: string, role: UserRole = 'customer', city?: string): Promise<UserProfile> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: _password,
        options: {
          data: {
            full_name: fullName,
            role: role
          }
        }
      });
      if (error) throw new Error(error.message);
      if (data.user) {
        const newProf: UserProfile = {
          id: data.user.id,
          email,
          full_name: fullName,
          role,
          city: city || 'Gilgit',
          created_at: new Date().toISOString()
        };
        await supabase.from('profiles').upsert(newProf);
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(newProf));
        return newProf;
      }
    }

    const profiles = getLocalData<UserProfile[]>(STORAGE_KEYS.PROFILES, SEED_PROFILES);
    const newProfile: UserProfile = {
      id: 'user-' + Date.now(),
      email,
      full_name: fullName,
      role,
      city: city || 'Gilgit',
      created_at: new Date().toISOString()
    };
    profiles.push(newProfile);
    setLocalData(STORAGE_KEYS.PROFILES, profiles);
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(newProfile));
    return newProfile;
  },

  updateProfile: async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
    const current = dbAuth.getCurrentUser();
    if (!current) throw new Error('Not authenticated');

    const updated = { ...current, ...profileData };
    if (isSupabaseConfigured && supabase) {
      await supabase.from('profiles').update(profileData).eq('id', current.id);
    }
    const profiles = getLocalData<UserProfile[]>(STORAGE_KEYS.PROFILES, SEED_PROFILES);
    const idx = profiles.findIndex(p => p.id === current.id);
    if (idx !== -1) {
      profiles[idx] = updated;
      setLocalData(STORAGE_KEYS.PROFILES, profiles);
    }
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(updated));
    return updated;
  },

  getAllUsers: async (): Promise<UserProfile[]> => {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('profiles').select('*');
      if (data && data.length > 0) return data;
    }
    return getLocalData<UserProfile[]>(STORAGE_KEYS.PROFILES, SEED_PROFILES);
  },

  logout: async (): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  }
};

// ================= CATEGORIES =================

export const dbCategories = {
  getAll: async (): Promise<Category[]> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (!error && data && data.length > 0) return data;
    }
    return getLocalData<Category[]>(STORAGE_KEYS.CATEGORIES, SEED_CATEGORIES);
  },

  create: async (category: Omit<Category, 'id' | 'created_at'>): Promise<Category> => {
    const newCat: Category = {
      ...category,
      id: 'cat-' + Date.now(),
      created_at: new Date().toISOString()
    };
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('categories').insert(newCat).select().single();
      if (data) return data;
    }
    const list = getLocalData<Category[]>(STORAGE_KEYS.CATEGORIES, SEED_CATEGORIES);
    list.push(newCat);
    setLocalData(STORAGE_KEYS.CATEGORIES, list);
    return newCat;
  },

  update: async (id: string, updates: Partial<Category>): Promise<Category> => {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('categories').update(updates).eq('id', id).select().single();
      if (data) return data;
    }
    const list = getLocalData<Category[]>(STORAGE_KEYS.CATEGORIES, SEED_CATEGORIES);
    const idx = list.findIndex(c => c.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      setLocalData(STORAGE_KEYS.CATEGORIES, list);
      return list[idx];
    }
    throw new Error('Category not found');
  },

  delete: async (id: string): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('categories').delete().eq('id', id);
    }
    const list = getLocalData<Category[]>(STORAGE_KEYS.CATEGORIES, SEED_CATEGORIES);
    setLocalData(STORAGE_KEYS.CATEGORIES, list.filter(c => c.id !== id));
  }
};

// ================= PRODUCTS =================

export const dbProducts = {
  getAll: async (statusFilter?: ProductStatus): Promise<Product[]> => {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('products').select('*');
      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    }
    const all = getLocalData<Product[]>(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
    if (statusFilter) {
      return all.filter(p => p.status === statusFilter);
    }
    return all;
  },

  getBySlug: async (slug: string): Promise<Product | null> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single();
      if (!error && data) return data;
    }
    const all = getLocalData<Product[]>(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
    return all.find(p => p.slug === slug) || null;
  },

  getById: async (id: string): Promise<Product | null> => {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('products').select('*').eq('id', id).single();
      if (data) return data;
    }
    const all = getLocalData<Product[]>(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
    return all.find(p => p.id === id) || null;
  },

  create: async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> => {
    const newProduct: Product = {
      ...productData,
      id: 'prod-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('products').insert(newProduct).select().single();
      if (data) return data;
    }
    const list = getLocalData<Product[]>(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
    list.unshift(newProduct);
    setLocalData(STORAGE_KEYS.PRODUCTS, list);
    return newProduct;
  },

  update: async (id: string, updates: Partial<Product>): Promise<Product> => {
    const updatedWithTime = { ...updates, updated_at: new Date().toISOString() };
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('products').update(updatedWithTime).eq('id', id).select().single();
      if (data) return data;
    }
    const list = getLocalData<Product[]>(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
    const idx = list.findIndex(p => p.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updatedWithTime };
      setLocalData(STORAGE_KEYS.PRODUCTS, list);
      return list[idx];
    }
    throw new Error('Product not found');
  },

  delete: async (id: string): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('products').delete().eq('id', id);
    }
    const list = getLocalData<Product[]>(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
    setLocalData(STORAGE_KEYS.PRODUCTS, list.filter(p => p.id !== id));
  },

  updateStatus: async (id: string, status: ProductStatus): Promise<Product> => {
    return dbProducts.update(id, { status });
  }
};

// ================= CART =================

export const dbCart = {
  getCart: async (userId?: string): Promise<CartItem[]> => {
    const items = getLocalData<CartItem[]>(STORAGE_KEYS.CART, []);
    if (userId) {
      return items.filter(i => i.user_id === userId || !i.user_id);
    }
    return items;
  },

  addToCart: async (product: Product, quantity: number = 1, userId?: string): Promise<CartItem[]> => {
    const items = getLocalData<CartItem[]>(STORAGE_KEYS.CART, []);
    const existingIndex = items.findIndex(i => i.product_id === product.id && (!userId || i.user_id === userId));

    if (existingIndex > -1) {
      items[existingIndex].quantity += quantity;
    } else {
      items.push({
        id: 'cart-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
        user_id: userId,
        product_id: product.id,
        quantity,
        product,
        created_at: new Date().toISOString()
      });
    }
    setLocalData(STORAGE_KEYS.CART, items);
    return items;
  },

  updateQuantity: async (productId: string, quantity: number, userId?: string): Promise<CartItem[]> => {
    let items = getLocalData<CartItem[]>(STORAGE_KEYS.CART, []);
    if (quantity <= 0) {
      items = items.filter(i => !(i.product_id === productId && (!userId || i.user_id === userId)));
    } else {
      const item = items.find(i => i.product_id === productId && (!userId || i.user_id === userId));
      if (item) {
        item.quantity = quantity;
      }
    }
    setLocalData(STORAGE_KEYS.CART, items);
    return items;
  },

  removeFromCart: async (productId: string, userId?: string): Promise<CartItem[]> => {
    const items = getLocalData<CartItem[]>(STORAGE_KEYS.CART, []);
    const filtered = items.filter(i => !(i.product_id === productId && (!userId || i.user_id === userId)));
    setLocalData(STORAGE_KEYS.CART, filtered);
    return filtered;
  },

  clearCart: async (_userId?: string): Promise<void> => {
    setLocalData(STORAGE_KEYS.CART, []);
  }
};

// ================= WISHLIST =================

export const dbWishlist = {
  getWishlist: async (userId?: string): Promise<WishlistItem[]> => {
    const items = getLocalData<WishlistItem[]>(STORAGE_KEYS.WISHLIST, []);
    if (userId) {
      return items.filter(i => i.user_id === userId || !i.user_id);
    }
    return items;
  },

  toggleWishlist: async (product: Product, userId?: string): Promise<{ items: WishlistItem[]; isAdded: boolean }> => {
    const items = getLocalData<WishlistItem[]>(STORAGE_KEYS.WISHLIST, []);
    const idx = items.findIndex(i => i.product_id === product.id && (!userId || i.user_id === userId));

    let isAdded = false;
    if (idx > -1) {
      items.splice(idx, 1);
      isAdded = false;
    } else {
      items.push({
        id: 'wish-' + Date.now(),
        user_id: userId,
        product_id: product.id,
        product,
        created_at: new Date().toISOString()
      });
      isAdded = true;
    }
    setLocalData(STORAGE_KEYS.WISHLIST, items);
    return { items, isAdded };
  },

  removeFromWishlist: async (productId: string, userId?: string): Promise<WishlistItem[]> => {
    const items = getLocalData<WishlistItem[]>(STORAGE_KEYS.WISHLIST, []);
    const filtered = items.filter(i => !(i.product_id === productId && (!userId || i.user_id === userId)));
    setLocalData(STORAGE_KEYS.WISHLIST, filtered);
    return filtered;
  }
};

// ================= ORDERS =================

export const dbOrders = {
  createOrder: async (orderData: {
    user_id: string;
    full_name: string;
    phone: string;
    city: string;
    delivery_address: string;
    notes?: string;
    total_amount: number;
    payment_method: 'cod' | 'bank_transfer' | 'easypaisa_jazzcash';
    items: OrderItem[];
  }): Promise<Order> => {
    const orderNumber = 'HH-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      order_number: orderNumber,
      user_id: orderData.user_id,
      full_name: orderData.full_name,
      phone: orderData.phone,
      city: orderData.city,
      delivery_address: orderData.delivery_address,
      notes: orderData.notes,
      total_amount: orderData.total_amount,
      payment_method: orderData.payment_method,
      payment_status: orderData.payment_method === 'cod' ? 'pending' : 'paid',
      order_status: 'placed',
      items: orderData.items,
      created_at: new Date().toISOString()
    };

    // Deduct stock safely
    const products = getLocalData<Product[]>(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
    for (const item of orderData.items) {
      const p = products.find(prod => prod.id === item.product_id);
      if (p) {
        p.stock_quantity = Math.max(0, p.stock_quantity - item.quantity);
      }
    }
    setLocalData(STORAGE_KEYS.PRODUCTS, products);

    // Save order
    const orders = getLocalData<Order[]>(STORAGE_KEYS.ORDERS, []);
    orders.unshift(newOrder);
    setLocalData(STORAGE_KEYS.ORDERS, orders);

    // Clear cart
    dbCart.clearCart(orderData.user_id);

    return newOrder;
  },

  getAllOrders: async (): Promise<Order[]> => {
    return getLocalData<Order[]>(STORAGE_KEYS.ORDERS, []);
  },

  getMyOrders: async (userId: string): Promise<Order[]> => {
    const orders = getLocalData<Order[]>(STORAGE_KEYS.ORDERS, []);
    return orders.filter(o => o.user_id === userId);
  },

  getOrderByNumber: async (orderNumber: string): Promise<Order | null> => {
    const orders = getLocalData<Order[]>(STORAGE_KEYS.ORDERS, []);
    return orders.find(o => o.order_number === orderNumber) || null;
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<Order> => {
    const orders = getLocalData<Order[]>(STORAGE_KEYS.ORDERS, []);
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      orders[idx].order_status = status;
      setLocalData(STORAGE_KEYS.ORDERS, orders);
      return orders[idx];
    }
    throw new Error('Order not found');
  }
};

// ================= REVIEWS =================

export const dbReviews = {
  getByProduct: async (productId: string): Promise<Review[]> => {
    const reviews = getLocalData<Review[]>(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
    return reviews.filter(r => r.product_id === productId);
  },

  addReview: async (reviewData: Omit<Review, 'id' | 'created_at'>): Promise<Review> => {
    const newRev: Review = {
      ...reviewData,
      id: 'rev-' + Date.now(),
      created_at: new Date().toISOString()
    };
    const reviews = getLocalData<Review[]>(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
    reviews.unshift(newRev);
    setLocalData(STORAGE_KEYS.REVIEWS, reviews);

    // Update product rating and count
    const products = getLocalData<Product[]>(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
    const prod = products.find(p => p.id === reviewData.product_id);
    if (prod) {
      const prodRevs = reviews.filter(r => r.product_id === prod.id);
      const avg = prodRevs.reduce((acc, cur) => acc + cur.rating, 0) / prodRevs.length;
      prod.rating = parseFloat(avg.toFixed(1));
      prod.review_count = prodRevs.length;
      setLocalData(STORAGE_KEYS.PRODUCTS, products);
    }

    return newRev;
  }
};

// ================= SELLER APPLICATIONS =================

export const dbSellerApplications = {
  submit: async (appData: Omit<SellerApplication, 'id' | 'status' | 'created_at'>): Promise<SellerApplication> => {
    const newApp: SellerApplication = {
      ...appData,
      id: 'app-' + Date.now(),
      status: 'pending',
      created_at: new Date().toISOString()
    };
    const apps = getLocalData<SellerApplication[]>(STORAGE_KEYS.APPLICATIONS, []);
    apps.unshift(newApp);
    setLocalData(STORAGE_KEYS.APPLICATIONS, apps);
    return newApp;
  },

  getAll: async (): Promise<SellerApplication[]> => {
    return getLocalData<SellerApplication[]>(STORAGE_KEYS.APPLICATIONS, []);
  },

  updateStatus: async (id: string, status: 'approved' | 'rejected'): Promise<SellerApplication> => {
    const apps = getLocalData<SellerApplication[]>(STORAGE_KEYS.APPLICATIONS, []);
    const idx = apps.findIndex(a => a.id === id);
    if (idx !== -1) {
      apps[idx].status = status;
      setLocalData(STORAGE_KEYS.APPLICATIONS, apps);

      // If approved, update user role to seller
      if (status === 'approved') {
        const profiles = getLocalData<UserProfile[]>(STORAGE_KEYS.PROFILES, SEED_PROFILES);
        const userProf = profiles.find(p => p.id === apps[idx].user_id);
        if (userProf) {
          userProf.role = 'seller';
          setLocalData(STORAGE_KEYS.PROFILES, profiles);
        }
      }
      return apps[idx];
    }
    throw new Error('Application not found');
  }
};

// ================= CONTACT MESSAGES =================

export const dbContact = {
  submit: async (msgData: Omit<ContactMessage, 'id' | 'status' | 'created_at'>): Promise<ContactMessage> => {
    const newMsg: ContactMessage = {
      ...msgData,
      id: 'msg-' + Date.now(),
      status: 'new',
      created_at: new Date().toISOString()
    };
    const msgs = getLocalData<ContactMessage[]>(STORAGE_KEYS.MESSAGES, []);
    msgs.unshift(newMsg);
    setLocalData(STORAGE_KEYS.MESSAGES, msgs);
    return newMsg;
  },

  getAll: async (): Promise<ContactMessage[]> => {
    return getLocalData<ContactMessage[]>(STORAGE_KEYS.MESSAGES, []);
  },

  updateStatus: async (id: string, status: 'new' | 'read' | 'replied'): Promise<ContactMessage> => {
    const msgs = getLocalData<ContactMessage[]>(STORAGE_KEYS.MESSAGES, []);
    const idx = msgs.findIndex(m => m.id === id);
    if (idx !== -1) {
      msgs[idx].status = status;
      setLocalData(STORAGE_KEYS.MESSAGES, msgs);
      return msgs[idx];
    }
    throw new Error('Message not found');
  }
};

// ================= STORAGE UPLOAD =================

export const dbStorage = {
  uploadProductImage: async (file: File): Promise<string> => {
    // If Supabase client and storage configured
    if (isSupabaseConfigured && supabase) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `products/${fileName}`;
        const { error } = await supabase.storage.from('products').upload(filePath, file);
        if (!error) {
          const { data } = supabase.storage.from('products').getPublicUrl(filePath);
          if (data?.publicUrl) return data.publicUrl;
        }
      } catch (err) {
        console.warn('Supabase storage upload failed, falling back to data URL', err);
      }
    }

    // High quality client-side fallback: Convert to data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }
};
