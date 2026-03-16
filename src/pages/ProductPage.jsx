import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Page,
  Card,
  Text,
  Button,
  BlockStack,
  InlineStack,
  Badge,
  Thumbnail,
  SkeletonBodyText,
  SkeletonDisplayText,
  EmptyState,
  Divider,
  Banner,
  Toast,
  Frame,
  List,
} from '@shopify/polaris';
import { CartIcon } from '@shopify/polaris-icons';
import { fetchProductByHandle, MOCK_PRODUCTS } from '../api/shopify';
import { useCart } from '../context/CartContext';

export default function ProductPage() {
  const { handle } = useParams();
  const navigate = useNavigate();
  const { addToCart, loading: cartLoading } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [toastActive, setToastActive] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchProductByHandle(handle)
      .then((p) => {
        setProduct(p);
        setSelectedImage(0);
      })
      .finally(() => setLoading(false));
  }, [handle]);

  const handleAddToCart = useCallback(async () => {
    if (!product) return;
    const variant = product.variants?.[0];
    if (variant?.id) {
      await addToCart(variant.id, 1);
      setToastMessage(`${product.title} added to cart!`);
      setToastActive(true);
    }
  }, [product, addToCart]);

  const dismissToast = useCallback(() => setToastActive(false), []);

  // Related products (other products, excluding current)
  const relatedProducts = MOCK_PRODUCTS.filter(
    (p) => p.handle !== handle
  ).slice(0, 4);

  if (loading) {
    return (
      <Page
        title="Loading product…"
        backAction={{ content: 'Back', onAction: () => navigate(-1) }}
      >
        <Card>
          <InlineStack gap="800" blockAlign="start" wrap={false}>
            <div style={{ flex: '1', minWidth: 280 }}>
              <SkeletonDisplayText size="large" />
            </div>
            <div style={{ flex: '1' }}>
              <BlockStack gap="400">
                <SkeletonDisplayText size="medium" />
                <SkeletonBodyText lines={5} />
              </BlockStack>
            </div>
          </InlineStack>
        </Card>
      </Page>
    );
  }

  if (!product) {
    return (
      <Page
        title="Product Not Found"
        backAction={{ content: 'Back', onAction: () => navigate(-1) }}
      >
        <EmptyState
          heading="Product not found"
          action={{ content: 'Continue shopping', onAction: () => navigate('/') }}
          image=""
        >
          <p>This product may no longer be available.</p>
        </EmptyState>
      </Page>
    );
  }

  const variant = product.variants?.[0];
  const price = variant?.price?.amount ?? variant?.price;
  const currency = variant?.price?.currencyCode ?? 'USD';
  const available = variant?.available !== false;
  const images = product.images || [];

  const toastMarkup = toastActive ? (
    <Toast content={toastMessage} onDismiss={dismissToast} duration={3000} />
  ) : null;

  return (
    <Frame>
      {toastMarkup}
      <Page
        title={product.title}
        backAction={{ content: 'Back', onAction: () => navigate(-1) }}
      >
        <BlockStack gap="600">
          {/* Main Product Section */}
          <Card>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '32px',
                alignItems: 'start',
              }}
            >
              {/* Images */}
              <BlockStack gap="300">
                <div
                  style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: '#f6f6f7',
                    aspectRatio: '1 / 1',
                  }}
                >
                  {images[selectedImage] ? (
                    <img
                      src={images[selectedImage].src}
                      alt={images[selectedImage].altText || product.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: '#8c9196',
                        fontSize: '64px',
                      }}
                    >
                      🧶
                    </div>
                  )}
                </div>
                {/* Thumbnail strip */}
                {images.length > 1 && (
                  <InlineStack gap="200">
                    {images.map((img, idx) => (
                      <div
                        key={img.id || idx}
                        onClick={() => setSelectedImage(idx)}
                        style={{
                          cursor: 'pointer',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          border:
                            idx === selectedImage
                              ? '2px solid #008060'
                              : '2px solid transparent',
                          width: '64px',
                          height: '64px',
                        }}
                      >
                        <Thumbnail
                          source={img.src}
                          alt={img.altText || product.title}
                          size="small"
                        />
                      </div>
                    ))}
                  </InlineStack>
                )}
              </BlockStack>

              {/* Product Info */}
              <BlockStack gap="400">
                <BlockStack gap="200">
                  <InlineStack align="space-between" blockAlign="start">
                    <BlockStack gap="100">
                      <Text variant="heading2xl" as="h1">
                        {product.title}
                      </Text>
                      {product.vendor && (
                        <Text variant="bodyMd" tone="subdued">
                          by {product.vendor}
                        </Text>
                      )}
                    </BlockStack>
                    <InlineStack gap="200">
                      <Badge tone="success">One Size Fits All</Badge>
                      <Badge tone={available ? 'success' : 'critical'}>
                        {available ? 'In Stock' : 'Sold Out'}
                      </Badge>
                    </InlineStack>
                  </InlineStack>

                  <Text variant="heading2xl" as="p" tone="success">
                    {price
                      ? new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency,
                        }).format(parseFloat(price))
                      : ''}
                  </Text>
                </BlockStack>

                <Divider />

                <BlockStack gap="300">
                  <Text variant="headingMd" as="h2">
                    Description
                  </Text>
                  <Text variant="bodyMd" as="p">
                    {product.description}
                  </Text>
                </BlockStack>

                <Divider />

                {/* Size & Fit */}
                <BlockStack gap="200">
                  <Text variant="headingMd" as="h2">
                    Size & Fit
                  </Text>
                  <Banner tone="info" title="One Size Fits All">
                    <p>
                      This item is designed to comfortably fit adults of most
                      sizes. Our elastic-blend yarns provide excellent stretch
                      and recovery.
                    </p>
                  </Banner>
                </BlockStack>

                <Divider />

                {/* Product Features */}
                <BlockStack gap="200">
                  <Text variant="headingMd" as="h2">
                    Features
                  </Text>
                  <List type="bullet">
                    <List.Item>Premium quality yarns</List.Item>
                    <List.Item>One size fits all adults</List.Item>
                    <List.Item>Machine washable on gentle cycle</List.Item>
                    <List.Item>Ethically sourced materials</List.Item>
                    {product.productType && (
                      <List.Item>Category: {product.productType}</List.Item>
                    )}
                  </List>
                </BlockStack>

                <Divider />

                {/* Add to Cart */}
                <BlockStack gap="300">
                  <Button
                    icon={CartIcon}
                    size="large"
                    variant="primary"
                    fullWidth
                    disabled={!available || cartLoading}
                    loading={cartLoading}
                    onClick={handleAddToCart}
                  >
                    {available ? 'Add to Cart' : 'Sold Out'}
                  </Button>
                  <Button size="large" fullWidth onClick={() => navigate('/cart')}>
                    View Cart
                  </Button>
                </BlockStack>

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <BlockStack gap="200">
                    <Text variant="bodySm" tone="subdued">
                      Tags:{' '}
                      {product.tags
                        .filter((t) => !['mens', 'womens', 'one-size'].includes(t))
                        .join(', ')}
                    </Text>
                  </BlockStack>
                )}
              </BlockStack>
            </div>
          </Card>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <BlockStack gap="400">
              <Text variant="headingXl" as="h2">
                You May Also Like
              </Text>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: '16px',
                }}
              >
                {relatedProducts.map((rp) => (
                  <div
                    key={rp.id}
                    onClick={() => navigate(`/products/${rp.handle}`)}
                    style={{ cursor: 'pointer' }}
                    role="article"
                  >
                    <Card>
                      <BlockStack gap="200">
                        <div
                          style={{
                            borderRadius: '8px',
                            overflow: 'hidden',
                            aspectRatio: '1/1',
                          }}
                        >
                          <img
                            src={rp.images?.[0]?.src}
                            alt={rp.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </div>
                        <Text variant="headingSm" as="h3">
                          {rp.title}
                        </Text>
                        <Text variant="bodySm" tone="subdued">
                          {rp.variants?.[0]
                            ? new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency:
                                  rp.variants[0].price?.currencyCode ?? 'USD',
                              }).format(
                                parseFloat(
                                  rp.variants[0].price?.amount ?? rp.variants[0].price
                                )
                              )
                            : ''}
                        </Text>
                      </BlockStack>
                    </Card>
                  </div>
                ))}
              </div>
            </BlockStack>
          )}
        </BlockStack>
      </Page>
    </Frame>
  );
}
