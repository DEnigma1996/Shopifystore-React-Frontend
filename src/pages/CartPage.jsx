import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Page,
  Card,
  Text,
  Button,
  BlockStack,
  InlineStack,
  InlineGrid,
  EmptyState,
  Divider,
  Banner,
  Thumbnail,
} from '@shopify/polaris';
import { DeleteIcon, CartIcon } from '@shopify/polaris-icons';
import { useCart } from '../context/CartContext';
import { MOCK_PRODUCTS } from '../api/shopify';
import Seo from '../components/Seo';

const isCheckoutUrlSafe = (url) => {
  if (!url || url.startsWith('#')) return false;
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

function getProductInfo(variantId) {
  for (const product of MOCK_PRODUCTS) {
    const variant = product.variants?.find((v) => v.id === variantId);
    if (variant) return { product, variant };
  }
  return null;
}

function CartLineItem({ item, onRemove, onUpdateQuantity }) {
  const info = getProductInfo(item.variantId);
  const product = info?.product ?? { title: 'Unknown Product', images: [] };
  const variant = info?.variant ?? {};
  const price = variant?.price?.amount ?? variant?.price ?? '0';
  const currency = variant?.price?.currencyCode ?? 'USD';
  const image = product.images?.[0];
  const lineTotal = parseFloat(price) * (item.quantity || 1);

  return (
    <div>
      <InlineStack gap="400" blockAlign="start" wrap={false}>
        {/* Product image */}
        <div
          style={{
            borderRadius: '8px',
            overflow: 'hidden',
            flexShrink: 0,
            width: '80px',
            height: '80px',
            background: '#f6f6f7',
          }}
        >
          {image ? (
            <img
              src={image.src}
              alt={image.altText || product.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <Thumbnail source="" alt={product.title} size="small" />
          )}
        </div>

        {/* Product details */}
        <BlockStack gap="200" inlineSize="fill">
          <InlineStack align="space-between" blockAlign="start" wrap={false}>
            <BlockStack gap="100">
              <Text variant="headingSm" as="h3">
                {product.title}
              </Text>
              <Text variant="bodySm" tone="subdued">
                One Size · {product.productType}
              </Text>
            </BlockStack>
            <Text variant="headingSm" as="p" fontWeight="bold">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency,
              }).format(lineTotal)}
            </Text>
          </InlineStack>

          <InlineStack gap="300" blockAlign="center">
            {/* Quantity controls */}
            <InlineStack gap="200" blockAlign="center">
              <Button
                size="slim"
                onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) - 1)}
                accessibilityLabel="Decrease quantity"
              >
                −
              </Button>
              <Text variant="bodyMd" as="span">
                {item.quantity || 1}
              </Text>
              <Button
                size="slim"
                onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                accessibilityLabel="Increase quantity"
              >
                +
              </Button>
            </InlineStack>

            <Button
              icon={DeleteIcon}
              variant="plain"
              tone="critical"
              onClick={() => onRemove(item.id)}
              accessibilityLabel={`Remove ${product.title} from cart`}
            >
              Remove
            </Button>
          </InlineStack>
        </BlockStack>
      </InlineStack>
    </div>
  );
}

