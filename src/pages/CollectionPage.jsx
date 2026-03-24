import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Page,
  Card,
  Text,
  Button,
  BlockStack,
  Grid,
  EmptyState,
  SkeletonBodyText,
  SkeletonDisplayText,
  InlineStack,
  Select,
  Banner,
} from '@shopify/polaris';
import { fetchCollectionByHandle } from '../api/shopify';
import ProductCard from '../components/ProductCard';
import Seo from '../components/Seo';

const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Name: A–Z', value: 'name-asc' },
  { label: 'Name: Z–A', value: 'name-desc' },
];

function sortProducts(products, sortValue) {
  const getPrice = (p) => {
    const variant = p.variants?.[0];
    return parseFloat(variant?.price?.amount ?? variant?.price ?? 0);
  };
  switch (sortValue) {
    case 'price-asc':
      return [...products].sort((a, b) => getPrice(a) - getPrice(b));
    case 'price-desc':
      return [...products].sort((a, b) => getPrice(b) - getPrice(a));
    case 'name-asc':
      return [...products].sort((a, b) => a.title.localeCompare(b.title));
    case 'name-desc':
      return [...products].sort((a, b) => b.title.localeCompare(a.title));
    default:
      return products;
  }
}

export default function CollectionPage() {
  const { handle } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortValue, setSortValue] = useState('featured');

  useEffect(() => {
    setLoading(true);
    fetchCollectionByHandle(handle)
      .then(setCollection)
      .finally(() => setLoading(false));
  }, [handle]);

  const sortedProducts = collection
    ? sortProducts(collection.products || [], sortValue)
    : [];

  const title =
    collection?.title ??
    (handle === 'mens' ? "Men's Collection" : "Women's Collection");
  const description =
    collection?.description ||
    `Browse ${title} at KnitWear Co. Discover cozy, handcrafted knitwear.`;
  const image = collection?.image?.src;

  if (loading) {
    return (
      <Page
        title={title}
        backAction={{ content: 'Home', onAction: () => navigate('/') }}
      >
        <Seo title={title} description={description} image={image} />
        <Card>
          <BlockStack gap="400">
            <SkeletonDisplayText size="large" />
            <Grid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}>
              {[1, 2, 3, 4].map((i) => (
                <Grid.Cell key={i}>
                  <Card>
                    <SkeletonBodyText lines={5} />
                  </Card>
                </Grid.Cell>
              ))}
            </Grid>
          </BlockStack>
        </Card>
      </Page>
    );
  }

  if (!collection) {
    return (
      <Page
        title="Collection Not Found"
        backAction={{ content: 'Home', onAction: () => navigate('/') }}
      >
        <Seo
          title="Collection Not Found"
          description="The collection you are looking for could not be found."
        />
        <EmptyState
          heading="Collection not found"
          action={{ content: 'Browse all products', onAction: () => navigate('/') }}
          image=""
        >
          <p>This collection doesn&apos;t exist or has been removed.</p>
        </EmptyState>
      </Page>
    );
  }

  return (
    <Page
      title={title}
      subtitle={`${sortedProducts.length} product${sortedProducts.length !== 1 ? 's' : ''} · One Size Fits All`}
      backAction={{ content: 'Home', onAction: () => navigate('/') }}
    >
      <Seo title={title} description={description} image={image} />
      <BlockStack gap="400">
        {/* Collection Banner */}
        {collection.image && (
          <div
            style={{
              borderRadius: '12px',
              overflow: 'hidden',
              aspectRatio: '21 / 6',
            }}
          >
            <img
              src={collection.image.src}
              alt={collection.image.altText || title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        {collection.description && (
          <Banner tone="info">
            <p>{collection.description}</p>
          </Banner>
        )}

        {/* Sort Controls */}
        <InlineStack align="end">
          <div style={{ minWidth: '200px' }}>
            <Select
              label="Sort by"
              options={SORT_OPTIONS}
              value={sortValue}
              onChange={setSortValue}
            />
          </div>
        </InlineStack>

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <EmptyState
            heading="No products in this collection"
            action={{
              content: 'Back to home',
              onAction: () => navigate('/'),
            }}
            image=""
          >
            <p>Check back soon for new arrivals.</p>
          </EmptyState>
        ) : (
          <Grid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}>
            {sortedProducts.map((product) => (
              <Grid.Cell key={product.id}>
                <ProductCard product={product} />
              </Grid.Cell>
            ))}
          </Grid>
        )}
      </BlockStack>
    </Page>
  );
}
