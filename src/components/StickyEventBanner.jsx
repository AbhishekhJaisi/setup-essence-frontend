import { useLocation } from "react-router-dom";

const bannerSets = {
  home: [
    { label: "Drop", title: "Weekend Lineup", meta: "Build the guest list", tone: "from-[#FF4ECD] via-[#7C3AED] to-[#00D4FF]" },
    { label: "Vibe", title: "Live Check-ins", meta: "Zero chaos at entry", tone: "from-[#00F5A0] via-[#00D9F5] to-[#2563EB]" },
    { label: "Squad", title: "Creator Mode", meta: "Launch, track, repeat", tone: "from-[#FFE53B] via-[#FF7A18] to-[#FF2E63]" },
  ],
  dashboardUser: [
    { label: "Feed", title: "Fresh Picks", meta: "Events worth opening", tone: "from-[#00D4FF] via-[#2563EB] to-[#7C3AED]" },
    { label: "Glow", title: "Application Status", meta: "No guessing, just updates", tone: "from-[#FF4ECD] via-[#A855F7] to-[#4F46E5]" },
    { label: "Next", title: "Booked Plans", meta: "Dates ready to roll", tone: "from-[#00F5A0] via-[#14B8A6] to-[#0F766E]" },
  ],
  dashboardCreator: [
    { label: "Create", title: "Launch Control", meta: "Ship the event drop", tone: "from-[#7C3AED] via-[#2563EB] to-[#00D4FF]" },
    { label: "Review", title: "Applicant Queue", meta: "Approve with confidence", tone: "from-[#FFE53B] via-[#FF7A18] to-[#F43F5E]" },
    { label: "Hype", title: "Fill Rate", meta: "Watch seats move", tone: "from-[#00F5A0] via-[#14B8A6] to-[#2563EB]" },
  ],
  events: [
    { label: "Explore", title: "Event Gallery", meta: "Browse by date and city", tone: "from-[#EC4899] via-[#8B5CF6] to-[#1D4ED8]" },
    { label: "Open", title: "Registration Window", meta: "Apply before deadlines", tone: "from-[#06B6D4] via-[#0891B2] to-[#164E63]" },
    { label: "Venue", title: "Local Picks", meta: "Find events near you", tone: "from-[#F59E0B] via-[#F97316] to-[#7C2D12]" },
  ],
  profile: [
    { label: "Profile", title: "Your Identity", meta: "Keep details current", tone: "from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9]" },
    { label: "Role", title: "Workspace Access", meta: "Manage your account", tone: "from-[#2DD4BF] via-[#14B8A6] to-[#0F766E]" },
    { label: "Security", title: "Account Control", meta: "Edit safely anytime", tone: "from-[#FB7185] via-[#F43F5E] to-[#BE123C]" },
  ],
  default: [
    { label: "Eventos", title: "Smart Workspace", meta: "Plan, apply, manage", tone: "from-[#0EA5FF] via-[#2563EB] to-[#111827]" },
    { label: "Live", title: "Organized Flow", meta: "No scattered updates", tone: "from-[#FFB86B] via-[#FF8A3D] to-[#9A3412]" },
    { label: "Next", title: "Better Events", meta: "Clear data, calmer work", tone: "from-[#12B981] via-[#0F766E] to-[#0F172A]" },
  ],
};

function getBannerKey(pathname) {
  const role = localStorage.getItem("role");
  if (pathname === "/" || pathname.includes("register") || pathname.includes("password") || pathname.includes("otp")) return "home";
  if (pathname.includes("events")) return "events";
  if (pathname.includes("profile")) return "profile";
  if (pathname.includes("dashboard")) return role === "creator" ? "dashboardCreator" : "dashboardUser";
  return "default";
}

function StickyEventBanner({ compact = false }) {
  const { pathname } = useLocation();
  const banners = bannerSets[getBannerKey(pathname)] ?? bannerSets.default;

  return (
    <div className={`sticky ${compact ? "top-[96px] sm:top-[64px]" : "top-0"} z-40 border-y border-white/70 bg-white/58 backdrop-blur-xl`}>
      <div className="mx-auto max-w-7xl px-3 py-2 sm:px-5 lg:px-8">
        <div className="flex gap-2 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {banners.map(({ label, title, meta, tone }) => (
            <div
              key={title}
              className={`relative min-w-[210px] flex-[0_0_78%] overflow-hidden rounded-xl bg-gradient-to-r ${tone} p-[1px] shadow-[0_8px_24px_rgba(15,23,42,0.10)] sm:min-w-[245px] sm:flex-1`}
            >
              <div className="absolute -right-5 -top-6 h-16 w-16 rotate-12 rounded-2xl bg-white/18" />
              <div className="absolute -bottom-7 left-1/2 h-14 w-24 -translate-x-1/2 rounded-full bg-white/12 blur-sm" />
              <div className="flex h-[58px] items-center justify-between gap-4 rounded-[11px] bg-white/10 px-4 text-white ring-1 ring-white/18 backdrop-blur-md">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/76">#{label}</p>
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
