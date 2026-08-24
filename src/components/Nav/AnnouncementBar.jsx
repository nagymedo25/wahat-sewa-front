import { Sparkles, Tag, Truck, ShieldCheck } from 'lucide-react';

const announcements = [
  { text: 'خصومات حصرية على منتجات واحة سيوة الطبيعية لفترة محدودة', Icon: Tag },
  { text: 'تمور فاخرة وزيوت بكر ممتازة عصرة أولى مباشرة من مزارعنا', Icon: Sparkles },
  { text: 'شحن آمن وتوصيل سريع لجميع محافظات جمهورية مصر العربية', Icon: Truck },
  { text: 'منتجات عضوية 100% بدون أي إضافات أو مواد حافظة', Icon: ShieldCheck },
];

function MarqueeTrack() {
  return (
    <div className="flex shrink-0 items-center justify-around animate-marquee whitespace-nowrap">
      {announcements.map((item, idx) => {
        const Icon = item.Icon;
        return (
          <div
            key={idx}
            className="flex items-center gap-2.5 px-6 sm:px-8 font-ar text-[0.8rem] font-bold tracking-wide shrink-0"
          >
            <Icon className="w-3.5 h-3.5 text-[var(--desert-sand)] opacity-90 shrink-0" strokeWidth={2} />
            <span>{item.text}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--siwa-earth)] mx-4 opacity-60 inline-block shrink-0" />
          </div>
        );
      })}
    </div>
  );
}

export default function AnnouncementBar() {
  return (
    <div
      className="relative w-full overflow-hidden py-2.5 z-[70] select-none border-b border-[rgba(220,199,161,0.15)] shadow-sm flex"
      style={{ background: 'var(--announce-bg)', color: 'var(--announce-text)' }}
    >
      {/* Track 1 */}
      <MarqueeTrack />
      {/* Track 2 for 100% seamless infinite loop without any gaps */}
      <MarqueeTrack />
      {/* Track 3 for wide desktop monitors */}
      <MarqueeTrack />
    </div>
  );
}
