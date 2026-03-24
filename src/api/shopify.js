import Client from 'shopify-buy';

const domain = import.meta.env.VITE_SHOPIFY_DOMAIN;
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

// Build Shopify client only when credentials are provided
let shopifyClient = null;
if (domain && storefrontAccessToken) {
  shopifyClient = Client.buildClient({
    domain,
    storefrontAccessToken,
    apiVersion: '2024-01',
  });
}

// ---------------------------------------------------------------------------
// Mock data – used when no real Shopify credentials are configured.
// Replace with your actual products by setting the .env variables.
// ---------------------------------------------------------------------------

export const MOCK_PRODUCTS = [
  {
    id: 'product-1',
    title: 'Classic Knit Beanie',
    handle: 'classic-knit-beanie',
    description:
      'A timeless knitted beanie crafted from premium merino wool. One size fits all adults. Keeps you warm and stylish.',
    vendor: 'KnitWear Co.',
    productType: 'Beanie',
    tags: ['mens', 'womens', 'beanie', 'winter', 'one-size'],
    images: [
      {
        id: 'img-1-1',
        src: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&q=80',
        altText: 'Classic Knit Beanie in Charcoal',
      },
    ],
    variants: [
      {
        id: 'variant-1',
        title: 'One Size',
        price: { amount: '24.99', currencyCode: 'USD' },
        available: true,
      },
    ],
    collections: ['mens', 'womens'],
  },
  {
    id: 'product-2',
    title: 'Chunky Knit Scarf',
    handle: 'chunky-knit-scarf',
    description:
      'Luxuriously thick hand-knitted scarf. Extra long for multiple styling options. One size fits all.',
    vendor: 'KnitWear Co.',
    productType: 'Scarf',
    tags: ['mens', 'womens', 'scarf', 'winter', 'one-size'],
    images: [
      {
        id: 'img-2-1',
        src: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600&q=80',
        altText: 'Chunky Knit Scarf in Cream',
      },
    ],
    variants: [
      {
        id: 'variant-2',
        title: 'One Size',
        price: { amount: '34.99', currencyCode: 'USD' },
        available: true,
      },
    ],
    collections: ['mens', 'womens'],
  },
  {
    id: 'product-3',
    title: "Men's Wool Pullover Sweater",
    handle: 'mens-wool-pullover-sweater',
    description:
      'Classic cable-knit pullover sweater for men. Made from 100% Shetland wool. Relaxed one-size-fits-all cut.',
    vendor: 'KnitWear Co.',
    productType: 'Sweater',
    tags: ['mens', 'sweater', 'winter', 'one-size'],
    images: [
      {
        id: 'img-3-1',
        src: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80',
        altText: "Men's Wool Pullover Sweater in Navy",
      },
    ],
    variants: [
      {
        id: 'variant-3',
        title: 'One Size',
        price: { amount: '79.99', currencyCode: 'USD' },
        available: true,
      },
    ],
    collections: ['mens'],
  },
  {
    id: 'product-4',
    title: "Women's Oversized Knit Cardigan",
    handle: 'womens-oversized-knit-cardigan',
    description:
      'Cozy oversized cardigan with deep pockets and button-front. Perfect relaxed fit for all body types.',
    vendor: 'KnitWear Co.',
    productType: 'Cardigan',
    tags: ['womens', 'cardigan', 'winter', 'one-size'],
    images: [
      {
        id: 'img-4-1',
        src: 'https://images.unsplash.com/photo-1580331451062-99ff652288d7?w=600&q=80',
        altText: "Women's Oversized Knit Cardigan in Oatmeal",
      },
    ],
    variants: [
      {
        id: 'variant-4',
        title: 'One Size',
        price: { amount: '89.99', currencyCode: 'USD' },
        available: true,
      },
    ],
    collections: ['womens'],
  },
  {
    id: 'product-5',
    title: 'Knitted Fingerless Gloves',
    handle: 'knitted-fingerless-gloves',
    description:
      'Stretchy ribbed fingerless gloves that fit virtually any hand size. Perfect for typing, driving, or outdoor activities.',
    vendor: 'KnitWear Co.',
    productType: 'Gloves',
    tags: ['mens', 'womens', 'gloves', 'winter', 'one-size'],
    images: [
      {
        id: 'img-5-1',
        src: 'https://images.unsplash.com/photo-1607077153086-c2f4f38b3d64?w=600&q=80',
        altText: 'Knitted Fingerless Gloves in Grey',
      },
    ],
    variants: [
      {
        id: 'variant-5',
        title: 'One Size',
        price: { amount: '19.99', currencyCode: 'USD' },
        available: true,
      },
    ],
    collections: ['mens', 'womens'],
  },
  {
    id: 'product-6',
    title: "Women's Knit Wrap Poncho",
    handle: 'womens-knit-wrap-poncho',
    description:
      'Elegant open-front poncho with fringe trim. Draped styling fits all sizes beautifully.',
    vendor: 'KnitWear Co.',
    productType: 'Poncho',
    tags: ['womens', 'poncho', 'winter', 'one-size'],
    images: [
      {
        id: 'img-6-1',
        src: 'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=600&q=80',
        altText: "Women's Knit Wrap Poncho in Burgundy",
      },
    ],
    variants: [
      {
        id: 'variant-6',
        title: 'One Size',
        price: { amount: '64.99', currencyCode: 'USD' },
        available: true,
      },
    ],
    collections: ['womens'],
  },
  {
    id: 'product-7',
    title: "Men's Cable Knit Vest",
    handle: 'mens-cable-knit-vest',
    description:
      'Traditional Aran cable-knit sleeveless vest. Versatile one-size-fits-all styling for layering.',
    vendor: 'KnitWear Co.',
    productType: 'Vest',
    tags: ['mens', 'vest', 'winter', 'one-size'],
    images: [
      {
        id: 'img-7-1',
        src: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?w=600&q=80',
        altText: "Men's Cable Knit Vest in Cream",
      },
    ],
    variants: [
      {
        id: 'variant-7',
        title: 'One Size',
        price: { amount: '54.99', currencyCode: 'USD' },
        available: true,
      },
    ],
    collections: ['mens'],
  },
  {
    id: 'product-8',
    title: 'Knitted Leg Warmers',
    handle: 'knitted-leg-warmers',
    description:
      'Thick ribbed leg warmers that stretch to fit any leg size. Great for layering over leggings or jeans.',
    vendor: 'KnitWear Co.',
    productType: 'Leg Warmers',
    tags: ['womens', 'leg-warmers', 'winter', 'one-size'],
    images: [
      {
        id: 'img-8-1',
        src: 'https://images.unsplash.com/photo-1559334417-a5cc5e44b1cd?w=600&q=80',
        altText: 'Knitted Leg Warmers in Dusty Rose',
      },
    ],
    variants: [
      {
        id: 'variant-8',
        title: 'One Size',
        price: { amount: '22.99', currencyCode: 'USD' },
        available: true,
      },
    ],
    collections: ['womens'],
  },
];

