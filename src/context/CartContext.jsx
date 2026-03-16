import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import {
  createCheckout,
  fetchCheckout,
  addLineItems,
  removeLineItems,
  updateLineItems,
} from '../api/shopify';

const CartContext = createContext(null);

const CHECKOUT_ID_KEY = 'shopify_checkout_id';
const MOCK_CART_KEY = 'shopify_mock_cart';

const initialState = {
  lineItems: [],
  checkoutId: null,
  checkoutUrl: null,
  subtotalPrice: null,
  totalPrice: null,
  totalTax: null,
  loading: false,
  error: null,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_CHECKOUT': {
      const newState = {
        ...state,
        checkoutId: action.payload.id,
        checkoutUrl: action.payload.webUrl,
        lineItems: action.payload.lineItems || [],
        subtotalPrice: action.payload.subtotalPrice,
        totalPrice: action.payload.totalPrice,
        totalTax: action.payload.totalTax,
        loading: false,
        error: null,
      };
      // Persist mock cart items to localStorage for demo mode
      if (action.payload.id === 'mock-checkout-id') {
        try {
          localStorage.setItem(
            MOCK_CART_KEY,
            JSON.stringify(newState.lineItems)
          );
        } catch (e) {
          void e; // storage unavailable
        }
      }
      return newState;
    }
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Initialise or restore checkout on mount
  useEffect(() => {
    const initCart = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const savedId = localStorage.getItem(CHECKOUT_ID_KEY);
        if (savedId && savedId !== 'mock-checkout-id') {
          const existing = await fetchCheckout(savedId);
          if (existing && !existing.completedAt) {
            dispatch({ type: 'SET_CHECKOUT', payload: existing });
            return;
          }
        }
        const checkout = await createCheckout();
        localStorage.setItem(CHECKOUT_ID_KEY, checkout.id);
        // Restore mock cart items from localStorage
        if (checkout.id === 'mock-checkout-id') {
          try {
            const savedItems = localStorage.getItem(MOCK_CART_KEY);
            if (savedItems) {
              checkout.lineItems = JSON.parse(savedItems);
            }
          } catch (e) {
            void e; // ignore parse errors
          }
        }
        dispatch({ type: 'SET_CHECKOUT', payload: checkout });
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err.message });
      }
    };
    initCart();
  }, []);

  const addToCart = useCallback(
    async (variantId, quantity = 1) => {
      if (!state.checkoutId) return;
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const lineItemsToAdd = [{ variantId, quantity }];
        const checkout = await addLineItems(state.checkoutId, lineItemsToAdd);
        if (checkout) {
          dispatch({ type: 'SET_CHECKOUT', payload: checkout });
        } else {
          // Mock mode: add item locally
          const newItem = {
            id: `local-${variantId}-${Date.now()}`,
            variantId,
            quantity,
          };
          dispatch({
            type: 'SET_CHECKOUT',
            payload: {
              id: state.checkoutId,
              webUrl: state.checkoutUrl,
              lineItems: [...state.lineItems, newItem],
              subtotalPrice: state.subtotalPrice,
              totalPrice: state.totalPrice,
              totalTax: state.totalTax,
            },
          });
        }
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err.message });
      }
    },
    [state]
  );

  const removeFromCart = useCallback(
    async (lineItemId) => {
      if (!state.checkoutId) return;
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const checkout = await removeLineItems(state.checkoutId, [lineItemId]);
        if (checkout) {
          dispatch({ type: 'SET_CHECKOUT', payload: checkout });
        } else {
          dispatch({
            type: 'SET_CHECKOUT',
            payload: {
              id: state.checkoutId,
              webUrl: state.checkoutUrl,
              lineItems: state.lineItems.filter((item) => item.id !== lineItemId),
              subtotalPrice: state.subtotalPrice,
              totalPrice: state.totalPrice,
              totalTax: state.totalTax,
            },
          });
        }
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err.message });
      }
    },
    [state]
  );

  const updateQuantity = useCallback(
    async (lineItemId, quantity) => {
      if (!state.checkoutId) return;
      if (quantity <= 0) {
        return removeFromCart(lineItemId);
      }
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const checkout = await updateLineItems(state.checkoutId, [
          { id: lineItemId, quantity },
        ]);
        if (checkout) {
          dispatch({ type: 'SET_CHECKOUT', payload: checkout });
        } else {
          dispatch({
            type: 'SET_CHECKOUT',
            payload: {
              id: state.checkoutId,
              webUrl: state.checkoutUrl,
              lineItems: state.lineItems.map((item) =>
                item.id === lineItemId ? { ...item, quantity } : item
              ),
              subtotalPrice: state.subtotalPrice,
              totalPrice: state.totalPrice,
              totalTax: state.totalTax,
            },
          });
        }
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err.message });
      }
    },
    [state, removeFromCart]
  );

  const cartCount = state.lineItems.reduce(
    (acc, item) => acc + (item.quantity || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        ...state,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
