import { Category, Product, ArtisanSeller, Review } from '../types';

import heroBannerImg from '../assets/images/hero_hunza_crafts_1790865878245.jpg';
import shawlImg from '../assets/images/product_hunza_shawl_1790865892499.jpg';
import capImg from '../assets/images/product_gilgit_cap_1790865903976.jpg';
import artisanLoomImg from '../assets/images/artisan_hunza_loom_1790865918378.jpg';

export { heroBannerImg, shawlImg, capImg, artisanLoomImg };

export const SEED_CATEGORIES: Category[] = [
  {
    id: 'cat-jewellery',
    name: 'Jewellery',
    slug: 'jewellery',
    image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    description: 'Silver and natural gemstones handcrafted by Baltistan silversmiths using lapis lazuli, turquoise, and jade.'
  },
  {
    id: 'cat-clothing-shawls',
    name: 'Clothing & Shawls',
    slug: 'clothing-shawls',
    image_url: shawlImg,
    description: 'Pure sheep & pashmina wool handwoven shawls with delicate cross-stitch motifs from Hunza & Nagar.'
  },
  {
    id: 'cat-home-decor',
    name: 'Home Décor',
    slug: 'home-decor',
    image_url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80',
    description: 'Intricately carved aged walnut wood trays, rustic pottery, and hand-hammered mountain brassware.'
  },
  {
    id: 'cat-rugs-textiles',
    name: 'Rugs & Textiles',
    slug: 'rugs-textiles',
    image_url: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=600&q=80',
    description: 'Traditional Sharma & Kilims hand-knotted by Wakhi and Shina women on historic horizontal looms.'
  },
  {
    id: 'cat-bags',
    name: 'Bags',
    slug: 'bags',
    image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
    description: 'Vegetable-tanned leather totes and messenger bags trimmed with tribal silk-thread needlework.'
  },
  {
    id: 'cat-dry-fruits',
    name: 'Dry Fruits & Gifts',
    slug: 'dry-fruits-gifts',
    image_url: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=600&q=80',
    description: 'Sun-dried Hunza apricots, sweet mountain almonds, organic dried mulberries and pure walnut oil.'
  },
  {
    id: 'cat-art-souvenirs',
    name: 'Art & Souvenirs',
    slug: 'art-souvenirs',
    image_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
    description: 'Hand-painted mountain landscapes of Rakaposhi, Passu Cones, and miniature calligraphic rock carvings.'
  },
  {
    id: 'cat-traditional-wear',
    name: 'Traditional Wear',
    slug: 'traditional-wear',
    image_url: capImg,
    description: 'Iconic Hunza patti caps with peacock feather brooches, ceremonial chogas, and embroidered wool waistcoats.'
  }
];

