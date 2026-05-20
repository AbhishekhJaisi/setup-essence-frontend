import { useEffect, useState } from "react";
import ApplicantsList from "../components/ApplicantList";
import EditEvent from "../components/EditEvent";

function fmt(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function FillBar({ filled, total }) {
  const pct = total > 0 ? Math.round(((total - filled) / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-[#ececf0] rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-[#0071e3]" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-[#6e6e73] whitespace-nowrap">{filled}/{total}</span>
    </div>
  );
}

const STATUS_COLORS = {
  Upcoming: "text-[#8a5a00] bg-[#fff5e6] border-[#f4deba]",
  Ongoing: "text-[#248a3d] bg-[#e8f7ed] border-[#bfe7ca]",
  Completed: "text-[#6e6e73] bg-[#f5f5f7] border-[#e2e2e6]",
};

function DashboardEventCreator() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [applicants, setApplicants] = useState({});
  const [showApplicants, setShowApplicants] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const token = localStorage.getItem("token");

  const handleUpdate = async (editformdata) => {
    try {
      const res = await fetch(`${apiUrl}/api/events/${editingEvent.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          venueName: editformdata.venue,
          eventDate: editformdata.date,
          fullDescription: editformdata.description,
          city: editformdata.city,
        }),
      });
      const data = await res.json();
      setEventsList((prev) => prev.map((e) => (e.id === editingEvent.id ? data : e)));
      setShowEditForm(false);
      setEditingEvent(null);
    } catch (err) {
      console.error(err);
    }
  };

  async function fetchApplicants(eventId) {
    try {
      const res = await fetch(`${apiUrl}/api/registrations/event/${eventId}/applicants`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const list = Array.isArray(data.data.registrations) ? data.data.registrations : [];
      setApplicants((prev) => ({ ...prev, [eventId]: list }));
    } catch (err) {
      console.error(err);
    }
  }

  async function handleStatus(regId, status) {
    try {
      await fetch(`${apiUrl}/api/registrations/${regId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      setShowApplicants(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function fetchCreatorDetails() {
      try {
        const res = await fetch(`${apiUrl}/api/events/my-events`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`${res.status}`);
        const data = await res.json();
        setEventsList(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        console.error(err);
        setError("You have no events.");
      } finally {
        setLoading(false);
      }
    }
    fetchCreatorDetails();
  }, []);

  function showApplicantsFunc(id) {
    setShowApplicants(true);
    setSelectedEventId(id);
    fetchApplicants(id);
  }

  const activeEvents = eventsList.filter((e) => e.isActive);
  const now = new Date();
  const upcomingEvents = eventsList.filter(
    (e) => new Date(e.eventDate) >= now,
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-[#1d1d1f]">
      <section className="rounded-3xl border border-black/5 bg-gradient-to-b from-white to-[#fafafa] p-7 shadow-[0_10px_35px_rgba(0,0,0,0.05)]">
        <p className="text-xs uppercase tracking-[0.12em] text-[#0071e3] font-semibold">Creator Dashboard</p>
        <h1 className="mt-2 text-3xl md:text-4xl font-semibold leading-tight text-[#1d1d1f]">Manage events and applications</h1>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"><p className="text-xs text-[#6e6e73]">Events Created</p><p className="mt-2 text-xl font-semibold">{eventsList.length}</p></div>
        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"><p className="text-xs text-[#6e6e73]">Active Events</p><p className="mt-2 text-xl font-semibold">{activeEvents.length}</p></div>
        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"><p className="text-xs text-[#6e6e73]">Revenue</p><p className="mt-2 text-xl font-semibold">Rs 21,000</p></div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="rounded-3xl border border-black/5 bg-white overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-black/5"><h2 className="font-medium">Upcoming Events</h2></div>
          <div className="overflow-auto max-h-[380px]">
            <table className="w-full text-sm">
              <thead className="bg-[#f5f5f7] text-[#6e6e73] text-xs"><tr><th className="text-left px-5 py-3">Title</th><th className="text-left px-5 py-3">Date</th><th className="text-left px-5 py-3">Status</th><th className="text-left px-5 py-3"></th></tr></thead>
              <tbody className="divide-y divide-black/5">
                {loading ? <tr><td colSpan={4} className="px-5 py-10 text-center text-[#6e6e73]">Loading events...</td></tr> : error ? <tr><td colSpan={4} className="px-5 py-10 text-center text-[#6e6e73]">{error}</td></tr> : upcomingEvents.length === 0 ? <tr><td colSpan={4} className="px-5 py-10 text-center text-[#6e6e73]">No upcoming events.</td></tr> : upcomingEvents.map((event) => (
                  <tr key={event.id}>
                    <td className="px-5 py-3">{event.title}</td>
                    <td className="px-5 py-3 text-[#6e6e73]">{fmt(event.eventDate)}</td>
                    <td className="px-5 py-3"><span className={`inline-block text-xs border rounded-full px-2 py-1 ${STATUS_COLORS[event.eventStatus] ?? "text-[#6e6e73] bg-[#f5f5f7] border-[#e2e2e6]"}`}>{event.eventStatus}</span></td>
                    <td className="px-5 py-3"><button onClick={() => { setEditingEvent(event); setSelectedEventId(event.id); setShowEditForm(true); }} className="text-xs text-[#0071e3]">Edit</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl border border-black/5 bg-white overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-black/5"><h2 className="font-medium">Application Overview</h2></div>
          <div className="overflow-auto max-h-[380px]">
            <table className="w-full text-sm">
              <thead className="bg-[#f5f5f7] text-[#6e6e73] text-xs"><tr><th className="text-left px-5 py-3">Title</th><th className="text-left px-5 py-3">Spots</th><th className="text-left px-5 py-3">Fill Rate</th><th className="text-left px-5 py-3"></th></tr></thead>
              <tbody className="divide-y divide-black/5">
                {loading ? <tr><td colSpan={4} className="px-5 py-10 text-center text-[#6e6e73]">Loading...</td></tr> : eventsList.length === 0 ? <tr><td colSpan={4} className="px-5 py-10 text-center text-[#6e6e73]">No events to manage.</td></tr> : eventsList.map((event) => (
                  <tr key={event.id}>
                    <td className="px-5 py-3">{event.title}</td>
                    <td className="px-5 py-3 text-[#6e6e73]">{event.capacityRemaining}/{event.capacityTotal}</td>
                    <td className="px-5 py-3 min-w-[130px]"><FillBar filled={event.capacityRemaining} total={event.capacityTotal} /></td>
                    <td className="px-5 py-3"><button onClick={() => showApplicantsFunc(event.id)} className="text-xs text-[#0071e3]">View Apps</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <ApplicantsList showApplicants={showApplicants} setShowApplicants={setShowApplicants} applicants={applicants[selectedEventId] || []} handleStatus={handleStatus} eventsList={eventsList} />
      {showEditForm && editingEvent && <EditEvent showEditForm={showEditForm} setShowEditForm={setShowEditForm} handleEventEdit={handleUpdate} event={editingEvent} />}
    </div>
  );
}

export default DashboardEventCreator;
