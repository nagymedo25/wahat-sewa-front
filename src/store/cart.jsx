import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'wahat_cart_v1';

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function calcTotals(items) {
  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const shipping = subtotal === 0 ? 0 : 45;
  const total = subtotal + shipping;
  return { subtotal, shipping, total };
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? safeParse(raw) : null;
    if (Array.isArray(parsed?.items)) setItems(parsed.items);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ items }));
  }, [items]);

  const addItem = useCallback((product, qty = 1) => {
    if (!product?.id) return;
    const safeQty = Math.max(1, Number(qty) || 1);

    setItems((prev) => {
      const found = prev.find((it) => it.id === product.id);
      if (found) {
        return prev.map((it) => (it.id === product.id ? { ...it, qty: it.qty + safeQty } : it));
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          currency: product.currency,
          qty: safeQty,
        },
      ];
    });
  }, []);

  const setQty = useCallback((productId, qty) => {
    const nextQty = Math.max(1, Number(qty) || 1);
    setItems((prev) => prev.map((it) => (it.id === productId ? { ...it, qty: nextQty } : it)));
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((it) => it.id !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const totals = useMemo(() => calcTotals(items), [items]);

  const value = useMemo(
    () => ({
      items,
      totals,
      addItem,
      setQty,
      removeItem,
      clear,
    }),
    [addItem, clear, items, removeItem, setQty, totals]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
