import { useNavigate } from 'react-router-dom';
import {
  Page,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Button,
  Banner,
  Divider,
} from '@shopify/polaris';
import { PersonIcon } from '@shopify/polaris-icons';

export default function AccountPage() {
  const navigate = useNavigate();

  return (
    <Page
      title="My Account"
      backAction={{ content: 'Home', onAction: () => navigate('/') }}
    >
      <BlockStack gap="400">
        <Banner tone="info" title="Account Management">
          <p>
            Account features such as order history, wishlists, and saved addresses
            are managed through your Shopify store. Please connect your Shopify
            credentials to enable full account functionality.
          </p>
        </Banner>

        <Card>
          <BlockStack gap="400">
            <InlineStack gap="400" blockAlign="center">
              <div
                style={{
                  background: '#f6f6f7',
                  borderRadius: '50%',
                  width: '80px',
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px',
                }}
              >
                👤
              </div>
              <BlockStack gap="100">
                <Text variant="headingLg" as="h2">
                  Welcome to KnitWear Co.
                </Text>
                <Text variant="bodyMd" tone="subdued">
                  Sign in to access your order history and account settings.
                </Text>
              </BlockStack>
            </InlineStack>

            <Divider />

            <BlockStack gap="300">
              <Button variant="primary" icon={PersonIcon} size="large" fullWidth>
                Sign In
              </Button>
              <Button size="large" fullWidth>
                Create Account
              </Button>
            </BlockStack>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="300">
            <Text variant="headingMd" as="h2">
              Why Create an Account?
            </Text>
            <BlockStack gap="200">
              {[
                { icon: '📦', text: 'Track your orders and shipments' },
                { icon: '❤️', text: 'Save your favourite items to a wishlist' },
                { icon: '🔄', text: 'Manage returns and exchanges easily' },
                { icon: '🎁', text: 'Exclusive member discounts and offers' },
                { icon: '📍', text: 'Save multiple delivery addresses' },
              ].map((item) => (
                <InlineStack key={item.text} gap="300" blockAlign="center">
                  <Text variant="bodyLg" as="span">
                    {item.icon}
                  </Text>
                  <Text variant="bodyMd">{item.text}</Text>
                </InlineStack>
              ))}
            </BlockStack>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
