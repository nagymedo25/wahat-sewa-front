import { publicApi } from '@/services/api.js';

const badgeLabels = {
  best_seller: 'الأكثر مبيعًا',
  most_requested: 'الأكثر طلبًا',
  featured: 'مميز',
  new_arrival: 'الوافد الجديد',
  none: '',
};

/**
 * Lucide icon names per category/subcategory slug.
 */
const iconMap = {
  all: 'LayoutGrid',
  oils: 'Droplets',
  olives: 'CircleDot',
  herbs: 'Sprout',
  dates: 'Palmtree',
  care: 'Sparkles',
  lamps: 'Lamp',
  jams: 'Package',
  candles: 'Flame',
  soaps: 'Sparkles',
  shampoos: 'Droplets',
};

const defaultIcon = 'Package';

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function mapCategoryIcon(categorySlug, dbIcon) {
  if (dbIcon && iconMap[dbIcon]) return dbIcon;
  return iconMap[categorySlug] || defaultIcon;
}

export function normalizeProduct(product, index = 0) {
  const categoryKey = product.category_slug || slugify(product.category_name || product.name || `category-${index}`);
  const subcategoryKey = product.subcategory_slug || null;
  const price = Number(product.price || 0);
  const originalPrice = product.original_price ? Number(product.original_price) : null;

  // Only show discount if original_price is a real number greater than selling price
  const validDiscount = originalPrice !== null && originalPrice > price;
  const discountAmount = validDiscount ? originalPrice - price : 0;
  const discountPercent = validDiscount ? Math.round((discountAmount / originalPrice) * 100) : null;

  return {
    id: product.id,
    categoryId: product.category_id,
    category: categoryKey,
    categoryLabel: product.category_name || 'منتجات الواحة',
    subcategoryId: product.subcategory_id,
    subcategory: subcategoryKey,
    subcategoryLabel: product.subcategory_name || null,
    name: product.name,
    shortDesc: product.description || 'منتج أصيل من واحة سيوة.',
    desc: product.description || 'منتج أصيل من واحة سيوة.',
    weight: 'متوفر الآن',
    price,
    oldPrice: validDiscount ? originalPrice : null,
    discountAmount,
    discountPercent,
    currency: 'ج.م',
    image: product.image_url,
    totalSold: Number(product.total_sold || 0),
    badge: badgeLabels[product.badge] || '',
    rawBadge: product.badge || 'none',
    tags: [product.category_name, product.subcategory_name, product.badge].filter(Boolean),
    stock: 999,
    sortOrder: Number(product.sort_order || 0),
    isActive: product.is_active ?? true,
    source: 'api',
  };
}

export function buildCategoriesTree(treeData = [], flatCategories = []) {
  if (Array.isArray(treeData) && treeData.length > 0) {
    return [
      { key: 'all', label: 'كل المنتجات', slug: 'all', icon: 'LayoutGrid', subcategories: [] },
      ...treeData.map(cat => ({
        id: cat.id,
        key: cat.slug,
        slug: cat.slug,
        label: cat.name,
        name: cat.name,
        icon: mapCategoryIcon(cat.slug, cat.icon),
        productCount: Number(cat.product_count || 0),
        subcategories: (cat.subcategories || []).map(sub => ({
          id: sub.id,
          key: sub.slug,
          slug: sub.slug,
          label: sub.name,
          name: sub.name,
          icon: mapCategoryIcon(sub.slug, sub.icon),
          productCount: Number(sub.product_count || 0),
        }))
      }))
    ];
  }

  // Fallback if tree is not returned
  const parents = flatCategories.filter(c => !c.parent_id);
  const children = flatCategories.filter(c => c.parent_id);

  return [
    { key: 'all', label: 'كل المنتجات', slug: 'all', icon: 'LayoutGrid', subcategories: [] },
    ...parents.map(parent => ({
      id: parent.id,
      key: parent.slug,
      slug: parent.slug,
      label: parent.name,
      name: parent.name,
      icon: mapCategoryIcon(parent.slug, parent.icon),
      subcategories: children.filter(c => c.parent_id === parent.id).map(sub => ({
        id: sub.id,
        key: sub.slug,
        slug: sub.slug,
        label: sub.name,
        name: sub.name,
        icon: mapCategoryIcon(sub.slug, sub.icon)
      }))
    }))
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
    const apiTree = Array.isArray(categoriesResponse.data?.tree) ? categoriesResponse.data.tree : [];

    const products = apiProducts.map((product, index) => normalizeProduct(product, index));

    return {
      products,
      categories: buildCategoriesTree(apiTree, apiCategories),
      source: 'api',
    };
  } catch (error) {
    console.error('Failed to load catalog:', error);
    return {
      products: [],
      categories: [{ key: 'all', label: 'كل المنتجات', slug: 'all', icon: 'LayoutGrid', subcategories: [] }],
      source: 'api',
    };
  }
}

export async function loadProduct(productId) {
  try {
    const response = await publicApi.get(`/products/${productId}`);
    const product = response.data?.product;
    if (!product) return null;
    return normalizeProduct(product, 0);
  } catch (error) {
    console.error('Failed to load product:', error);
    return null;
  }
}
