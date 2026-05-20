import { useLocation } from "react-router-dom";

const bannerSets = {
  home: [
    { label: "Plan", title: "Launch Week", meta: "Teams, guests, reminders", tone: "from-[#2563EB] via-[#7C3AED] to-[#111827]" },
    { label: "Track", title: "Live Check-ins", meta: "Fast entry at the door", tone: "from-[#14B8A6] via-[#0F766E] to-[#0F172A]" },
    { label: "Grow", title: "Full Rooms", meta: "Applications made simple", tone: "from-[#FFB86B] via-[#F97316] to-[#7C2D12]" },
  ],
  dashboardUser: [
    { label: "Today", title: "Your Event Feed", meta: "Fresh opportunities ready", tone: "from-[#0EA5FF] via-[#2563EB] to-[#1E293B]" },
    { label: "Status", title: "Applications", meta: "Approvals in one view", tone: "from-[#A855F7] via-[#7C3AED] to-[#312E81]" },
    { label: "Next Up", title: "Registered Events", meta: "Dates, seats, and details", tone: "from-[#10B981] via-[#059669] to-[#064E3B]" },
  ],
  dashboardCreator: [
    { label: "Creator", title: "Command Center", meta: "Events and applicants", tone: "from-[#111827] via-[#2563EB] to-[#0EA5FF]" },
    { label: "Review", title: "Applicant Queue", meta: "Approve the right people", tone: "from-[#F97316] via-[#EA580C] to-[#7C2D12]" },
    { label: "Capacity", title: "Fill Rate", meta: "Watch seats move", tone: "from-[#14B8A6] via-[#0F766E] to-[#134E4A]" },
  ],
  events: [
    { label: "Explore", title: "Event Gallery", meta: "Browse by date and city", tone: "from-[#EC4899] via-[#8B5CF6] to-[#1D4ED8]" },
    { label: "Open", title: "Registration Window", meta: "Apply before deadlines", tone: "from-[#06B6D4] via-[#0891B2] to-[#164E63]" },
    { label: "Venue", title: "Local Picks", meta: "Find events near you", tone: "from-[#F59E0B] via-[#F97316] to-[#7C2D12]" },
  ],
  profile: [
    { label: "Profile", title: "Your Identity", meta: "Keep details current", tone: "from-[#6366F1] via-[#2563EB] to-[#0F172A]" },
    { label: "Role", title: "Workspace Access", meta: "Manage your account", tone: "from-[#10B981] via-[#059669] to-[#064E3B]" },
    { label: "Security", title: "Account Control", meta: "Edit safely anytime", tone: "from-[#F43F5E] via-[#E11D48] to-[#881337]" },
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
    <div className={`sticky ${compact ? "top-[64px]" : "top-0"} z-40 border-y border-black/5 bg-white/66 backdrop-blur-xl`}>
      <div className="mx-auto max-w-7xl px-3 py-2 sm:px-5 lg:px-8">
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {banners.map(({ label, title, meta, tone }) => (
            <div
              key={title}
              className={`min-w-[245px] flex-1 rounded-xl bg-gradient-to-r ${tone} p-[1px] shadow-[0_8px_24px_rgba(15,23,42,0.10)]`}
            >
              <div className="flex h-16 items-center justify-between gap-4 rounded-[11px] bg-white/10 px-4 text-white ring-1 ring-white/18 backdrop-blur-md">
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