export default function CartPage() {
  const navigate = useNavigate();
  const {
    lineItems,
    subtotalPrice,
    totalPrice,
    totalTax,
    checkoutUrl,
    loading,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const handleCheckout = useCallback(() => {
    if (isCheckoutUrlSafe(checkoutUrl)) {
      window.location.assign(checkoutUrl);
    } else {
      alert(
        'Checkout is not configured. Please set your Shopify credentials in .env to enable checkout.'
      );
    }
  }, [checkoutUrl]);

  // Compute totals from product data (for mock mode where checkout prices are $0)
  const computedSubtotal = lineItems.reduce((sum, item) => {
    const info = getProductInfo(item.variantId);
    const price = info?.variant?.price?.amount ?? info?.variant?.price ?? '0';
    return sum + parseFloat(price) * (item.quantity || 1);
  }, 0);

  const serverSubtotal = parseFloat(subtotalPrice?.amount ?? '0');
  const useComputed = serverSubtotal === 0 && computedSubtotal > 0;

  const cartTotal = useComputed
    ? computedSubtotal.toFixed(2)
    : (totalPrice?.amount ?? subtotalPrice?.amount ?? '0.00');
  const currency = totalPrice?.currencyCode ?? subtotalPrice?.currencyCode ?? 'USD';
  const tax = useComputed ? '0.00' : (totalTax?.amount ?? '0.00');
  const subtotal = useComputed
    ? computedSubtotal.toFixed(2)
    : (subtotalPrice?.amount ?? '0.00');

  if (lineItems.length === 0) {
    return (
      <Page
        title="Your Cart"
        backAction={{ content: 'Continue Shopping', onAction: () => navigate('/') }}
      >
        <Seo
          title="Your Cart"
          description="Review the items in your KnitWear Co. cart."
          robots="noindex, follow"
        />
        <EmptyState
          heading="Your cart is empty"
          action={{
            content: "Shop Women's Collection",
            onAction: () => navigate('/collections/womens'),
          }}
          secondaryAction={{
            content: "Shop Men's Collection",
            onAction: () => navigate('/collections/mens'),
          }}
          image=""
        >
          <p>Add some cozy knit wear to your cart to get started!</p>
          <p style={{ marginTop: '8px', fontSize: '48px' }}>🧶</p>
        </EmptyState>
      </Page>
    );
  }

  return (
    <Page
      title="Your Cart"
      subtitle={`${lineItems.length} item${lineItems.length !== 1 ? 's' : ''}`}
      backAction={{ content: 'Continue Shopping', onAction: () => navigate('/') }}
      primaryAction={{
        content: 'Checkout',
        onAction: handleCheckout,
        loading,
        icon: CartIcon,
      }}
    >
      <Seo
        title="Your Cart"
        description="Review the items in your KnitWear Co. cart."
        robots="noindex, follow"
      />
      <InlineGrid columns={{ xs: 1, md: '2fr 1fr' }} gap="400">
        {/* Cart Items */}
        <BlockStack gap="400">
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Items in Your Cart
              </Text>
              <Divider />
              <BlockStack gap="400" divider="divider">
                {lineItems.map((item, idx) => (
                  <div key={item.id || idx}>
                    <CartLineItem
                      item={item}
                      onRemove={removeFromCart}
                      onUpdateQuantity={updateQuantity}
                    />
                  </div>
                ))}
              </BlockStack>
            </BlockStack>
          </Card>
        </BlockStack>

        {/* Order Summary */}
        <BlockStack gap="400">
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Order Summary
              </Text>
              <Divider />
              <BlockStack gap="200">
                <InlineStack align="space-between">
                  <Text variant="bodyMd">Subtotal</Text>
                  <Text variant="bodyMd">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency,
                    }).format(parseFloat(subtotal))}
                  </Text>
                </InlineStack>
                <InlineStack align="space-between">
                  <Text variant="bodyMd">Tax</Text>
                  <Text variant="bodyMd">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency,
                    }).format(parseFloat(tax))}
                  </Text>
                </InlineStack>
                <InlineStack align="space-between">
                  <Text variant="bodyMd" tone="subdued">
                    Shipping
                  </Text>
                  <Text variant="bodyMd" tone="success">
                    Calculated at checkout
                  </Text>
                </InlineStack>
              </BlockStack>
              <Divider />
              <InlineStack align="space-between">
                <Text variant="headingMd" as="p" fontWeight="bold">
                  Total
                </Text>
                <Text variant="headingMd" as="p" fontWeight="bold">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency,
                  }).format(parseFloat(cartTotal))}
                </Text>
              </InlineStack>
              <Button
                variant="primary"
                size="large"
                fullWidth
                loading={loading}
                onClick={handleCheckout}
                icon={CartIcon}
              >
                Proceed to Checkout
              </Button>
              <Button fullWidth onClick={() => navigate('/')}>
                Continue Shopping
              </Button>
            </BlockStack>
          </Card>

          {/* Trust badges */}
          <Card>
            <BlockStack gap="200">
              <Banner tone="success" title="Secure Checkout">
                <p>Your payment information is encrypted and secure.</p>
              </Banner>
              <BlockStack gap="100">
                {[
                  '🔒 SSL Encrypted',
                  '📦 Free shipping over $50',
                  '↩️ 30-day returns',
                  '🧶 Handcrafted quality',
                ].map((item) => (
                  <Text key={item} variant="bodySm">
                    {item}
                  </Text>
                ))}
              </BlockStack>
            </BlockStack>
          </Card>
        </BlockStack>
      </InlineGrid>
    </Page>
  );
}
