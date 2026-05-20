import { useEffect, useState } from "react";
import ApplicationForm from "../components/ApplicationForm";

function DashboardUser() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [totalEvents, setTotalEvents] = useState(0);
  const [eventsList, setEventsList] = useState([]);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [applicants, setApplicants] = useState({});
  const [activity, setActivity] = useState([]);
  const [appliedEvents, setAppliedEvents] = useState([]);
  const [registrations, setRegistrations] = useState(0);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userId = Number(localStorage.getItem("userId"));

  if (role !== "user") return null;

  function formatDateTime(datetime) {
    if (!datetime) return "-";
    const d = new Date(datetime);
    if (isNaN(d.getTime())) return "Invalid date";
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  }

  useEffect(() => {
    async function checkApplications() {
      try {
        const res = await fetch(`${apiUrl}/api/registrations/my-applications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const now = new Date();
        const filtered = (data?.data || []).filter((event) => {
          const d = new Date(event.Event?.eventDate);
          return !isNaN(d) && d > now;
        });
        setRegistrations(filtered.length);
        setActivity(filtered);
        setAppliedEvents(filtered.map((item) => item.eventId));
      } catch (err) {
        console.log(err);
      }
    }
    checkApplications();
  }, []);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch(`${apiUrl}/api/events/view-events`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTotalEvents(data.data.length);
        setEventsList(data.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchEvents();
  }, []);

  async function handleEventApplication(applyFormData) {
    try {
      const res = await fetch(`${apiUrl}/api/registrations/apply/${selectedEventId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(applyFormData),
      });
      if (!res.ok) return;
      setApplicants((prev) => {
        const existing = prev[selectedEventId] || [];
        if (existing.some((a) => a.userId === userId)) return prev;
        return { ...prev, [selectedEventId]: [...existing, { userId }] };
      });
      setAppliedEvents((prev) => [...prev, selectedEventId]);
      setShowApplyForm(false);
    } catch (err) {
      console.error(err);
    }
  }

  function statusStyle(status) {
    switch (status) {
      case "approved":
        return "text-[#248a3d] bg-[#e8f7ed] border-[#bfe7ca]";
      case "rejected":
        return "text-[#b71c1c] bg-[#fdeeee] border-[#f6c4c4]";
      case "pending":
        return "text-[#8a5a00] bg-[#fff5e6] border-[#f4deba]";
      default:
        return "text-[#6e6e73] bg-[#f5f5f7] border-[#e2e2e6]";
    }
  }

  const stats = [
    { label: "Active events", value: totalEvents },
    { label: "Applications", value: registrations },
    { label: "Registrations", value: registrations },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-[#1d1d1f]">
      <section className="rounded-3xl border border-black/5 bg-white p-6">
        <p className="text-xs uppercase tracking-[0.12em] text-[#0071e3] font-semibold">Dashboard</p>
        <h1 className="mt-2 text-3xl md:text-4xl font-semibold leading-tight text-[#1d1d1f]">Your activity</h1>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-black/5 bg-white p-5">
            <p className="text-xs text-[#6e6e73]">{s.label}</p>
            <p className="mt-2 text-xl font-semibold">{s.value}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-3xl border border-black/5 bg-white overflow-hidden">
          <div className="px-5 py-4 border-b border-black/5 flex justify-between">
            <h2 className="font-medium">Upcoming Events</h2>
            <span className="text-xs text-[#6e6e73]">{totalEvents} active</span>
          </div>
          {eventsList.length === 0 ? (
            <p className="px-5 py-10 text-sm text-[#6e6e73]">No upcoming events</p>
          ) : (
            <div className="divide-y divide-black/5 max-h-[360px] overflow-y-auto">
              {eventsList.map((item) => {
                const isApplied = appliedEvents.includes(item.id);
                const isDeadlinePassed = item.deadlinePassed;
                const isBookingOpen = item.bookingOpensFrom;
                const disabled = isApplied || isDeadlinePassed || !isBookingOpen;

                let label = "Apply";
                if (isApplied) label = "Applied";
                else if (isDeadlinePassed) label = "Closed";
                else if (!isBookingOpen) label = "Not open";

                return (
                  <div key={item.id} className="px-5 py-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs text-[#6e6e73]">{item.city}</p>
                    </div>
                    <button
                      onClick={() => {
                        if (disabled) return;
                        setSelectedEventId(item.id);
                        setShowApplyForm(true);
                      }}
                      disabled={disabled}
                      className="h-9 px-3 rounded-full text-xs border border-black/10 bg-[#f5f5f7] disabled:opacity-50"
                    >
                      {label}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-black/5 bg-white overflow-hidden">
          <div className="px-5 py-4 border-b border-black/5">
            <h2 className="font-medium">Your Activity</h2>
          </div>
          <div className="overflow-auto max-h-[360px]">
            <table className="w-full text-sm">
              <thead className="bg-[#f5f5f7] text-[#6e6e73] text-xs">
                <tr>
                  <th className="text-left px-5 py-3">Event</th>
                  <th className="text-left px-5 py-3">Date</th>
                  <th className="text-center px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {activity.length === 0 ? (
                  <tr><td colSpan={3} className="px-5 py-10 text-center text-[#6e6e73]">No activity yet</td></tr>
                ) : (
                  activity.map((reg) => (
                    <tr key={reg.id}>
                      <td className="px-5 py-3">{reg.Event?.title}</td>
                      <td className="px-5 py-3 text-[#6e6e73]">{formatDateTime(reg.createdAt)}</td>
                      <td className="px-5 py-3 text-center">
                        <span className={`inline-block text-xs border rounded-full px-2 py-1 ${statusStyle(reg.status)}`}>{reg.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <ApplicationForm
        showApplyForm={showApplyForm}
        setShowApplyForm={setShowApplyForm}
        HandleEventApplication={handleEventApplication}
      />
    </div>
  );
}

export default DashboardUser;