export const SEED_ARTISANS: ArtisanSeller[] = [
  {
    id: 'seller-bibi-fatima',
    name: 'Bibi Fatima Gulmiti',
    location: 'Gulmit, Upper Hunza',
    specialty: 'Master Loom Weaver & Rug Artist',
    bio: 'Preserving over 400 years of Wakhi carpet weaving tradition using natural vegetable dyes from mountain herbs.',
    avatar_url: artisanLoomImg,
    experience_years: 28,
    story: '“Every pattern in our wool tells the story of glacial rivers, apricot blossoms, and high Karakoram peaks.”'
  },
  {
    id: 'seller-ali-ahmed',
    name: 'Ustad Ali Ahmed',
    location: 'Karimabad, Hunza Valley',
    specialty: 'Walnut Wood Master Carver',
    bio: 'Fourth generation woodworker shaping fallen ancient walnut trees into heirloom bowls and architectural panels.',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    experience_years: 34,
    story: '“Wood has memory. When carved with patience, it carries the soul of Gilgit-Baltistan for generations.”'
  },
  {
    id: 'seller-zainab-balti',
    name: 'Zainab Batool',
    location: 'Skardu, Baltistan',
    specialty: 'Silversmith & Mineral Artisan',
    bio: 'Transforms raw local gemstones like lapis, quartz, and river silver into heritage ornaments inspired by K2 trails.',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    experience_years: 19,
    story: '“Our jewellery is sacred armor; every stone reflects the eternal blue skies over Baltistan.”'
  },
  {
    id: 'seller-karim-khan',
    name: 'Karim Khan',
    location: 'Gilgit City',
    specialty: 'Handcrafted Woolen Caps & Patti',
    bio: 'Hand-spins natural Himalayan sheep fleece to create traditional warm caps celebrated across northern valleys.',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    experience_years: 22,
    story: '“The Hunza cap is not just headwear; it is the dignity and resilience of mountain folk.”'
  }
];

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod-hunza-wool-shawl',
    seller_id: 'seller-bibi-fatima',
    category_id: 'cat-clothing-shawls',
    name: 'Hunza Handwoven Wool Shawl',
    slug: 'hunza-handwoven-wool-shawl',
    description: 'An heirloom-quality wrap handwoven on vintage wooden looms by women artisans in Upper Hunza. Spun from 100% pure mountain sheep wool, dyed with walnut bark and pomegranate rind for rich earthy tones, and finished with delicate hand-embroidered edges.',
    price: 14500,
    original_price: 18000,
    stock_quantity: 12,
    image_urls: [
      shawlImg,
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800&q=80'
    ],
    material: '100% Pure Himalayan Sheep Wool & Natural Dyes',
    origin_city: 'Gulmit, Upper Hunza',
    is_featured: true,
    status: 'approved',
    rating: 4.9,
    review_count: 24,
    created_at: '2026-02-10T10:00:00Z',
    seller_name: 'Bibi Fatima Gulmiti',
    category_name: 'Clothing & Shawls'
  },
  {
    id: 'prod-gilgit-cap',
    seller_id: 'seller-karim-khan',
    category_id: 'cat-traditional-wear',
    name: 'Gilgit Traditional Embroidered Cap',
    slug: 'gilgit-traditional-embroidered-cap',
    description: 'The iconic handmade woolen rolled cap of Gilgit-Baltistan, known locally as the Patti Cap. Stitched from dense hand-spun wool, finished with fine geometric silk thread embroidery along the brim, and adorned with an authentic handcrafted silver bird plume pin.',
    price: 3800,
    original_price: 4500,
    stock_quantity: 25,
    image_urls: [
      capImg,
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80'
    ],
    material: 'Pure Hand-spun Wool & Antique Silver Plume',
    origin_city: 'Karimabad, Hunza',
    is_featured: true,
    status: 'approved',
    rating: 5.0,
    review_count: 42,
    created_at: '2026-02-12T11:00:00Z',
    seller_name: 'Karim Khan',
    category_name: 'Traditional Wear'
  },
  {
    id: 'prod-baltistan-necklace',
    seller_id: 'seller-zainab-balti',
    category_id: 'cat-jewellery',
    name: 'Baltistan Silver Stone Necklace',
    slug: 'baltistan-silver-stone-necklace',
    description: 'Intricately handcrafted sterling silver choker necklace featuring raw natural Lapis Lazuli and deep turquoise stones mined from the Karakoram mountain range. Hand-hammered links with tribal filigree detailing inspired by ancient Tibetan-Balti royalty.',
    price: 18500,
    original_price: 22000,
    stock_quantity: 8,
    image_urls: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'
    ],
    material: 'Sterling Silver 925, Natural Lapis Lazuli & Turquoise',
    origin_city: 'Skardu, Baltistan',
    is_featured: true,
    status: 'approved',
    rating: 4.8,
    review_count: 18,
    created_at: '2026-02-14T09:30:00Z',
    seller_name: 'Zainab Batool',
    category_name: 'Jewellery'
  },
  {
    id: 'prod-walnut-bowl',
    seller_id: 'seller-ali-ahmed',
    category_id: 'cat-home-decor',
    name: 'Handmade Walnut Wood Bowl',
    slug: 'handmade-walnut-wood-bowl',
    description: 'Artisanal decorative and serving bowl hand-turned and carved from a single solid block of century-old wild Hunza walnut wood. Hand-buffed with organic apricot kernel oil for a food-safe, smooth, natural satin luster that reveals the rich wood grain.',
    price: 6200,
    original_price: 7500,
    stock_quantity: 15,
    image_urls: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80'
    ],
    material: '100% Solid Hunza Walnut Wood & Organic Apricot Oil finish',
    origin_city: 'Karimabad, Hunza',
    is_featured: true,
    status: 'approved',
    rating: 4.9,
    review_count: 31,
    created_at: '2026-02-15T14:15:00Z',
    seller_name: 'Ustad Ali Ahmed',
    category_name: 'Home Décor'
  },
  {
    id: 'prod-karakoram-rug',
    seller_id: 'seller-bibi-fatima',
    category_id: 'cat-rugs-textiles',
    name: 'Karakoram Woven Rug',
    slug: 'karakoram-woven-rug',
    description: 'A traditional geometric flat-weave rug (Kilim) painstakingly woven by master artisans in Gojal. Features centuries-old Wakhi tribal mountain motifs representing peaks, flowing waters, and protection from winter winds. Built to last generations.',
    price: 36000,
    original_price: 42000,
    stock_quantity: 4,
    image_urls: [
      'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80',
      artisanLoomImg
    ],
    material: 'Hand-spun Yak and Sheep Wool with Vegetable Pigments',
    origin_city: 'Gulmit, Upper Hunza',
    is_featured: true,
    status: 'approved',
    rating: 5.0,
    review_count: 15,
    created_at: '2026-02-18T16:00:00Z',
    seller_name: 'Bibi Fatima Gulmiti',
    category_name: 'Rugs & Textiles'
  },
  {
    id: 'prod-dry-fruit-box',
    seller_id: 'seller-karim-khan',
    category_id: 'cat-dry-fruits',
    name: 'Organic Hunza Dry Fruit Gift Box',
    slug: 'organic-hunza-dry-fruit-gift-box',
    description: 'A curated gourmet gift box packed in a handcrafted wooden keepsake case. Contains premium sun-dried Hunza organic apricots, mountain sweet almonds, golden sun raisins, hand-shelled walnuts, and cold-pressed apricot kernel oil.',
    price: 4900,
    original_price: 5800,
    stock_quantity: 40,
    image_urls: [
      'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1543208543-6058e57f2010?auto=format&fit=crop&w=800&q=80'
    ],
    material: 'Certified Organic Mountain Fruits in Hand-crafted Cedar Box',
    origin_city: 'Hunza Valley',
    is_featured: true,
    status: 'approved',
    rating: 4.9,
    review_count: 53,
    created_at: '2026-02-20T08:00:00Z',
    seller_name: 'Karim Khan',
    category_name: 'Dry Fruits & Gifts'
  },
  {
    id: 'prod-leather-bag',
    seller_id: 'seller-ali-ahmed',
    category_id: 'cat-bags',
    name: 'Traditional Handcrafted Leather Bag',
    slug: 'traditional-handcrafted-leather-bag',
    description: 'Full-grain vegetable-tanned saddle leather tote bag with authentic front panel embellished with hand-stitched Shina geometric wool embroidery. Features brass buckle hardware, comfortable leather shoulder strap, and internal zippered compartments.',
    price: 11500,
    original_price: 13500,
    stock_quantity: 10,
    image_urls: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80'
    ],
    material: 'Vegetable Tanned Leather & Hand-embroidered Wool Canvas',
    origin_city: 'Gilgit City',
    is_featured: true,
    status: 'approved',
    rating: 4.7,
    review_count: 19,
    created_at: '2026-02-22T13:40:00Z',
    seller_name: 'Ustad Ali Ahmed',
    category_name: 'Bags'
  },
  {
    id: 'prod-mountain-art-frame',
    seller_id: 'seller-zainab-balti',
    category_id: 'cat-art-souvenirs',
    name: 'Mountain Art Wall Frame',
    slug: 'mountain-art-wall-frame',
    description: 'An original acrylic landscape depicting sunset on Rakaposhi and Passu Cones, hand-painted on textured canvas and framed in reclaimed Himalayan deodar wood. Each frame is signed by the local Gilgit artist.',
    price: 8500,
    original_price: 10000,
    stock_quantity: 6,
    image_urls: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
      heroBannerImg
    ],
    material: 'Acrylic on Canvas with Aged Deodar Wood Frame',
    origin_city: 'Gilgit City',
    is_featured: true,
    status: 'approved',
    rating: 4.9,
    review_count: 14,
    created_at: '2026-02-24T12:00:00Z',
    seller_name: 'Zainab Batool',
    category_name: 'Art & Souvenirs'
  },
  {
    id: 'prod-lapis-lazuli-ring',
    seller_id: 'seller-zainab-balti',
    category_id: 'cat-jewellery',
    name: 'Khaplu Lapis Lazuli Ring',
    slug: 'khaplu-lapis-lazuli-ring',
    description: 'Hand-carved royal blue lapis lazuli gemstone with golden pyrite flecks, prong-set in 925 sterling silver with engraved mountain ridge motifs along the band.',
    price: 7200,
    original_price: 8500,
    stock_quantity: 14,
    image_urls: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80'
    ],
    material: 'Natural Lapis Lazuli & 925 Sterling Silver',
    origin_city: 'Khaplu, Baltistan',
    is_featured: false,
    status: 'approved',
    rating: 4.8,
    review_count: 11,
    created_at: '2026-02-26T15:00:00Z',
    seller_name: 'Zainab Batool',
    category_name: 'Jewellery'
  },
  {
    id: 'prod-velvet-pouch',
    seller_id: 'seller-bibi-fatima',
    category_id: 'cat-bags',
    name: 'Gojal Valley Embroidered Velvet Pouch',
    slug: 'gojal-valley-embroidered-velvet-pouch',
    description: 'Plush crimson velvet evening clutch intricately adorned with fine silk thread zardozi and antique glass bead tassels. Perfect for cultural events or cherished trinkets.',
    price: 3400,
    original_price: 4200,
    stock_quantity: 20,
    image_urls: [
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80'
    ],
    material: 'Rich Cotton Velvet & Silk Thread Zardozi',
    origin_city: 'Gojal, Upper Hunza',
    is_featured: false,
    status: 'approved',
    rating: 4.6,
    review_count: 8,
    created_at: '2026-02-28T09:00:00Z',
    seller_name: 'Bibi Fatima Gulmiti',
    category_name: 'Bags'
  },
  {
    id: 'prod-wood-spoons',
    seller_id: 'seller-ali-ahmed',
    category_id: 'cat-home-decor',
    name: 'Chilas Hand-Carved Wooden Spoon Set',
    slug: 'chilas-hand-carved-wooden-spoon-set',
    description: 'Set of 4 artisan culinary spoons carved from dense mulberry and apricot wood with curved ergonomic handles and polished beeswax finish.',
    price: 2900,
    original_price: 3500,
    stock_quantity: 18,
    image_urls: [
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80'
    ],
    material: 'Aged Apricot & Mulberry Wood with Natural Beeswax',
    origin_city: 'Chilas, Diamer',
    is_featured: false,
    status: 'approved',
    rating: 4.7,
    review_count: 17,
    created_at: '2026-03-01T14:30:00Z',
    seller_name: 'Ustad Ali Ahmed',
    category_name: 'Home Décor'
  },
  {
    id: 'prod-skardu-apricots-honey',
    seller_id: 'seller-karim-khan',
    category_id: 'cat-dry-fruits',
    name: 'Skardu Wild Mountain Apricot Kernels & Honey',
    slug: 'skardu-wild-mountain-apricot-kernels-honey',
    description: 'Raw wild flora mountain honey harvested from cliffside hives in Baltistan paired with sweet edible organic apricot kernels rich in natural oils.',
    price: 3200,
    original_price: 3900,
    stock_quantity: 30,
    image_urls: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80'
    ],
    material: '100% Pure Raw Mountain Forest Honey & Edible Kernels',
    origin_city: 'Skardu, Baltistan',
    is_featured: false,
    status: 'approved',
    rating: 5.0,
    review_count: 27,
    created_at: '2026-03-03T11:00:00Z',
    seller_name: 'Karim Khan',
    category_name: 'Dry Fruits & Gifts'
  },
  {
    id: 'prod-bridal-choga',
    seller_id: 'seller-bibi-fatima',
    category_id: 'cat-clothing-shawls',
    name: 'Hunza Traditional Bridal Embroidered Choga',
    slug: 'hunza-traditional-bridal-embroidered-choga',
    description: 'Magnificent ceremonial wool overcoat (Choga) with heavy silk floral embroidery along lapels and hem. Created for festive occasions and heritage collectors.',
    price: 45000,
    original_price: 52000,
    stock_quantity: 3,
    image_urls: [
      shawlImg,
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    material: 'Fine Sheep Wool Patti with Traditional Silver Thread Needlework',
    origin_city: 'Karimabad, Hunza',
    is_featured: false,
    status: 'approved',
    rating: 5.0,
    review_count: 7,
    created_at: '2026-03-04T12:00:00Z',
    seller_name: 'Bibi Fatima Gulmiti',
    category_name: 'Clothing & Shawls'
  },
  {
    id: 'prod-brass-samovar',
    seller_id: 'seller-ali-ahmed',
    category_id: 'cat-home-decor',
    name: 'Hand-hammered Brass Samovar Tea Urn',
    slug: 'hand-hammered-brass-samovar-tea-urn',
    description: 'Traditional Gilgit tea samovar crafted in heavy brass with hand-chiseled floral filigree motifs and tin-lined interior for serving piping hot mountain chai.',
    price: 24500,
    original_price: 29000,
    stock_quantity: 5,
    image_urls: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
    ],
    material: 'Pure Solid Hammered Brass with Polished Finish',
    origin_city: 'Gilgit City',
    is_featured: false,
    status: 'approved',
    rating: 4.9,
    review_count: 12,
    created_at: '2026-03-06T10:00:00Z',
    seller_name: 'Ustad Ali Ahmed',
    category_name: 'Home Décor'
  },
  {
    id: 'prod-stone-bracelet',
    seller_id: 'seller-zainab-balti',
    category_id: 'cat-jewellery',
    name: 'Karakoram Mountain Stone Beads Bracelet',
    slug: 'karakoram-mountain-stone-beads-bracelet',
    description: 'Stretch bead bracelet handcrafted from river-tumbled serpentine, jasper, and turquoise collected from the banks of the Hunza and Indus rivers.',
    price: 2600,
    original_price: 3200,
    stock_quantity: 22,
    image_urls: [
      'https://images.unsplash.com/photo-1611591475878-a28a36c84d7a?auto=format&fit=crop&w=800&q=80'
    ],
    material: 'Natural Himalayan Serpentine, Jasper, and Turquoise',
    origin_city: 'Skardu, Baltistan',
    is_featured: false,
    status: 'approved',
    rating: 4.8,
    review_count: 22,
    created_at: '2026-03-07T13:30:00Z',
    seller_name: 'Zainab Batool',
    category_name: 'Jewellery'
  },
  {
    id: 'prod-yak-wool-socks',
    seller_id: 'seller-karim-khan',
    category_id: 'cat-traditional-wear',
    name: 'Hand-Knitted Yak Wool Socks & Mittens',
    slug: 'hand-knitted-yak-wool-socks-mittens',
    description: 'Thick, ultra-warm winter socks and convertible mittens hand-knitted by elderly grandmothers of Shimshal high valley using genuine soft yak underfleece.',
    price: 2400,
    original_price: 3000,
    stock_quantity: 35,
    image_urls: [
      'https://images.unsplash.com/photo-1582966772680-860e372bb558?auto=format&fit=crop&w=800&q=80'
    ],
    material: '100% High Altitude Natural Yak Under-wool',
    origin_city: 'Shimshal, Hunza',
    is_featured: false,
    status: 'approved',
    rating: 4.9,
    review_count: 36,
    created_at: '2026-03-08T15:00:00Z',
    seller_name: 'Karim Khan',
    category_name: 'Traditional Wear'
  }
];

export const SEED_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    user_id: 'user-tariq',
    user_name: 'Tariq Mehmood (Islamabad)',
    product_id: 'prod-hunza-wool-shawl',
    rating: 5,
    comment: 'The craftsmanship on this shawl is breathtaking. The wool is so soft and warm, and the embroidery is noticeably authentic. Arrived in 3 days to Islamabad.',
    created_at: '2026-03-12T14:00:00Z'
  },
  {
    id: 'rev-2',
    user_id: 'user-sarah',
    user_name: 'Dr. Sarah Jenkins (UK Tourist)',
    product_id: 'prod-gilgit-cap',
    rating: 5,
    comment: 'I visited Hunza last year and lost my cap. Ordering this brought all those magical mountain memories right back! The silver brooch is stunning.',
    created_at: '2026-03-15T09:30:00Z'
  },
  {
    id: 'rev-3',
    user_id: 'user-ayesha',
    user_name: 'Ayesha Raza (Lahore)',
    product_id: 'prod-walnut-bowl',
    rating: 5,
    comment: 'You can immediately tell this is genuine aged walnut wood. It has that subtle organic apricot oil finish. A true centerpiece for our dining table.',
    created_at: '2026-03-18T18:15:00Z'
  }
];