export const MOCK_COLLECTIONS = [
  {
    id: 'collection-mens',
    handle: 'mens',
    title: "Men's Collection",
    description:
      'Warm, comfortable knitted wear designed for men. All items are one size fits all.',
    image: {
      src: 'https://images.unsplash.com/photo-1548369937-47519962c11a?w=800&q=80',
      altText: "Men's Knitted Collection",
    },
    products: MOCK_PRODUCTS.filter((p) => p.collections.includes('mens')),
  },
  {
    id: 'collection-womens',
    handle: 'womens',
    title: "Women's Collection",
    description:
      'Elegant and cozy knitted wear designed for women. All items are one size fits all.',
    image: {
      src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
      altText: "Women's Knitted Collection",
    },
    products: MOCK_PRODUCTS.filter((p) => p.collections.includes('womens')),
  },
];

// ---------------------------------------------------------------------------
// API functions – use real Shopify client when available, else mock data
// ---------------------------------------------------------------------------

export async function fetchAllProducts() {
  if (shopifyClient) {
    const products = await shopifyClient.product.fetchAll(20);
    return products;
  }
  return MOCK_PRODUCTS;
}

export async function fetchProductByHandle(handle) {
  if (shopifyClient) {
    const product = await shopifyClient.product.fetchByHandle(handle);
    return product;
  }
  return MOCK_PRODUCTS.find((p) => p.handle === handle) || null;
}

