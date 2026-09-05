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

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [shippingCost, setShippingCost] = useState(65);


  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? safeParse(raw) : null;
    if (Array.isArray(parsed?.items)) setItems(parsed.items);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ items }));
  }, [items]);

  const addItem = useCallback((product, qty = 1, variant = null) => {
    if (!product?.id) return;
    const safeQty = Math.max(1, Number(qty) || 1);
    const cartKey = variant ? `${product.id}_${variant.id || variant.name}` : String(product.id);
    const itemPrice = variant?.price !== undefined && variant?.price !== null ? Number(variant.price) : Number(product.price);
    const variantName = variant?.name || null;
    const img = product.image || product.image_url || '';

    setItems((prev) => {
      const found = prev.find((it) => (it.cartKey || it.id) === cartKey);
      if (found) {
        return prev.map((it) => ((it.cartKey || it.id) === cartKey ? { ...it, qty: it.qty + safeQty } : it));
      }
      return [
        ...prev,
        {
          id: product.id,
          cartKey,
          name: product.name,
          variantName,
          variant,
          image: img,
          price: itemPrice,
          currency: product.currency || 'ج.م',
          qty: safeQty,
        },
      ];
    });
  }, []);

  const setQty = useCallback((targetKey, qty) => {
    const nextQty = Math.max(1, Number(qty) || 1);
    setItems((prev) => prev.map((it) => ((it.cartKey || it.id) === targetKey ? { ...it, qty: nextQty } : it)));
  }, []);

  const removeItem = useCallback((targetKey) => {
    setItems((prev) => prev.filter((it) => (it.cartKey || it.id) !== targetKey));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
    const shipping = subtotal === 0 ? 0 : shippingCost;
    const total = subtotal + shipping;
    return { subtotal, shipping, total };
  }, [items, shippingCost]);

  const value = useMemo(
    () => ({
      items,
      totals,
      shippingCost,
      setShippingCost,
      addItem,
      setQty,
      removeItem,
      clear,
    }),
    [addItem, clear, items, removeItem, setQty, totals, shippingCost]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
