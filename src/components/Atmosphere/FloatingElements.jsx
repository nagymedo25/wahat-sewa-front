export default function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[3] overflow-hidden max-md:hidden">
      <div className="absolute w-[24px] h-[24px] rounded-[0_50%_0_50%] bg-[linear-gradient(135deg,var(--olive-glow),var(--olive-light))] opacity-30 [filter:blur(0.5px)] top-[15%] left-[10%] animate-leafFloat" />
      <div className="absolute w-[16px] h-[16px] rounded-[0_50%_0_50%] bg-[linear-gradient(135deg,var(--olive-glow),var(--olive-light))] opacity-20 [filter:blur(0.5px)] top-[60%] right-[15%] [animation:leafFloat_25s_ease-in-out_infinite_2s]" />
      <div className="absolute w-[20px] h-[20px] rounded-[0_50%_0_50%] bg-[linear-gradient(135deg,var(--olive-glow),var(--olive-light))] opacity-30 [filter:blur(0.5px)] top-[30%] right-[25%] [animation:leafFloat_18s_ease-in-out_infinite_5s]" />
      <div className="absolute w-[14px] h-[14px] rounded-[0_50%_0_50%] bg-[linear-gradient(135deg,var(--olive-glow),var(--olive-light))] opacity-25 [filter:blur(0.5px)] bottom-[20%] left-[20%] [animation:leafFloat_22s_ease-in-out_infinite_3s]" />
      <div className="absolute w-[18px] h-[18px] rounded-[0_50%_0_50%] bg-[linear-gradient(135deg,var(--olive-glow),var(--olive-light))] opacity-20 [filter:blur(0.5px)] top-[45%] left-[5%] [animation:leafFloat_24s_ease-in-out_infinite_7s]" />
    </div>
  );
}
