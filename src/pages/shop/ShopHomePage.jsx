import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, ShoppingCart } from 'lucide-react';
import GlassShell from '@/components/Layout/GlassShell.jsx';
import { shopProducts } from '@/data/shopProducts.js';
import { useCart } from '@/store/cart.jsx';

function money(value, currency) {
  return `${currency} ${value}`;
}

export default function ShopHomePage() {
  const { items, addItem } = useCart();

  return (
    <GlassShell
      title="المتجر"
      subtitle="اختيارات مختارة من خيرات الواحة. تصميم زجاجي، حركة هادئة، وتجربة شراء منظمة."
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
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {shopProducts.map((p) => {
          const Icon = p.Icon;
          return (
            <div
              key={p.id}
              className="group rounded-3xl border border-[rgba(212,197,169,0.12)] bg-[rgba(26,24,20,0.55)] [backdrop-filter:blur(18px)] overflow-hidden"
            >
              <div className="p-7">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center border border-[rgba(212,197,169,0.12)]"
                      style={{ background: `radial-gradient(circle, ${p.accent} 0%, rgba(26,24,20,0.2) 70%)` }}
                    >
                      <Icon className="w-5 h-5 text-cream opacity-90" />
                    </div>
                    <div>
                      <div className="text-[0.7rem] tracking-[0.25em] uppercase text-olive-glow opacity-70 font-en">{p.category}</div>
                      <div className="mt-1 font-ar text-[1.05rem] text-cream font-semibold">{p.name}</div>
                    </div>
                  </div>

                  <div className="text-left">
                    <div className="font-en text-[1.1rem] text-bronze-light">{money(p.price, p.currency)}</div>
                    <div className="text-[0.8rem] text-sand opacity-70">{p.weight}</div>
                  </div>
                </div>

                <p className="mt-5 text-sand opacity-85 leading-[1.9] text-[0.95rem]">{p.desc}</p>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <Link
                    to={`/shop/product/${p.id}`}
                    className="inline-flex items-center gap-2 no-underline text-sand-light hover:text-cream transition-colors"
                  >
                    <span className="font-ar">تفاصيل</span>
                    <ArrowLeft className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => addItem(p, 1)}
                    className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 bg-[linear-gradient(135deg,rgba(74,90,42,0.55),rgba(164,184,107,0.18))] border border-[rgba(164,184,107,0.30)] text-cream font-ar font-semibold transition-all duration-300 hover:shadow-[0_18px_50px_rgba(164,184,107,0.10)] active:scale-[0.99]"
                  >
                    <Plus className="w-4 h-4" />
                    إضافة
                  </button>
                </div>
              </div>

              <div className="h-px bg-[linear-gradient(90deg,transparent,rgba(164,184,107,0.25),transparent)] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          );
        })}
      </div>
    </GlassShell>
  );
}
