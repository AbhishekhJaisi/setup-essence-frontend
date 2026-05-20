import { useState, useEffect } from "react";

function CreateEventForm({ HandleEventCreation, showForm, setShowForm }) {
  const [formData, setFormData] = useState({
    organizer: "",
    hostEmail: "",
    hostPhone: "",
    title: "",
    eventDate: "",
    eventTimeStart: "",
    eventTimeEnd: "",
    venueName: "",
    city: "",
    capacityTotal: "",
    fileUpload: "",
    fullDescription: "",
    priceAmount: "",
    registrationDeadline: "",
    bookingOpenDate: "",
    visibleFrom: "",
  });
  const [errors, setErrors] = useState({});
  const [formerror, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown === 0) return;
    const t = setInterval(() => setCooldown((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  if (!showForm) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (cooldown > 0) return;
    setFormError("");
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value) newErrors[key] = true;
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setFormError("Please fill all fields!");
      return;
    }
    const selectedDate = new Date(formData.eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setFormError("Date cannot be in the past");
      return;
    }
    if (formData.hostPhone.length !== 10) {
      setFormError("Phone number must be 10 digits");
      return;
    }
    setCooldown(5);
    setLoading(true);
    HandleEventCreation(formData);
    setLoading(false);
  }

  const inp = (field) =>
    `w-full h-11 px-4 rounded-lg border ${errors[field] ? "border-[#d70015] bg-[#fff5f5]" : "border-black/10"} bg-white text-sm outline-none transition focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10`;
  const label = "block text-xs text-[#6e6e73] mb-1.5";

  return (
    <div className="fixed inset-0 bg-black/35 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-4xl rounded-2xl border border-black/10 bg-white shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-black/10 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-[#6e6e73]">Creator</p>
            <h2 className="text-2xl font-semibold leading-tight text-[#1d1d1f]">Create new event</h2>
          </div>
          <button onClick={() => setShowForm(false)} className="w-9 h-9 rounded-full border border-black/10">x</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 max-h-[82vh] overflow-y-auto space-y-5">
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#6e6e73]">Event Details</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={label}>Organizer Name</label>
              <input name="organizer" placeholder="Organizer name" value={formData.organizer} onChange={handleChange} className={inp("organizer")} />
            </div>
            <div>
              <label className={label}>Host Email</label>
              <input name="hostEmail" type="email" placeholder="host@email.com" value={formData.hostEmail} onChange={handleChange} className={inp("hostEmail")} />
            </div>
            <div>
              <label className={label}>Host Phone</label>
              <input name="hostPhone" placeholder="10-digit number" value={formData.hostPhone} onChange={handleChange} className={inp("hostPhone")} />
            </div>
            <div>
              <label className={label}>Event Title</label>
              <input name="title" placeholder="Event title" value={formData.title} onChange={handleChange} className={inp("title")} />
            </div>
            <div>
              <label className={label}>Category</label>
              <select name="category" onChange={handleChange} value={formData.category} className={inp("category")}>
                <option value="">Select category</option>
                {[
                  "Social",
                  "Networking",
                  "Tech",
                  "Meet",
                  "Research",
                  "Entertainment",
                  "Finance",
                ].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Event Banner/Image</label>
              <input name="fileUpload" type="file" accept="image/*" onChange={handleChange} className={`${inp("fileUpload")} py-2`} />
            </div>
            <div>
              <label className={label}>Event Date</label>
              <input name="eventDate" type="date" value={formData.eventDate} onChange={handleChange} className={inp("eventDate")} />
            </div>
            <div>
              <label className={label}>Start Time</label>
              <input name="eventTimeStart" type="time" value={formData.eventTimeStart} onChange={handleChange} className={inp("eventTimeStart")} />
            </div>
            <div>
              <label className={label}>End Time</label>
              <input name="eventTimeEnd" type="time" value={formData.eventTimeEnd} onChange={handleChange} className={inp("eventTimeEnd")} />
            </div>
            <div>
              <label className={label}>Ticket Price</label>
              <input name="priceAmount" type="number" placeholder="0" value={formData.priceAmount} onChange={handleChange} className={inp("priceAmount")} />
            </div>
            <div>
              <label className={label}>Registration Deadline</label>
              <input name="registrationDeadline" type="datetime-local" value={formData.registrationDeadline} onChange={handleChange} className={inp("registrationDeadline")} />
            </div>
            <div>
              <label className={label}>Booking Opens On</label>
              <input name="bookingOpenDate" type="date" value={formData.bookingOpenDate} onChange={handleChange} className={inp("bookingOpenDate")} />
            </div>
            <div>
              <label className={label}>Visible From (Listing Date)</label>
              <input name="visibleFrom" type="date" value={formData.visibleFrom} onChange={handleChange} className={inp("visibleFrom")} />
            </div>
            <div>
              <label className={label}>Venue Name</label>
              <input name="venueName" placeholder="Venue name" value={formData.venueName} onChange={handleChange} className={inp("venueName")} />
            </div>
            <div>
              <label className={label}>City</label>
              <input name="city" placeholder="City" value={formData.city} onChange={handleChange} className={inp("city")} />
            </div>
            <div>
              <label className={label}>Total Capacity</label>
              <input name="capacityTotal" type="number" placeholder="0" value={formData.capacityTotal} onChange={handleChange} className={inp("capacityTotal")} />
            </div>
            <div className="md:col-span-2">
              <label className={label}>Full Description</label>
              <textarea name="fullDescription" rows={4} placeholder="Describe your event details" value={formData.fullDescription} onChange={handleChange} className={`${inp("fullDescription")} h-auto py-3`} />
            </div>
          </div>

          {formerror && <p className="text-sm text-[#d70015]">{formerror}</p>}

          <div className="flex gap-2 pt-3 border-t border-black/10">
            <button type="button" onClick={() => setShowForm(false)} className="flex-1 h-11 rounded-full border border-black/10">Cancel</button>
            <button type="submit" disabled={loading || cooldown > 0} className="flex-1 h-11 rounded-full bg-[#0071e3] text-white disabled:opacity-50">
              {cooldown > 0 ? `Wait ${cooldown}s` : loading ? "Creating..." : "Create event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEventForm;
