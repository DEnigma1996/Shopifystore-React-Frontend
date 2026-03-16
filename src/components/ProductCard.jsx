import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Text, Button, InlineStack, BlockStack, Thumbnail, Badge } from '@shopify/polaris';
import { CartIcon } from '@shopify/polaris-icons';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart, loading } = useCart();

  const image = product.images?.[0];
  const variant = product.variants?.[0];
  const price = variant?.price?.amount ?? variant?.price;
  const currency = variant?.price?.currencyCode ?? 'USD';
  const available = variant?.available !== false;

  const handleAddToCart = useCallback(
    (e) => {
      e.stopPropagation();
      if (variant?.id) {
        addToCart(variant.id, 1);
      }
    },
    [addToCart, variant]
  );

  const handleCardClick = useCallback(() => {
    navigate(`/products/${product.handle}`);
  }, [navigate, product.handle]);

  return (
    <div
      onClick={handleCardClick}
      style={{ cursor: 'pointer', height: '100%' }}
      role="article"
    >
      <Card>
        <BlockStack gap="300">
          {/* Product image */}
          <div
            style={{
              borderRadius: '8px',
              overflow: 'hidden',
              background: '#f6f6f7',
              aspectRatio: '1 / 1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {image ? (
              <img
                src={image.src}
                alt={image.altText || product.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Thumbnail
                source={image?.src || ''}
                alt={product.title}
                size="large"
              />
            )}
          </div>

          {/* Product details */}
          <BlockStack gap="200">
            <InlineStack align="space-between" blockAlign="start">
              <BlockStack gap="100">
                <Text variant="headingSm" as="h3" fontWeight="semibold">
                  {product.title}
                </Text>
                <Text variant="bodySm" tone="subdued">
                  {product.productType}
                </Text>
              </BlockStack>
              <Badge tone={available ? 'success' : 'critical'} size="small">
                {available ? 'In Stock' : 'Sold Out'}
              </Badge>
            </InlineStack>

            <InlineStack align="space-between" blockAlign="center">
              <Text variant="headingSm" as="p" fontWeight="bold">
                {price
                  ? new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency,
                    }).format(parseFloat(price))
                  : ''}
              </Text>
              <Badge tone="info" size="small">
                One Size
              </Badge>
            </InlineStack>

            <div onClick={(e) => e.stopPropagation()}>
              <Button
                icon={CartIcon}
                fullWidth
                variant="primary"
                disabled={!available || loading}
                onClick={handleAddToCart}
                accessibilityLabel={`Add ${product.title} to cart`}
              >
                Add to Cart
              </Button>
            </div>
          </BlockStack>
        </BlockStack>
      </Card>
    </div>
  );
}
