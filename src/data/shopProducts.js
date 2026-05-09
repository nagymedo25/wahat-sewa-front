import { Droplet, Gift, Leaf, Sparkles, Wheat } from 'lucide-react';

export const shopProducts = [
  {
    id: 'olive',
    category: 'سيوة الأصلية',
    name: 'زيت الزيتون البكر',
    desc: 'عصرة أولى على البارد من أشجار الزيتون العتيقة. نكهة قوية ولمسة فاخرة للسلطات والطهي.',
    weight: '500 مل',
    price: 280,
    currency: 'ج.م',
    Icon: Droplet,
    accent: 'rgba(164,184,107,0.28)',
  },
  {
    id: 'dates',
    category: 'سيوة الأصلية',
    name: 'تمور سيوة الملكية',
    desc: 'تمور مختارة من نخيل الواحة؛ حلاوة طبيعية وقوام غني، مثالية للضيافة والهدايا.',
    weight: '1 كجم',
    price: 350,
    currency: 'ج.م',
    Icon: Wheat,
    accent: 'rgba(232,168,124,0.25)',
  },
  {
    id: 'herbs',
    category: 'سيوة الأصلية',
    name: 'أعشاب الواحة',
    desc: 'خليط أعشاب عطرية مجففة بعناية؛ عبق صحراء سيوة في كل رشة.',
    weight: '200 جرام',
    price: 180,
    currency: 'ج.م',
    Icon: Leaf,
    accent: 'rgba(212,197,169,0.22)',
  },
  {
    id: 'soap',
    category: 'سيوة الأصلية',
    name: 'صابون طبيعي',
    desc: 'صابون يدوي بزيت الزيتون والأعشاب؛ تنظيف لطيف وترطيب مريح للبشرة.',
    weight: '120 جرام',
    price: 95,
    currency: 'ج.م',
    Icon: Sparkles,
    accent: 'rgba(184,149,107,0.22)',
  },
  {
    id: 'organic',
    category: 'سيوة الأصلية',
    name: 'علبة الهدايا العضوية',
    desc: 'تشكيلة فاخرة من خيرات الواحة داخل علبة أنيقة. مناسبة للهدايا والمناسبات.',
    weight: 'مجموعة',
    price: 650,
    currency: 'ج.م',
    Icon: Gift,
    accent: 'rgba(164,184,107,0.18)',
  },
];

export function getProductById(productId) {
  return shopProducts.find((p) => p.id === productId) || null;
}
