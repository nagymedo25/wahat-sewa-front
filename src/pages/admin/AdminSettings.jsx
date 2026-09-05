import { useState, useEffect } from 'react';
import { useAuth } from '../../store/auth';
import { useToast } from '@/store/toast.jsx';
import { API_URL } from '@/services/api.js';
import {
  Settings,
  Lock,
  UserCircle,
  CheckCircle2,
  Loader2,
  Share2,
  Copy,
  Check,
  ExternalLink,
  HelpCircle,
  Activity,
  Sparkles,
  ShoppingBag,
  BarChart3,
  Globe,
  Flame,
  ShieldCheck,
  Zap,
  Database,
  ArrowUpRight,
} from 'lucide-react';

export default function AdminSettings() {
  const { user, updateProfile, changePassword, api } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('marketing'); // 'account' | 'marketing'

  // Account State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Marketing & Tracking State
  const [trackingSettings, setTrackingSettings] = useState({
    meta_pixel_id: '',
    meta_capi_token: '',
    tiktok_pixel_id: '',
    ga4_id: '',
  });
  const [loadingTracking, setLoadingTracking] = useState(true);
  const [savingTracking, setSavingTracking] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  // Load tracking settings from server
  useEffect(() => {
    fetchTrackingSettings();
  }, []);

  const fetchTrackingSettings = async () => {
    try {
      const res = await api.get('/tracking/settings');
      if (res.data?.settings) {
        setTrackingSettings({
          meta_pixel_id: res.data.settings.meta_pixel_id || '',
          meta_capi_token: res.data.settings.meta_capi_token || '',
          tiktok_pixel_id: res.data.settings.tiktok_pixel_id || '',
          ga4_id: res.data.settings.ga4_id || '',
        });
      }
    } catch (err) {
      console.error('Failed to fetch tracking settings:', err);
    } finally {
      setLoadingTracking(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error('الاسم والبريد الإلكتروني مطلبان أساسيان');
      return;
    }

    setSavingProfile(true);
    try {
      const result = await updateProfile({
        name: name.trim(),
        email: email.trim(),
      });

      if (result.success) {
        toast.success('تم حفظ التغييرات بنجاح');
      } else {
        toast.error(result.error || 'فشل حفظ التغييرات');
      }
    } catch (err) {
      console.error(err);
      toast.error('حدث خطأ أثناء حفظ التغييرات');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (!currentPass || !newPass) {
      toast.error('أدخل كلمة المرور الحالية والجديدة');
      return;
    }
    if (newPass !== confirmPass) {
      toast.error('كلمتا المرور الجديدتين غير متطابقتين');
      return;
    }
    if (newPass.length < 8) {
      toast.error('كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل');
      return;
    }
    if (!/[A-Z]/.test(newPass)) {
      toast.error('يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل (A-Z)');
      return;
    }
    if (!/[a-z]/.test(newPass)) {
      toast.error('يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل (a-z)');
      return;
    }
    if (!/[0-9]/.test(newPass)) {
      toast.error('يجب أن تحتوي كلمة المرور على رقم واحد على الأقل (0-9)');
      return;
    }

    setUpdatingPassword(true);
    try {
      const result = await changePassword(currentPass, newPass);
      if (result.success) {
        setCurrentPass('');
        setNewPass('');
        setConfirmPass('');
        toast.success('تم تحديث كلمة المرور بنجاح');
      } else {
        toast.error(result.error || 'فشل تحديث كلمة المرور');
      }
    } catch (err) {
      console.error(err);
      toast.error('حدث خطأ أثناء تحديث كلمة المرور');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleSaveTracking = async (e) => {
    e.preventDefault();
    setSavingTracking(true);
    try {
      await api.put('/tracking/settings', trackingSettings);
      toast.success('تم حفظ إعدادات التتبع والإعلانات بنجاح');
    } catch (err) {
      console.error(err);
      toast.error('حدث خطأ أثناء حفظ إعدادات التتبع');
    } finally {
      setSavingTracking(false);
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success('تم نسخ الرابط بنجاح');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Base API for Feed Links
  const baseUrl = API_URL.replace(/\/+$/, '');
  const fbCatalogFeedUrl = `${baseUrl}/feed/facebook-catalog.xml`;
  const googleCatalogFeedUrl = `${baseUrl}/feed/google-catalog.xml`;
  const jsonCatalogFeedUrl = `${baseUrl}/feed/catalog.json`;

  return (
    <div className="space-y-8 pb-10 font-ar">
      {/* ── Main Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-cream">إعدادات النظام والمتجر</h1>
          <p className="text-sand mt-1 text-sm">
            إدارة بيانات المسؤول، الحساب، والربط التسويقي مع ميتا، تيك توك وجوجل
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[rgba(15,10,6,0.6)] border border-olive/20 shrink-0 self-start sm:self-auto shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab('marketing')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-ar font-bold transition-all cursor-pointer ${
              activeTab === 'marketing'
                ? 'bg-[#5B6B4A] text-white shadow-md'
                : 'text-sand/70 hover:text-cream'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>الربط التسويقي والإعلانات (Pixels & Feeds)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('account')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-ar font-bold transition-all cursor-pointer ${
              activeTab === 'account'
                ? 'bg-[#5B6B4A] text-white shadow-md'
                : 'text-sand/70 hover:text-cream'
            }`}
          >
            <UserCircle className="w-4 h-4" />
            <span>بيانات الحساب والأمان</span>
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 1: MARKETING, TRACKING & CATALOG FEEDS                     */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'marketing' && (
        <div className="space-y-8 animate-fadeIn">

          {/* 1. Hero Summary Banner with Live Status Badges */}
          <div className="relative rounded-3xl overflow-hidden border border-olive/30 bg-gradient-to-r from-[rgba(33,21,13,0.9)] via-[rgba(42,26,16,0.8)] to-[rgba(33,21,13,0.9)] p-6 sm:p-8 shadow-xl backdrop-blur-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-olive/20 border border-olive/30 text-olive-glow text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>مركز الحملات التسويقية والربط السحابي المباشر</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-cream">
                  تتبع التحويلات وتغذية كتالوجات المنتجات الذكية
                </h2>
                <p className="text-sand/70 text-xs sm:text-sm leading-relaxed">
                  اربط متجرك بـ Meta Pixel و TikTok و Google Analytics 4 بالإضافة لخادم التحويلات (Conversions API) لتسجيل المبيعات بدقة 100% وإطلاق إعلانات الكتالوج الديناميكية (Catalog Sales).
                </p>
              </div>

              {/* Status Indicators Grid */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 shrink-0">
                <div className="p-3 rounded-2xl bg-black/40 border border-blue-500/20 flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${trackingSettings.meta_pixel_id ? 'bg-blue-400 animate-pulse' : 'bg-sand/30'}`} />
                  <div>
                    <div className="text-[0.68rem] text-sand/60">ميتا (Facebook)</div>
                    <div className="text-xs font-bold text-cream font-mono">
                      {trackingSettings.meta_pixel_id ? 'Pixel مربوط' : 'غير مربوط'}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-black/40 border border-emerald-500/20 flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${trackingSettings.meta_capi_token ? 'bg-emerald-400 animate-pulse' : 'bg-sand/30'}`} />
                  <div>
                    <div className="text-[0.68rem] text-sand/60">Server CAPI</div>
                    <div className="text-xs font-bold text-cream font-mono">
                      {trackingSettings.meta_capi_token ? 'مُفعل خادمياً' : 'جاهز للربط'}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-black/40 border border-pink-500/20 flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${trackingSettings.tiktok_pixel_id ? 'bg-pink-400 animate-pulse' : 'bg-sand/30'}`} />
                  <div>
                    <div className="text-[0.68rem] text-sand/60">تيك توك (TikTok)</div>
                    <div className="text-xs font-bold text-cream font-mono">
                      {trackingSettings.tiktok_pixel_id ? 'Pixel مربوط' : 'غير مربوط'}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-black/40 border border-amber-500/20 flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${trackingSettings.ga4_id ? 'bg-amber-400 animate-pulse' : 'bg-sand/30'}`} />
                  <div>
                    <div className="text-[0.68rem] text-sand/60">جوجل (GA4)</div>
                    <div className="text-xs font-bold text-cream font-mono">
                      {trackingSettings.ga4_id ? 'GA4 مربوط' : 'غير مربوط'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* 2. PRODUCT CATALOG FEEDS (FEATURED PROMINENTLY)               */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-olive/20 text-olive-glow border border-olive/30 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-cream">روابط تغذية الكتالوج (Live Product Feeds)</h3>
                  <p className="text-xs text-sand/60">
                    انسخ الرابط المناسب وأضفه إلى مدير إعلانات ميتا وجوجل لإنشاء إعلانات المنتجات الديناميكية
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>محدّث تلقائياً مع المخزون والأسعار</span>
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              
              {/* Meta / Facebook Catalog Feed Card */}
              <div className="rounded-3xl border border-blue-500/25 bg-gradient-to-b from-[rgba(24,37,65,0.4)] to-[rgba(15,20,35,0.6)] p-6 space-y-4 hover:border-blue-500/40 transition-all shadow-lg backdrop-blur-md relative group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-xl shadow-inner shrink-0">
                      f
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-cream text-base">كتالوج ميتا (Facebook & Instagram)</h4>
                        <span className="px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-300 border border-blue-500/30 text-[0.68rem] font-bold">
                          XML RSS 2.0
                        </span>
                      </div>
                      <p className="text-xs text-sand/70 mt-0.5">
                        لتشغيل إعلانات Advantage+ Shopping Catalog وحملات الريتارجتنج المباشرة
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feed Link Copy Box */}
                <div className="p-2.5 rounded-2xl bg-black/60 border border-blue-500/20 flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={fbCatalogFeedUrl}
                    className="flex-1 bg-transparent px-2.5 text-blue-200 text-xs font-mono select-all text-left dir-ltr outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(fbCatalogFeedUrl, 'fb')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
                    title="نسخ الرابط"
                  >
                    {copiedKey === 'fb' ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>تم النسخ!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>نسخ الرابط</span>
                      </>
                    )}
                  </button>
                  <a
                    href={fbCatalogFeedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-sand hover:text-cream transition-colors flex items-center justify-center shrink-0"
                    title="معاينة الـ XML مباشرة في المتصفح"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Features & Action */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5 text-xs">
                  <div className="flex flex-wrap items-center gap-2 text-sand/60 text-[0.7rem]">
                    <span>• تحديث يومي تلقائي</span>
                    <span>• عملة: EGP</span>
                    <span>• صور وروابط مباشرة</span>
                  </div>
                  <a
                    href="https://business.facebook.com/commerce"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-blue-300 hover:text-blue-200 hover:underline font-bold text-xs"
                  >
                    <span>فتح Meta Commerce Manager</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Google Merchant Center Feed Card */}
              <div className="rounded-3xl border border-emerald-500/25 bg-gradient-to-b from-[rgba(18,45,30,0.4)] to-[rgba(12,28,20,0.6)] p-6 space-y-4 hover:border-emerald-500/40 transition-all shadow-lg backdrop-blur-md relative group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xl shadow-inner shrink-0">
                      G
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-cream text-base">كتالوج جوجل للتسوق (Google Shopping)</h4>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[0.68rem] font-bold">
                          Merchant XML
                        </span>
                      </div>
                      <p className="text-xs text-sand/70 mt-0.5">
                        لإظهار منتجاتك في Google Shopping وحملات Performance Max والبحث المجاني
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feed Link Copy Box */}
                <div className="p-2.5 rounded-2xl bg-black/60 border border-emerald-500/20 flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={googleCatalogFeedUrl}
                    className="flex-1 bg-transparent px-2.5 text-emerald-200 text-xs font-mono select-all text-left dir-ltr outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(googleCatalogFeedUrl, 'google')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
                    title="نسخ الرابط"
                  >
                    {copiedKey === 'google' ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>تم النسخ!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>نسخ الرابط</span>
                      </>
                    )}
                  </button>
                  <a
                    href={googleCatalogFeedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-sand hover:text-cream transition-colors flex items-center justify-center shrink-0"
                    title="معاينة الـ XML مباشرة في المتصفح"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Features & Action */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5 text-xs">
                  <div className="flex flex-wrap items-center gap-2 text-sand/60 text-[0.7rem]">
                    <span>• معايير Google Merchant</span>
                    <span>• عملة: EGP</span>
                    <span>• توفر المخزون الفوري</span>
                  </div>
                  <a
                    href="https://merchants.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-300 hover:text-emerald-200 hover:underline font-bold text-xs"
                  >
                    <span>فتح Google Merchant Center</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* 3. TRACKING PIXELS & KEYS FORM                                */}
          {/* ───────────────────────────────────────────────────────────── */}
          <form onSubmit={handleSaveTracking} className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-olive/20 text-olive-glow border border-olive/30 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-cream">معرّفات البكسل ورموز الوصول (Pixels & API Keys)</h3>
                  <p className="text-xs text-sand/60">
                    أدخل معرّفات البكسل لتسجيل أحداث الشراء وتصفح المنتجات في حساباتك الإعلانية تلقائياً
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* 1. Meta (Facebook & Instagram) Card */}
              <div className="bg-shadow-soft backdrop-blur-xl rounded-3xl border border-blue-500/20 p-6 flex flex-col justify-between hover:border-blue-500/35 transition-all shadow-md space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-base shadow-inner">
                        f
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-cream">Meta (فيسبوك وإنستغرام)</h4>
                        <p className="text-xs text-sand/60">Pixel + CAPI Server-to-Server</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/25">
                      تتبع مزدوج
                    </span>
                  </div>

                  <div>
                    <label className="block mb-1.5 text-sand-light text-xs font-bold">
                      Meta Pixel ID (معرّف البكسل)
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: 123456789012345"
                      value={trackingSettings.meta_pixel_id}
                      onChange={(e) =>
                        setTrackingSettings({ ...trackingSettings, meta_pixel_id: e.target.value })
                      }
                      className="w-full rounded-xl px-3.5 py-2.5 border border-olive/20 bg-black/40 outline-none text-cream text-xs transition-all focus:border-blue-400 text-left dir-ltr font-mono"
                    />
                    <span className="text-[0.68rem] text-sand/50 mt-1 block">
                      من Facebook Events Manager &gt; Settings &gt; Dataset ID
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sand-light text-xs font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Conversions API (CAPI) Token</span>
                      </label>
                      <span className="text-[0.65rem] text-emerald-300 font-bold">دقة 100% ضد موانع الإعلانات</span>
                    </div>
                    <textarea
                      rows={3}
                      placeholder="الصق الـ System User Access Token من إعدادات ميتا..."
                      value={trackingSettings.meta_capi_token}
                      onChange={(e) =>
                        setTrackingSettings({ ...trackingSettings, meta_capi_token: e.target.value })
                      }
                      className="w-full rounded-xl px-3.5 py-2 border border-olive/20 bg-black/40 outline-none text-cream text-xs transition-all focus:border-blue-400 text-left dir-ltr font-mono resize-none"
                    />
                    <span className="text-[0.68rem] text-sand/50 mt-1 block leading-tight">
                      يرسل أحداث الشراء من السيرفر مباشرة لضمان عدم ضياع أي عميل بسبب مانع الإعلانات أو iOS
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. TikTok Pixel Card */}
              <div className="bg-shadow-soft backdrop-blur-xl rounded-3xl border border-pink-500/20 p-6 flex flex-col justify-between hover:border-pink-500/35 transition-all shadow-md space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-pink-600/20 text-pink-400 border border-pink-500/30 flex items-center justify-center font-bold text-sm shadow-inner">
                        <Flame className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-cream">إعلانات تيك توك (TikTok)</h4>
                        <p className="text-xs text-sand/60">TikTok Events & Pixel ID</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold bg-pink-500/15 text-pink-300 border border-pink-500/25">
                      أحداث المتجر
                    </span>
                  </div>

                  <div>
                    <label className="block mb-1.5 text-sand-light text-xs font-bold">
                      TikTok Pixel ID (معرّف تيك توك)
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: C1234567890ABCDEF"
                      value={trackingSettings.tiktok_pixel_id}
                      onChange={(e) =>
                        setTrackingSettings({ ...trackingSettings, tiktok_pixel_id: e.target.value })
                      }
                      className="w-full rounded-xl px-3.5 py-2.5 border border-olive/20 bg-black/40 outline-none text-cream text-xs transition-all focus:border-pink-400 text-left dir-ltr font-mono"
                    />
                    <span className="text-[0.68rem] text-sand/50 mt-1 block">
                      من TikTok Ads Manager &gt; Assets &gt; Events &gt; Web Events
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-pink-500/15 text-sand/80 text-xs leading-relaxed space-y-1">
                    <span className="font-bold text-cream block">الأحداث التي يتم رصدها تلقائياً:</span>
                    <div className="flex flex-wrap gap-1 pt-1">
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-[0.68rem] text-pink-200">ViewContent</span>
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-[0.68rem] text-pink-200">AddToCart</span>
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-[0.68rem] text-pink-200">InitiateCheckout</span>
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-[0.68rem] text-pink-200">PlaceAnOrder</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Google Analytics (GA4) Card */}
              <div className="bg-shadow-soft backdrop-blur-xl rounded-3xl border border-amber-500/20 p-6 flex flex-col justify-between hover:border-amber-500/35 transition-all shadow-md space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-sm shadow-inner">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-cream">تحليلات جوجل (Google Analytics)</h4>
                        <p className="text-xs text-sand/60">GA4 Measurement ID</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/25">
                      E-commerce GA4
                    </span>
                  </div>

                  <div>
                    <label className="block mb-1.5 text-sand-light text-xs font-bold">
                      Google Analytics 4 Measurement ID
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: G-XXXXXXXXXX"
                      value={trackingSettings.ga4_id}
                      onChange={(e) =>
                        setTrackingSettings({ ...trackingSettings, ga4_id: e.target.value })
                      }
                      className="w-full rounded-xl px-3.5 py-2.5 border border-olive/20 bg-black/40 outline-none text-cream text-xs transition-all focus:border-amber-400 text-left dir-ltr font-mono"
                    />
                    <span className="text-[0.68rem] text-sand/50 mt-1 block">
                      من Google Analytics &gt; Admin &gt; Data Streams &gt; Measurement ID
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-amber-500/15 text-sand/80 text-xs leading-relaxed space-y-1">
                    <span className="font-bold text-cream block">البيانات المقاسة في جوجل:</span>
                    <p className="text-[0.7rem] text-sand/70">
                      مصادر الزيارات، الكلمات المفتاحية، معدل التحويل وسلال الشراء الناجحة لتقييم أداء حملات التسويق.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingTracking || loadingTracking}
                className="inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-3.5 bg-gradient-to-l from-olive to-olive-deep hover:from-olive-glow/90 hover:to-olive border border-olive/40 text-cream font-bold text-sm transition-all hover:shadow-[0_12px_30px_rgba(164,184,107,0.25)] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {savingTracking ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}
                حفظ معرّفات التتبع والإعلانات
              </button>
            </div>
          </form>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* 4. DETAILED ARABIC SETUP GUIDE CARDS                          */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div className="rounded-3xl bg-[rgba(15,10,6,0.6)] border border-olive/20 p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-2 text-olive-glow">
              <HelpCircle className="w-5 h-5" />
              <h4 className="font-bold text-base text-cream">دليل خطوات الربط السريع للمسوق:</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-sand/80 leading-relaxed">
              {/* Step 1: Facebook Catalog */}
              <div className="p-4 rounded-2xl bg-black/30 border border-blue-500/20 space-y-2">
                <div className="font-bold text-cream flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[0.7rem]">1</span>
                  خطوات ربط كتالوج ميتا (Facebook & Instagram):
                </div>
                <ol className="list-decimal list-inside space-y-1 pr-2 text-sand/70">
                  <li>افتح <strong>Meta Commerce Manager</strong> واختر الكتالوج الخاص بمتجرك.</li>
                  <li>من القائمة الجانبية، اختر <strong>Data Sources (مصادر البيانات)</strong> ثم <strong>Add Items (إضافة عناصر)</strong>.</li>
                  <li>اختر <strong>Data feed (تغذية البيانات)</strong> ثم <strong>Scheduled feed (تغذية مجدولة)</strong>.</li>
                  <li>الصق رابط كتالوج فيسبوك المنسوخ بالأعلى، وحدد وقت التحديث اليومي، ثم اضغط حفظ.</li>
                </ol>
              </div>

              {/* Step 2: CAPI */}
              <div className="p-4 rounded-2xl bg-black/30 border border-emerald-500/20 space-y-2">
                <div className="font-bold text-cream flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[0.7rem]">2</span>
                  تفعيل CAPI (Conversions API) مع ميتا:
                </div>
                <ol className="list-decimal list-inside space-y-1 pr-2 text-sand/70">
                  <li>افتح <strong>Meta Events Manager</strong> ثم اختر الـ Pixel أو Dataset الخاص بك.</li>
                  <li>انتقل لتبويب <strong>Settings (الإعدادات)</strong> وانزل لقسم <strong>Conversions API</strong>.</li>
                  <li>اضغط <strong>Generate access token (إنشاء رمز وصول)</strong>.</li>
                  <li>انسخ الرمز الطويل والصقه في حقل Access Token بالأعلى واضغط حفظ.</li>
                </ol>
              </div>

              {/* Step 3: TikTok Ads */}
              <div className="p-4 rounded-2xl bg-black/30 border border-pink-500/20 space-y-2">
                <div className="font-bold text-cream flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-pink-600 text-white flex items-center justify-center text-[0.7rem]">3</span>
                  ربط بكسل تيك توك (TikTok Ads Pixel):
                </div>
                <ol className="list-decimal list-inside space-y-1 pr-2 text-sand/70">
                  <li>افتح <strong>TikTok Ads Manager</strong> ومن القائمة العلوية ادخل إلى <strong>Assets &gt; Events</strong>.</li>
                  <li>اختر <strong>Web Events</strong> وانسخ معرّف البكسل (Pixel ID) الذي يبدأ غالباً بحرف C.</li>
                  <li>الصق المعرّف في خانة TikTok Pixel ID بالأعلى واضغط حفظ.</li>
                </ol>
              </div>

              {/* Step 4: Google Merchant */}
              <div className="p-4 rounded-2xl bg-black/30 border border-amber-500/20 space-y-2">
                <div className="font-bold text-cream flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[0.7rem]">4</span>
                  ربط كتالوج جوجل للتسوق (Google Merchant Center):
                </div>
                <ol className="list-decimal list-inside space-y-1 pr-2 text-sand/70">
                  <li>افتح <strong>Google Merchant Center</strong> وانتقل إلى قسم <strong>Feeds (خلاصات البيانات)</strong>.</li>
                  <li>أضف خلاصة رئيسية جديدة (Primary Feed)، واختر طريقة <strong>Scheduled Fetch</strong>.</li>
                  <li>الصق رابط كتالوج جوجل المنسوخ من الأعلى، وحدد وقت الجلب اليومي التلقائي.</li>
                </ol>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 2: ACCOUNT & SECURITY                                      */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'account' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
          {/* Profile Settings */}
          <div className="bg-shadow-soft backdrop-blur-xl rounded-3xl border border-olive/20 p-6 md:p-8 flex flex-col justify-between hover:border-olive/35 transition-all duration-300 shadow-md">
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-olive/10 pb-4">
                <div className="p-2 rounded-xl bg-olive-deep/40 text-olive-glow border border-olive/20">
                  <UserCircle className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-cream">معلومات الملف الشخصي</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sand-light text-sm font-medium">الاسم</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl px-4 py-3 border border-olive/20 bg-shadow-soft outline-none text-cream transition-all focus:border-olive-glow focus:shadow-[0_0_16px_rgba(164,184,107,0.06)]"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sand-light text-sm font-medium">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl px-4 py-3 border border-olive/20 bg-shadow-soft outline-none text-cream transition-all focus:border-olive-glow focus:shadow-[0_0_16px_rgba(164,184,107,0.06)] text-left dir-ltr"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 bg-gradient-to-l from-olive to-olive-deep border border-olive/30 text-cream font-semibold text-[0.95rem] transition-all hover:shadow-[0_12px_30px_rgba(164,184,107,0.15)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {savingProfile ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}
                حفظ التغييرات
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-shadow-soft backdrop-blur-xl rounded-3xl border border-olive/20 p-6 md:p-8 flex flex-col justify-between hover:border-olive/35 transition-all duration-300 shadow-md">
            <form onSubmit={handlePassword} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-olive/10 pb-4">
                <div className="p-2 rounded-xl bg-olive-deep/40 text-olive-glow border border-olive/20">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-cream">تغيير كلمة المرور</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sand-light text-sm font-medium">كلمة المرور الحالية</label>
                  <input
                    type="password"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    className="w-full rounded-2xl px-4 py-3 border border-olive/20 bg-shadow-soft outline-none text-cream transition-all focus:border-olive-glow focus:shadow-[0_0_16px_rgba(164,184,107,0.06)]"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sand-light text-sm font-medium">كلمة المرور الجديدة</label>
                  <input
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="w-full rounded-2xl px-4 py-3 border border-olive/20 bg-shadow-soft outline-none text-cream transition-all focus:border-olive-glow focus:shadow-[0_0_16px_rgba(164,184,107,0.06)]"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sand-light text-sm font-medium">تأكيد كلمة المرور الجديدة</label>
                  <input
                    type="password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    className="w-full rounded-2xl px-4 py-3 border border-olive/20 bg-shadow-soft outline-none text-cream transition-all focus:border-olive-glow focus:shadow-[0_0_16px_rgba(164,184,107,0.06)]"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={updatingPassword}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 bg-gradient-to-l from-olive to-olive-deep border border-olive/30 text-cream font-semibold text-[0.95rem] transition-all hover:shadow-[0_12px_30px_rgba(164,184,107,0.15)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {updatingPassword ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}
                تحديث كلمة المرور
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
