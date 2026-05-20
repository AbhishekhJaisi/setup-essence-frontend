function Bookings() {
  return (
    <div className="rounded-3xl border border-white/[0.09] bg-[#0f1526]/85 backdrop-blur-xl shadow-[0_20px_70px_rgba(0,0,0,0.35)] overflow-hidden">
      <header className="border-b border-white/[0.08] px-4 py-5 sm:px-6">
        <h1 className="font-serif text-3xl text-[#eaf0ff]">Bookings</h1>
        <p className="text-sm text-white/60 mt-1">Your event bookings.</p>
      </header>
      <section className="p-4 sm:p-6">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
          <div className="grid grid-cols-4 px-4 py-3 text-[11px] uppercase tracking-[0.1em] text-white/45 border-b border-white/[0.08]">
            <span>Event</span>
            <span>Date</span>
            <span>Status</span>
            <span>Amount</span>
          </div>
          <div className="px-4 py-12 text-center text-white/45 text-sm">
            Booking data will appear here.
          </div>
        </div>
      </section>
    </div>
  );
}

export default Bookings;
