import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Page,
  Card,
  Text,
  Button,
  InlineStack,
  BlockStack,
  Grid,
  Banner,
  Divider,
  SkeletonBodyText,
  SkeletonDisplayText,
  InlineGrid,
} from '@shopify/polaris';
import { fetchAllProducts, MOCK_COLLECTIONS } from '../api/shopify';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllProducts()
      .then((products) => {
        setFeaturedProducts(products.slice(0, 4));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Page>
      {/* Hero Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          borderRadius: '16px',
          padding: '80px 48px',
          marginBottom: '32px',
          textAlign: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.05) 0%, transparent 60%), radial-gradient(circle at 70% 50%, rgba(255,255,255,0.03) 0%, transparent 60%)',
          }}
        />
        <BlockStack gap="500" align="center">
          <Text variant="heading2xl" as="h1" tone="magic">
            🧶 KnitWear Co.
          </Text>
          <Text variant="headingXl" as="h2">
            Handcrafted Knitted Wear for Everyone
          </Text>
          <Text variant="bodyLg" as="p" tone="subdued">
            Premium knitted accessories and clothing — one size fits all. <br />
            Crafted with care, designed for comfort.
          </Text>
          <InlineStack gap="400" align="center">
            <Button
              variant="primary"
              size="large"
              onClick={() => navigate('/collections/womens')}
            >
              Shop Women's
            </Button>
            <Button
              size="large"
              onClick={() => navigate('/collections/mens')}
              tone="magic"
            >
              Shop Men's
            </Button>
          </InlineStack>
        </BlockStack>
      </div>

      {/* One Size Fits All Banner */}
      <div style={{ marginBottom: '32px' }}>
        <Banner tone="info" title="✨ One Size Fits All">
          <p>
            Every item in our collection is crafted with premium stretch yarns
            and designed to fit a wide range of body types. No more size
            confusion — just pick what you love!
          </p>
        </Banner>
      </div>

      {/* Collections Section */}
      <div style={{ marginBottom: '40px' }}>
        <BlockStack gap="400">
          <Text variant="headingXl" as="h2">
            Shop by Collection
          </Text>
          <InlineGrid columns={{ xs: 1, sm: 2 }} gap="400">
            {MOCK_COLLECTIONS.map((collection) => (
              <div
                key={collection.id}
                onClick={() => navigate(`/collections/${collection.handle}`)}
                style={{ cursor: 'pointer' }}
                role="article"
              >
                <Card>
                  <BlockStack gap="300">
                    <div
                      style={{
                        borderRadius: '8px',
                        overflow: 'hidden',
                        aspectRatio: '16 / 9',
                      }}
                    >
                      <img
                        src={collection.image?.src}
                        alt={collection.image?.altText || collection.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                    <BlockStack gap="200">
                      <Text variant="headingLg" as="h3">
                        {collection.title}
                      </Text>
                      <Text variant="bodyMd" tone="subdued">
                        {collection.description}
                      </Text>
                      <Button
                        variant="primary"
                        onClick={() =>
                          navigate(`/collections/${collection.handle}`)
                        }
                      >
                        View Collection
                      </Button>
                    </BlockStack>
                  </BlockStack>
                </Card>
              </div>
            ))}
          </InlineGrid>
        </BlockStack>
      </div>

      <Divider />

      {/* Featured Products */}
      <div style={{ marginTop: '40px', marginBottom: '40px' }}>
        <BlockStack gap="400">
          <InlineStack align="space-between" blockAlign="center">
            <Text variant="headingXl" as="h2">
              Featured Products
            </Text>
            <Button variant="plain" onClick={() => navigate('/collections/womens')}>
              View all
            </Button>
          </InlineStack>

          {loading ? (
            <Grid columns={{ xs: 1, sm: 2, md: 4 }}>
              {[1, 2, 3, 4].map((i) => (
                <Grid.Cell key={i}>
                  <Card>
                    <BlockStack gap="300">
                      <SkeletonDisplayText size="small" />
                      <SkeletonBodyText lines={3} />
                    </BlockStack>
                  </Card>
                </Grid.Cell>
              ))}
            </Grid>
          ) : (
            <Grid columns={{ xs: 1, sm: 2, md: 4 }}>
              {featuredProducts.map((product) => (
                <Grid.Cell key={product.id}>
                  <ProductCard product={product} />
                </Grid.Cell>
              ))}
            </Grid>
          )}
        </BlockStack>
      </div>

      <Divider />

      {/* Features Section */}
      <div style={{ marginTop: '40px', marginBottom: '40px' }}>
        <BlockStack gap="400">
          <Text variant="headingXl" as="h2" alignment="center">
            Why Choose KnitWear Co.?
          </Text>
          <InlineGrid columns={{ xs: 1, sm: 2, md: 4 }} gap="400">
            {[
              {
                icon: '🧶',
                title: 'Handcrafted Quality',
                desc: 'Every piece is carefully knitted by skilled artisans using premium yarns.',
              },
              {
                icon: '📏',
                title: 'One Size Fits All',
                desc: 'Designed with elastic stretch yarns to comfortably fit a wide range of sizes.',
              },
              {
                icon: '🌿',
                title: 'Sustainable Materials',
                desc: 'We use ethically sourced wool and eco-friendly dyes in all our products.',
              },
              {
                icon: '🚀',
                title: 'Free Shipping',
                desc: 'Enjoy free shipping on all orders over $50 within the United States.',
              },
            ].map((feature) => (
              <Card key={feature.title}>
                <BlockStack gap="300" align="center">
                  <Text variant="heading2xl" as="p" alignment="center">
                    {feature.icon}
                  </Text>
                  <Text variant="headingSm" as="h3" alignment="center">
                    {feature.title}
                  </Text>
                  <Text variant="bodySm" tone="subdued" alignment="center">
                    {feature.desc}
                  </Text>
                </BlockStack>
              </Card>
            ))}
          </InlineGrid>
        </BlockStack>
      </div>
    </Page>
  );
}
