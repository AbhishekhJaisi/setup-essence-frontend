import { useEffect, useState } from "react";
import CreateEventForm from "../components/CreateEventForm";
import ApplicationForm from "../components/ApplicationForm";
import EditEvent from "../components/EditEvent";
import ApplicantsList from "../components/ApplicantList";

function EventsPage() {
  const [eventsList, setEventsList] = useState([]);
  const [appliedEvents, setAppliedEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [applicants, setApplicants] = useState({});
  const [showApplicants, setShowApplicants] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const itemsPerPage = 6;
  const apiUrl = import.meta.env.VITE_API_URL;
  const isCreator = role === "creator";
  const isUser = role === "user";

  const toggleCard = (id) => setExpandedId((prev) => (prev === id ? null : id));

  function parseEventDateLocal(value) {
    if (!value) return null;
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [year, month, day] = value.split("-").map(Number);
      return new Date(year, month - 1, day);
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;
    return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  }

  function formatDateTime(datetime) {
    return new Date(datetime).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  async function handleDelete(id) {
    try {
      const res = await fetch(`${apiUrl}/api/events/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setEventsList((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchApplicants(eventId) {
    try {
      const res = await fetch(`${apiUrl}/api/registrations/event/${eventId}/applicants`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const list = Array.isArray(data?.data?.registrations) ? data.data.registrations : [];
      setApplicants((prev) => ({ ...prev, [eventId]: list }));
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    async function checkApplications() {
      try {
        const res = await fetch(`${apiUrl}/api/registrations/my-applications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setAppliedEvents((data?.data || []).map((item) => item.eventId));
      } catch (err) {
        console.log(err);
      }
    }
    checkApplications();
  }, []);

  async function fetchEvents() {
    try {
      setLoadingEvents(true);
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append("title", searchQuery);
      params.append("page", 1);
      params.append("limit", 50);
      const res = await fetch(`${apiUrl}/api/events/view-events?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEventsList(data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEvents(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(fetchEvents, 350);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    if (!eventsList.length) return;
    const userId = Number(localStorage.getItem("userId"));
    eventsList.forEach((event) => {
      if (event.userId === userId && !applicants[event.id]) fetchApplicants(event.id);
    });
  }, [eventsList]);

  async function handleEventCreation(formData) {
    try {
      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        dataToSend.append(key === "image" ? "fileUpload" : key, value);
      });
      const res = await fetch(`${apiUrl}/api/events/createEvents`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: dataToSend,
      });
      const data = await res.json();
      if (res.ok) {
        setEventsList((prev) => [...prev, data]);
        setShowForm(false);
      }
    } catch (err) {
      console.error(err);
    }
  }

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
      if (res.ok) {
        const userId = Number(localStorage.getItem("userId"));
        setApplicants((prev) => {
          const existing = prev[selectedEventId] || [];
          if (existing.some((a) => a.userId === userId)) return prev;
          return { ...prev, [selectedEventId]: [...existing, { userId }] };
        });
        setAppliedEvents((prev) => [...prev, selectedEventId]);
        setShowApplyForm(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdate(editformdata) {
    try {
      if (!editingEvent?.id) return;
      const payload = {
        ...editingEvent,
        venueName: editformdata.venue,
        eventDate: editformdata.date,
        fullDescription: editformdata.description,
        city: editformdata.city,
      };
      const res = await fetch(`${apiUrl}/api/events/${editingEvent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Profile update failed");
      }
      setEventsList((prev) => prev.map((e) => (e.id === editingEvent.id ? data : e)));
      setShowEditForm(false);
      setEditingEvent(null);
      return { ok: true };
    } catch (err) {
      console.error(err);
      return { ok: false, message: err?.message || "Update failed" };
    }
  }

  const visibleEvents = eventsList.filter((e) => e?.isVisible !== false);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const closedEvents = visibleEvents.filter(
    (e) => {
      const eventDate = parseEventDateLocal(e?.eventDate);
      return eventDate && eventDate < today;
    },
  );
  const upcomingEvents = visibleEvents.filter(
    (e) => {
      const eventDate = parseEventDateLocal(e?.eventDate);
      return eventDate && eventDate >= today;
    },
  );
  const selectedEvents = upcomingEvents;

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-[#1d1d1f]">
      <section className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/82 p-6 shadow-[0_18px_48px_rgba(31,41,55,0.08)]">
        <div className="absolute inset-y-0 right-0 w-2/5 bg-[radial-gradient(circle_at_80%_25%,rgba(236,72,153,0.22),transparent_32%),radial-gradient(circle_at_70%_82%,rgba(14,165,255,0.22),transparent_28%)]" />
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.12em] text-[#0071e3] font-semibold">Events</p>
            <h1 className="mt-2 text-3xl md:text-4xl font-semibold leading-tight text-[#1d1d1f]">
              {isCreator ? "Manage your events" : "Discover events"}
            </h1>
            <p className="mt-2 text-sm text-[#6e6e73]">Browse, apply, and track activity in one place.</p>
          </div>
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              placeholder="Search events"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-56 rounded-lg border border-black/10 bg-white px-4 text-sm outline-none transition focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10"
            />
            {isCreator && (
              <button onClick={() => setShowForm(true)} className="h-11 px-4 rounded-xl bg-[#0071e3] text-white text-sm shadow-[0_10px_22px_rgba(0,113,227,0.18)]">
                Create Event
              </button>
            )}
          </div>
        </div>

        <div className="relative grid grid-cols-3 gap-3 mt-6">
          <div className="rounded-2xl bg-[#eef6ff] border border-[#cfe7ff] p-4"><p className="text-xs text-[#1d4ed8]">Live Events</p><p className="text-xl font-semibold mt-1">{upcomingEvents.length}</p></div>
          <div className="rounded-2xl bg-[#f3e8ff] border border-[#e4ccff] p-4"><p className="text-xs text-[#7c3aed]">Registered</p><p className="text-xl font-semibold mt-1">{appliedEvents.length}</p></div>
          <div className="rounded-2xl bg-[#fff4e8] border border-[#fed7aa] p-4"><p className="text-xs text-[#c2410c]">Closed Events</p><p className="text-xl font-semibold mt-1">{closedEvents.length}</p></div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Upcoming Events</h2>
          <span className="text-xs text-[#6e6e73]">{upcomingEvents.length} total</span>
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loadingEvents ? (
          <div className="col-span-full rounded-3xl border border-black/5 bg-white py-14 text-center text-[#6e6e73]">Loading events...</div>
        ) : selectedEvents.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-black/5 bg-white py-14 text-center text-[#6e6e73]">No events found.</div>
        ) : (
          selectedEvents.map((event) => {
            const userId = localStorage.getItem("userId");
            const isApplied = appliedEvents.includes(event.id);
            const isDeadlineOpen = !event.deadlinePassed;
            const isBookingOpen = event.bookingOpensFrom;
            const bookingStartDate = event.bookingOpenDate;
            const isOwner = event.userId?.toString() === userId;
            const isExpanded = expandedId === event.id;

            let applyLabel = "Apply Now";
            let applyStyle = "bg-[#0071e3] text-white";
            if (isApplied) {
              applyLabel = "Registered";
              applyStyle = "bg-[#e8f7ed] text-[#248a3d] border border-[#bfe7ca]";
            } else if (!isBookingOpen) {
              applyLabel = `Opens ${new Date(bookingStartDate).toLocaleString("en-IN", { day: "numeric", month: "short" })}`;
              applyStyle = "bg-[#f5f5f7] text-[#6e6e73] border border-[#e2e2e6]";
            } else if (!isDeadlineOpen) {
              applyLabel = "Closed";
              applyStyle = "bg-[#f5f5f7] text-[#6e6e73] border border-[#e2e2e6]";
            }

            return (
              <article key={event.id} className="rounded-3xl border border-white/70 bg-white/90 overflow-hidden shadow-[0_12px_34px_rgba(31,41,55,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(31,41,55,0.12)]">
                <button className="w-full text-left" onClick={() => toggleCard(event.id)}>
                  <div className="h-48 bg-[#eef2f7] relative">
                    <img src={`${apiUrl}/${event.fileUpload}`} alt={event.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 to-transparent" />
                  </div>
                </button>

                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold leading-snug">{event.title}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-[#eef6ff] text-[#1d4ed8] border border-[#cfe7ff]">{event.category}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-[#6e6e73]">
                    <p>Date: {new Date(event.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                    <p>Time: {event.eventTimeStart} - {event.eventTimeEnd}</p>
                    <p>City: {event.city}</p>
                    <p>Spots: {event.capacityRemaining}/{event.capacityTotal}</p>
                    <p>Price: Rs {event.priceAmount}</p>
                    <p>Deadline: {formatDateTime(event.registrationDeadline)}</p>
                  </div>

                  {isExpanded && (
                    <div className="rounded-2xl border border-black/5 bg-[#fafafa] p-3 text-sm text-[#424245]">
                      <p>{event.fullDescription}</p>
                      {isOwner && (
                        <button
                          onClick={() => {
                            setShowApplicants(true);
                            setSelectedEventId(event.id);
                          }}
                          className="mt-3 h-9 px-3 rounded-full border border-black/10 text-xs"
                        >
                          View Applicants
                        </button>
                      )}
                    </div>
                  )}

                  <button onClick={() => toggleCard(event.id)} className="text-xs text-[#0071e3]">
                    {isExpanded ? "Show less" : "Show more"}
                  </button>

                  <div className="flex gap-2">
                    {isUser && (
                      <button
                        onClick={() => {
                          setShowApplyForm(true);
                          setSelectedEventId(event.id);
                        }}
                        disabled={isApplied || !isBookingOpen || !isDeadlineOpen}
                        className={`flex-1 h-10 rounded-full text-xs font-medium ${applyStyle} disabled:opacity-60`}
                      >
                        {applyLabel}
                      </button>
                    )}

                    {isCreator && isOwner && (
                      <>
                        <button
                          onClick={() => {
                            setEditingEvent(event);
                            setSelectedEventId(event.id);
                            setShowEditForm(true);
                          }}
                          className="h-10 px-3 rounded-full border border-black/10 text-xs"
                        >
                          Edit
                        </button>
                        <button onClick={() => handleDelete(event.id)} className="h-10 px-3 rounded-full bg-[#d70015] text-white text-xs">
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Closed Events</h2>
          <span className="text-xs text-[#6e6e73]">{closedEvents.length} total</span>
        </div>
        <div className="rounded-3xl border border-white/70 bg-white/88 overflow-hidden shadow-[0_12px_34px_rgba(31,41,55,0.06)]">
          {closedEvents.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#6e6e73]">No closed events.</div>
          ) : (
            <div className="divide-y divide-black/5">
              {closedEvents.map((event) => (
                <div key={`closed-${event.id}`} className="px-5 py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{event.title}</p>
                    <p className="text-xs text-[#6e6e73]">
                      {new Date(event.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {event.city}
                    </p>
                  </div>
                  <span className="h-8 px-3 rounded-full border border-[#e2e2e6] bg-[#f5f5f7] text-[#6e6e73] text-xs flex items-center">
                    Closed
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <ApplicationForm showApplyForm={showApplyForm} setShowApplyForm={setShowApplyForm} HandleEventApplication={handleEventApplication} />
      <CreateEventForm showForm={showForm} setShowForm={setShowForm} HandleEventCreation={handleEventCreation} />
      {showEditForm && editingEvent && <EditEvent showEditForm={showEditForm} setShowEditForm={setShowEditForm} handleEventEdit={handleUpdate} event={editingEvent} />}
      <ApplicantsList showApplicants={showApplicants} setShowApplicants={setShowApplicants} applicants={applicants[selectedEventId] || []} handleStatus={handleStatus} eventsList={eventsList} />
    </div>
  );
}

export default EventsPage;
