# Hunza Heritage (ہنزہ ہیریٹیج)
### *Authentic Handcrafted Treasures from Gilgit-Baltistan*

Hunza Heritage is a full-stack cultural marketplace designed to connect indigenous craftswomen, master woodworkers, generational weavers, and lapidary silversmiths of Gilgit-Baltistan with buyers worldwide.

---

## 🌟 Key Features

1. **21 Fully Responsive Pages**:
   - **Storefront & Catalog**: Homepage, Full Catalog (`/shop`), Category Details (`/category/:slug`), All Categories (`/categories`), Product Story & Review Details (`/product/:slug`).
   - **Cart & Checkout**: Responsive Bag (`/cart`), Free Shipping calculator (PKR 5,000 threshold), Checkout (`/checkout`) with Cash on Delivery, Bank Transfer (Meezan/HBL), and EasyPaisa/JazzCash, Order Success (`/order-success/:orderNumber`).
   - **User Accounts**: Login (`/login`), Register (`/register`), User Profile (`/profile`), My Orders tracking (`/orders`), Wishlist (`/wishlist`).
   - **Artisan & Store Operations**: Become a Seller (`/become-seller`), Seller Dashboard (`/seller-dashboard`), Admin Control Center (`/admin`).
   - **Story & Trust**: About Us (`/about`), Contact & Guild Addresses (`/contact`), FAQs (`/faq`), Privacy Policy (`/privacy`), Terms & Conditions (`/terms`), 404 Page.

2. **Dual-Engine Architecture**:
   - **Out-of-the-box Persistent Live Mode**: Fully functional with sample seed data for 16+ products and 8 categories even without external API credentials.
   - **Native Supabase Support**: Plug-and-play connection to any Supabase project with Row Level Security (RLS) policies and storage buckets.

---

## ⚡ Quick Demo Accounts (One-Click Testing)

Use the role switchers on the top **Announcement Bar** or log in with:

| Role | Email | Password | What You Can Test |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@hunzaheritage.com` | `admin123` | Moderate products, approve seller applications, manage orders & categories |
| **Artisan Seller** | `seller@hunzaheritage.com` | `seller123` | Add handicrafts with image uploads, manage stock, view workshop sales |
| **Customer** | `customer@hunzaheritage.com` | `customer123` | Add to cart, place orders with COD, leave product reviews |

---

## 🛠️ Supabase Setup Instructions

To connect to your own Supabase project:

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com) and create a new project.

2. **Execute Schema SQL**:
   - Open the Supabase **SQL Editor**.
   - Copy and paste the entire script from `supabase/schema.sql` into the SQL editor and click **Run**.
   - This provisions all 10 tables (`profiles`, `categories`, `products`, `cart_items`, `wishlist_items`, `orders`, `order_items`, `reviews`, `seller_applications`, `contact_messages`), indexes, RLS policies, and the `products` storage bucket.

3. **Configure Environment Variables**:
   - In your `.env` or project settings, configure:
     ```env
     VITE_SUPABASE_URL="https://your-project.supabase.co"
     VITE_SUPABASE_ANON_KEY="your-anon-public-key"
     ```

4. **Create First Admin Account**:
   - Register a new account via the UI (`/register`) or use Supabase Auth.
   - In Supabase Table Editor under `public.profiles`, set the `role` column of your user to `'admin'`.
   - You now have full access to `/admin`.
