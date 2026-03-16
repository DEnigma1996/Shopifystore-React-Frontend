import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Page,
  Card,
  Text,
  BlockStack,
  Grid,
  EmptyState,
  SkeletonBodyText,
  InlineStack,
  TextField,
  Button,
} from '@shopify/polaris';
import { SearchIcon } from '@shopify/polaris-icons';
import { searchProducts } from '../api/shopify';
import ProductCard from '../components/ProductCard';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  const [inputValue, setInputValue] = useState(query);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!query) return;
    setInputValue(query);
    setLoading(true);
    setSearched(false);
    searchProducts(query)
      .then(setResults)
      .finally(() => {
        setLoading(false);
        setSearched(true);
      });
  }, [query]);

  const handleSearch = () => {
    if (inputValue.trim()) {
      setSearchParams({ q: inputValue.trim() });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <Page
      title="Search"
      backAction={{ content: 'Home', onAction: () => navigate('/') }}
    >
      <BlockStack gap="500">
        {/* Search Input */}
        <Card>
          <InlineStack gap="300" blockAlign="end">
            <div style={{ flex: 1 }}>
              <TextField
                label="Search products"
                value={inputValue}
                onChange={setInputValue}
                placeholder="Search for beanies, scarves, sweaters…"
                autoComplete="off"
                onKeyDown={handleKeyDown}
                clearButton
                onClearButtonClick={() => {
                  setInputValue('');
                  setResults([]);
                  setSearched(false);
                }}
              />
            </div>
            <Button
              icon={SearchIcon}
              variant="primary"
              onClick={handleSearch}
              disabled={!inputValue.trim()}
            >
              Search
            </Button>
          </InlineStack>
        </Card>

        {/* Results */}
        {loading && (
          <Grid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}>
            {[1, 2, 3, 4].map((i) => (
              <Grid.Cell key={i}>
                <Card>
                  <SkeletonBodyText lines={5} />
                </Card>
              </Grid.Cell>
            ))}
          </Grid>
        )}

        {!loading && searched && results.length === 0 && (
          <EmptyState
            heading={`No results for "${query}"`}
            action={{
              content: 'Browse all products',
              onAction: () => navigate('/'),
            }}
            image=""
          >
            <p>Try searching for beanies, scarves, sweaters, or gloves.</p>
          </EmptyState>
        )}

        {!loading && results.length > 0 && (
          <BlockStack gap="300">
            <Text variant="bodyMd" tone="subdued">
              {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
            </Text>
            <Grid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}>
              {results.map((product) => (
                <Grid.Cell key={product.id}>
                  <ProductCard product={product} />
                </Grid.Cell>
              ))}
            </Grid>
          </BlockStack>
        )}

        {!loading && !searched && !query && (
          <Card>
            <BlockStack gap="300" align="center">
              <Text variant="heading2xl" as="p" alignment="center">
                🔍
              </Text>
              <Text variant="headingMd" as="p" alignment="center">
                Search our collection
              </Text>
              <Text variant="bodyMd" tone="subdued" alignment="center">
                Find beanies, scarves, sweaters, cardigans, gloves, and more.
              </Text>
            </BlockStack>
          </Card>
        )}
      </BlockStack>
    </Page>
  );
}
