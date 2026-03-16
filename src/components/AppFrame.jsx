import { useState, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Frame,
  TopBar,
  Navigation,
  Text,
  Badge,
} from '@shopify/polaris';
import {
  HomeIcon,
  CollectionIcon,
  CartIcon,
  SearchIcon,
  PersonIcon,
} from '@shopify/polaris-icons';
import { useCart } from '../context/CartContext';

export default function AppFrame({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();

  const [mobileNavActive, setMobileNavActive] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const skipToContentRef = useRef(null);

  const toggleMobileNav = useCallback(
    () => setMobileNavActive((v) => !v),
    []
  );

  const handleSearchChange = useCallback((value) => {
    setSearchValue(value);
    setSearchActive(value.length > 0);
  }, []);

  const handleSearchResultsDismiss = useCallback(() => {
    setSearchActive(false);
    setSearchValue('');
  }, []);

  const handleSearchSubmit = useCallback(
    (e) => {
      if (e.key === 'Enter' && searchValue.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
        setSearchActive(false);
        setSearchValue('');
      }
    },
    [navigate, searchValue]
  );

  const searchFieldMarkup = (
    <TopBar.SearchField
      onChange={handleSearchChange}
      value={searchValue}
      placeholder="Search knit wear…"
      showFocusBorder
    />
  );

  const secondaryMenuMarkup = (
    <TopBar.Menu
      activatorContent={
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CartIcon style={{ width: 20, height: 20 }} />
          {cartCount > 0 && (
            <Badge tone="info" size="small">
              {String(cartCount)}
            </Badge>
          )}
        </span>
      }
      open={false}
      onOpen={() => navigate('/cart')}
      onClose={() => {}}
      actions={[]}
    />
  );

  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      searchResultsVisible={searchActive}
      searchField={searchFieldMarkup}
      onSearchResultsDismiss={handleSearchResultsDismiss}
      onNavigationToggle={toggleMobileNav}
      secondaryMenu={secondaryMenuMarkup}
      contextControl={
        <div
          style={{ padding: '0 8px', cursor: 'pointer' }}
          onClick={() => navigate('/')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
        >
          <Text variant="headingMd" as="span" tone="magic-subdued">
            🧶 KnitWear Co.
          </Text>
        </div>
      }
    />
  );

  const isActive = (path) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path);

  const navigationMarkup = (
    <Navigation location={location.pathname}>
      <Navigation.Section
        title="Shop"
        items={[
          {
            url: '/',
            label: 'Home',
            icon: HomeIcon,
            selected: isActive('/'),
          },
          {
            url: '/collections/mens',
            label: "Men's Collection",
            icon: CollectionIcon,
            selected: isActive('/collections/mens'),
          },
          {
            url: '/collections/womens',
            label: "Women's Collection",
            icon: CollectionIcon,
            selected: isActive('/collections/womens'),
          },
        ]}
      />
      <Navigation.Section
        separator
        title="Account"
        items={[
          {
            url: '/cart',
            label: 'Cart',
            icon: CartIcon,
            selected: isActive('/cart'),
            badge: cartCount > 0 ? String(cartCount) : undefined,
          },
          {
            url: '/search',
            label: 'Search',
            icon: SearchIcon,
            selected: isActive('/search'),
          },
          {
            url: '/account',
            label: 'My Account',
            icon: PersonIcon,
            selected: isActive('/account'),
          },
        ]}
      />
    </Navigation>
  );

  return (
    <Frame
      topBar={topBarMarkup}
      navigation={navigationMarkup}
      showMobileNavigation={mobileNavActive}
      onNavigationDismiss={toggleMobileNav}
      skipToContentTarget={skipToContentRef}
      onKeyDown={handleSearchSubmit}
    >
      <a id="SkipToContentTarget" ref={skipToContentRef} tabIndex={-1} />
      {children}
    </Frame>
  );
}
