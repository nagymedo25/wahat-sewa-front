import { publicApi } from '@/services/api.js';

const badgeLabels = {
  best_seller: 'الأكثر مبيعًا',
  most_requested: 'الأكثر طلبًا',
  featured: 'مميز',
  new_arrival: 'الوافد الجديد',
  none: '',
};

const emojiMap = {
  herbs: '🌿',
  dates: '🌴',
  oils: '💧',
  care: '🧴',
  lamps: '🏮',
  candles: '🕯️',
};

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function mapEmoji(key) {
  return emojiMap[key] || '✨';
}

function normalizeProduct(product, index = 0) {
  const categoryKey = product.category_slug || slugify(product.category_name || product.name || `category-${index}`);
  const price = Number(product.price || 0);

  return {
    id: product.id,
    category: categoryKey,
    categoryLabel: product.category_name || 'منتجات الواحة',
    name: product.name,
    shortDesc: product.description || 'منتج أصيل من واحة سيوة.',
    desc: product.description || 'منتج أصيل من واحة سيوة.',
    weight: product.stock > 0 ? 'متوفر الآن' : 'غير متوفر حالياً',
    price,
    oldPrice: null,
    currency: 'ج.م',
    image: product.image_url,
    rating: 4.7,
    reviews: Number(product.total_sold || 0),
    badge: badgeLabels[product.badge] || '',
    tags: [product.category_name, product.badge].filter(Boolean),
    stock: Number(product.stock || 0),
    sortOrder: Number(product.sort_order || 0),
    isActive: product.is_active ?? true,
    source: 'api',
  };
}

function buildCategories(categories) {
  return [
    { key: 'all', label: 'الكل', emoji: '✨' },
    ...categories.map((category) => ({
      key: category.slug,
      label: category.name,
      emoji: mapEmoji(category.slug),
    })),
  ];
}

export async function loadCatalog() {
  try {
    const [productsResponse, categoriesResponse] = await Promise.all([
      publicApi.get('/products'),
      publicApi.get('/categories'),
    ]);

    const apiProducts = Array.isArray(productsResponse.data?.products) ? productsResponse.data.products : [];
    const apiCategories = Array.isArray(categoriesResponse.data?.categories) ? categoriesResponse.data.categories : [];

    const products = apiProducts
      .map((product, index) => normalizeProduct(product, index));

    return {
      products,
      categories: buildCategories(apiCategories),
      source: 'api',
    };
  } catch (error) {
    console.error('Failed to load catalog:', error);
    return {
      products: [],
      categories: [{ key: 'all', label: 'الكل', emoji: '✨' }],
      source: 'api',
    };
  }
}
