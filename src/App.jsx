import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { AppProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/build/esm/styles.css';

import { CartProvider } from './context/CartContext';
import AppFrame from './components/AppFrame';
import HomePage from './pages/HomePage';
import CollectionPage from './pages/CollectionPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import SearchPage from './pages/SearchPage';
import AccountPage from './pages/AccountPage';

// Adapter so Polaris links use React Router's <Link> (no full-page reload)
function RouterLink({ url, children, ...rest }) {
  if (!url) return <button type="button" {...rest}>{children}</button>;
  return (
    <Link to={url} {...rest}>
      {children}
    </Link>
  );
}

function AppRoutes() {
  return (
    <AppFrame>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/collections/:handle" element={<CollectionPage />} />
        <Route path="/products/:handle" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </AppFrame>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppProvider i18n={enTranslations} linkComponent={RouterLink}>
          <AppRoutes />
        </AppProvider>
      </CartProvider>
    </BrowserRouter>
  );
}