export async function fetchAllCollections() {
  if (shopifyClient) {
    const collections = await shopifyClient.collection.fetchAll(20);
    return collections;
  }
  return MOCK_COLLECTIONS;
}

export async function fetchCollectionByHandle(handle) {
  if (shopifyClient) {
    const collection = await shopifyClient.collection.fetchByHandle(handle);
    if (collection) return collection;
    const collections = await shopifyClient.collection.fetchAll(20);
    return collections.find((c) => c.id === handle) || null;
  }
  return MOCK_COLLECTIONS.find((c) => c.handle === handle) || null;
}

const normalizeSearchQuery = (value) =>
  value
    .trim()
    .replace(/["\\]+/g, '')
    .replace(/\s+/g, ' ')
    .slice(0, 80);

const buildShopifySearchQuery = (value) => {
  const sanitized = normalizeSearchQuery(value);
  if (!sanitized) return '';
  return `title:*${sanitized}* OR product_type:*${sanitized}* OR tag:*${sanitized}*`;
};

export async function searchProducts(query) {
  const sanitized = normalizeSearchQuery(query);
  if (!sanitized) return [];
  if (shopifyClient) {
    const products = await shopifyClient.product.fetchQuery({
      first: 40,
      query: buildShopifySearchQuery(sanitized),
    });
    return products;
  }
  const q = sanitized.toLowerCase();
  return MOCK_PRODUCTS.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.productType.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export async function fetchRelatedProducts(productId, limit = 4) {
  if (shopifyClient && productId) {
    const products = await shopifyClient.product.fetchProductRecommendations(
      productId
    );
    return products.slice(0, limit);
  }
  return MOCK_PRODUCTS.filter((p) => p.id !== productId).slice(0, limit);
}

// ---------------------------------------------------------------------------
// Checkout functions
// ---------------------------------------------------------------------------

export async function createCheckout() {
  if (shopifyClient) {
    const checkout = await shopifyClient.checkout.create();
    return checkout;
  }
  // Mock checkout for demo
  return {
    id: 'mock-checkout-id',
    webUrl: '#checkout-not-configured',
    lineItems: [],
    subtotalPrice: { amount: '0.00', currencyCode: 'USD' },
    totalTax: { amount: '0.00', currencyCode: 'USD' },
    totalPrice: { amount: '0.00', currencyCode: 'USD' },
  };
}

export async function fetchCheckout(checkoutId) {
  if (shopifyClient) {
    const checkout = await shopifyClient.checkout.fetch(checkoutId);
    return checkout;
  }
  return null;
}

export async function addLineItems(checkoutId, lineItems) {
  if (shopifyClient) {
    const checkout = await shopifyClient.checkout.addLineItems(
      checkoutId,
      lineItems
    );
    return checkout;
  }
  return null;
}

export async function removeLineItems(checkoutId, lineItemIds) {
  if (shopifyClient) {
    const checkout = await shopifyClient.checkout.removeLineItems(
      checkoutId,
      lineItemIds
    );
    return checkout;
  }
  return null;
}

export async function updateLineItems(checkoutId, lineItems) {
  if (shopifyClient) {
    const checkout = await shopifyClient.checkout.updateLineItems(
      checkoutId,
      lineItems
    );
    return checkout;
  }
  return null;
}

export { shopifyClient };
