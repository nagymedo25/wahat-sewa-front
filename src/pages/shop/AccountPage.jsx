import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, ShoppingBag, User } from 'lucide-react';
import GlassShell from '@/components/Layout/GlassShell.jsx';
import { useAuth } from '@/store/auth.jsx';

export default function AccountPage() {
  const { user, isAuthed, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const tab = new URLSearchParams(location.search).get('tab') || 'profile';

  if (!isAuthed) {
    return (
      <GlassShell title="الحساب" subtitle="سجّل دخول لإدارة حسابك وتتبع الطلبات.">
        <div className="rounded-3xl border border-[rgba(212,197,169,0.12)] bg-[rgba(26,24,20,0.55)] [backdrop-filter:blur(18px)] p-7 max-w-[780px]">
          <div className="text-sand opacity-85 leading-[1.9]">لا يوجد جلسة تسجيل دخول.</div>
          <div className="mt-6 flex items-center gap-3">
            <Link
              to="/auth/login?next=/shop/account"
              className="rounded-2xl px-5 py-3 bg-[linear-gradient(135deg,rgba(74,90,42,0.55),rgba(164,184,107,0.18))] border border-[rgba(164,184,107,0.30)] text-cream font-ar font-semibold no-underline"
            >
              تسجيل الدخول
            </Link>
            <Link to="/shop" className="no-underline text-sand-light hover:text-cream transition-colors">
              <span className="inline-flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                للمتجر
              </span>
            </Link>
          </div>
        </div>
      </GlassShell>
    );
  }

  return (
    <GlassShell title="حسابي" subtitle="ملفك الشخصي، والطلبات (واجهة تجريبية).">
      <div className="grid lg:grid-cols-[0.45fr_1fr] gap-7">
        <div className="rounded-3xl border border-[rgba(212,197,169,0.12)] bg-[rgba(26,24,20,0.55)] [backdrop-filter:blur(18px)] p-6 h-fit">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-[rgba(212,197,169,0.12)] bg-[rgba(10,9,7,0.35)]">
              <User className="w-5 h-5 text-cream opacity-90" />
            </div>
            <div>
              <div className="font-ar text-cream font-semibold">{user?.name || 'عميل'}</div>
              <div className="text-sand opacity-70 font-en text-[0.9rem]">{user?.email}</div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <Link
              to="/shop/account?tab=profile"
              className={
                'no-underline rounded-2xl px-4 py-3 border transition-colors ' +
                (tab === 'profile'
                  ? 'border-[rgba(164,184,107,0.35)] bg-[rgba(74,90,42,0.20)] text-cream'
                  : 'border-[rgba(212,197,169,0.10)] bg-[rgba(10,9,7,0.28)] text-sand-light hover:text-cream')
              }
            >
              الملف الشخصي
            </Link>
            <Link
              to="/shop/account?tab=orders"
              className={
                'no-underline rounded-2xl px-4 py-3 border transition-colors ' +
                (tab === 'orders'
                  ? 'border-[rgba(164,184,107,0.35)] bg-[rgba(74,90,42,0.20)] text-cream'
                  : 'border-[rgba(212,197,169,0.10)] bg-[rgba(10,9,7,0.28)] text-sand-light hover:text-cream')
              }
            >
              الطلبات
            </Link>
          </div>

          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/shop', { replace: true });
            }}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 border border-[rgba(232,168,124,0.22)] bg-[rgba(232,168,124,0.06)] text-sand-light hover:text-cream transition-colors"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </button>
        </div>

        <div className="rounded-3xl border border-[rgba(212,197,169,0.12)] bg-[rgba(26,24,20,0.55)] [backdrop-filter:blur(18px)] p-7">
          {tab === 'orders' ? (
            <div>
              <div className="font-ar text-cream font-semibold text-[1.15rem]">الطلبات</div>
              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-[rgba(212,197,169,0.10)] bg-[rgba(10,9,7,0.30)] p-5">
                  <div className="font-en tracking-[0.25em] text-[0.7rem] text-olive-glow opacity-70 uppercase">Order</div>
                  <div className="mt-2 text-cream font-en">#WS-1024</div>
                  <div className="mt-2 text-sand opacity-80">الحالة: جارِ التجهيز</div>
                </div>
                <div className="rounded-2xl border border-[rgba(212,197,169,0.10)] bg-[rgba(10,9,7,0.30)] p-5">
                  <div className="font-en tracking-[0.25em] text-[0.7rem] text-olive-glow opacity-70 uppercase">Order</div>
                  <div className="mt-2 text-cream font-en">#WS-1025</div>
                  <div className="mt-2 text-sand opacity-80">الحالة: تم الشحن</div>
                </div>
              </div>
              <div className="mt-5 text-[0.85rem] text-sand opacity-70 leading-[1.8]">
                دي بيانات تجريبية. لو تحب أربطها بباك-إند/API هنضيف خدمة طلبات.
              </div>
            </div>
          ) : (
            <div>
              <div className="font-ar text-cream font-semibold text-[1.15rem]">الملف الشخصي</div>
              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-[rgba(212,197,169,0.10)] bg-[rgba(10,9,7,0.30)] p-5">
                  <div className="text-sand opacity-80">الاسم</div>
                  <div className="mt-2 text-cream">{user?.name || 'عميل'}</div>
                </div>
                <div className="rounded-2xl border border-[rgba(212,197,169,0.10)] bg-[rgba(10,9,7,0.30)] p-5">
                  <div className="text-sand opacity-80">البريد</div>
                  <div className="mt-2 text-cream font-en">{user?.email}</div>
                </div>
              </div>
              <div className="mt-6">
                <Link to="/shop" className="no-underline text-sand-light hover:text-cream transition-colors">
                  <span className="inline-flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    للمتجر
                  </span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </GlassShell>
  );
}
