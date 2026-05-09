import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react';
import GlassShell from '@/components/Layout/GlassShell.jsx';
import { getProductById } from '@/data/shopProducts.js';
import { useCart } from '@/store/cart.jsx';

function money(value, currency) {
  return `${currency} ${value}`;
}

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const product = useMemo(() => getProductById(productId), [productId]);
  const { items, addItem } = useCart();
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <GlassShell title="المنتج غير موجود" subtitle="ربما تم تغيير الرابط أو حذف المنتج.">
        <Link to="/shop" className="no-underline text-sand-light hover:text-cream transition-colors">
          <span className="inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            رجوع للمتجر
          </span>
        </Link>
      </GlassShell>
    );
  }

  const Icon = product.Icon;

  return (
    <GlassShell
      title={product.name}
      subtitle={product.desc}
      topRight={
        <Link
          to="/shop/cart"
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-[rgba(26,24,20,0.35)] border border-[rgba(212,197,169,0.10)] text-sand-light no-underline transition-all duration-300 hover:border-[rgba(164,184,107,0.40)] hover:bg-[rgba(74,90,42,0.18)]"
          aria-label="السلة"
        >
          <ShoppingCart className="w-4 h-4" />
          <span className="font-en text-[0.85rem]">{items.length}</span>
        </Link>
      }
    >
      <div className="grid lg:grid-cols-[1.25fr_0.75fr] gap-7">
        <div className="rounded-3xl border border-[rgba(212,197,169,0.12)] bg-[rgba(26,24,20,0.55)] [backdrop-filter:blur(18px)] p-8">
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-3xl flex items-center justify-center border border-[rgba(212,197,169,0.12)]"
                style={{ background: `radial-gradient(circle, ${product.accent} 0%, rgba(26,24,20,0.2) 70%)` }}
              >
                <Icon className="w-7 h-7 text-cream opacity-90" />
              </div>
              <div>
                <div className="text-[0.7rem] tracking-[0.25em] uppercase text-olive-glow opacity-70 font-en">{product.category}</div>
                <div className="mt-1 text-sand opacity-75">الوزن: {product.weight}</div>
              </div>
            </div>

            <div className="text-left">
              <div className="font-en text-[1.6rem] text-bronze-light">{money(product.price, product.currency)}</div>
              <div className="text-[0.85rem] text-sand opacity-70">شحن داخل مصر</div>
            </div>
          </div>

          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-[rgba(212,197,169,0.10)] bg-[rgba(10,9,7,0.30)] p-4">
              <div className="font-en tracking-[0.35em] text-[0.7rem] text-olive-glow opacity-70 uppercase">Quality</div>
              <div className="mt-2 text-sand-light">اختيار بعناية</div>
            </div>
            <div className="rounded-2xl border border-[rgba(212,197,169,0.10)] bg-[rgba(10,9,7,0.30)] p-4">
              <div className="font-en tracking-[0.35em] text-[0.7rem] text-olive-glow opacity-70 uppercase">Fresh</div>
              <div className="mt-2 text-sand-light">تجهيز يومي</div>
            </div>
            <div className="rounded-2xl border border-[rgba(212,197,169,0.10)] bg-[rgba(10,9,7,0.30)] p-4">
              <div className="font-en tracking-[0.35em] text-[0.7rem] text-olive-glow opacity-70 uppercase">Care</div>
              <div className="mt-2 text-sand-light">تغليف هدايا</div>
            </div>
          </div>

          <div className="mt-8">
            <Link to="/shop" className="no-underline text-sand-light hover:text-cream transition-colors">
              <span className="inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                رجوع للمتجر
              </span>
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-[rgba(212,197,169,0.12)] bg-[rgba(26,24,20,0.55)] [backdrop-filter:blur(18px)] p-7">
          <div className="text-sand-light">الكمية</div>
          <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl px-4 py-3 border border-[rgba(212,197,169,0.14)] bg-[rgba(10,9,7,0.35)]">
            <button
              type="button"
              onClick={() => setQty((v) => Math.max(1, v - 1))}
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-[rgba(212,197,169,0.12)] bg-[rgba(26,24,20,0.35)] text-cream"
              aria-label="decrease"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="font-en text-[1.2rem] text-cream">{qty}</div>
            <button
              type="button"
              onClick={() => setQty((v) => v + 1)}
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-[rgba(212,197,169,0.12)] bg-[rgba(26,24,20,0.35)] text-cream"
              aria-label="increase"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => addItem(product, qty)}
            className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 bg-[linear-gradient(135deg,rgba(74,90,42,0.55),rgba(164,184,107,0.18))] border border-[rgba(164,184,107,0.30)] text-cream font-ar font-semibold transition-all duration-300 hover:shadow-[0_18px_50px_rgba(164,184,107,0.10)] active:scale-[0.99]"
          >
            <ShoppingCart className="w-4 h-4" />
            إضافة للسلة
          </button>

          <div className="mt-6 rounded-2xl border border-[rgba(212,197,169,0.10)] bg-[rgba(10,9,7,0.30)] p-4">
            <div className="flex items-center justify-between">
              <div className="text-sand opacity-80">الإجمالي</div>
              <div className="font-en text-bronze-light">{money(product.price * qty, product.currency)}</div>
            </div>
            <div className="mt-2 text-[0.85rem] text-sand opacity-70">الشحن يُحسب في صفحة السلة.</div>
          </div>
        </div>
      </div>
    </GlassShell>
  );
}
