function StickyEventBanner({ compact = false }) {
  const banners = [
    {
      label: "Featured",
      title: "Product Meetup",
      meta: "Today · Main Hall",
      tone: "from-[#0EA5FF] via-[#2563EB] to-[#111827]",
    },
    {
      label: "Live",
      title: "Creator Check-ins",
      meta: "128 guests tracked",
      tone: "from-[#FFB86B] via-[#FF8A3D] to-[#9A3412]",
    },
    {
      label: "Next",
      title: "Design Workshop",
      meta: "Tomorrow · Studio 4",
      tone: "from-[#12B981] via-[#0F766E] to-[#0F172A]",
    },
  ];

  return (
    <div className={`sticky ${compact ? "top-[64px]" : "top-0"} z-40 border-y border-black/5 bg-[#f5f5f7]/86 backdrop-blur-xl`}>
      <div className="mx-auto max-w-7xl px-3 py-2 sm:px-5 lg:px-8">
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {banners.map(({ label, title, meta, tone }) => (
            <div
              key={title}
              className={`min-w-[245px] flex-1 rounded-xl bg-gradient-to-r ${tone} p-[1px] shadow-[0_8px_24px_rgba(15,23,42,0.10)]`}
            >
              <div className="flex h-16 items-center justify-between gap-4 rounded-[11px] bg-white/12 px-4 text-white ring-1 ring-white/18 backdrop-blur-md">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70">{label}</p>
                  <p className="truncate text-sm font-semibold">{title}</p>
                  <p className="truncate text-[11px] text-white/72">{meta}</p>
                </div>
                <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-lg bg-white/16 ring-1 ring-white/20">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v3M17 4v3M5 9h14M6 6h12a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a1 1 0 0 1 1-1z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 14h.01M12 14h.01M15 14h.01" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StickyEventBanner;
