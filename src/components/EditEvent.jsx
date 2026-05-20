import { useState, useEffect } from "react";

function EditEvent({ event, handleEventEdit, showEditForm, setShowEditForm }) {
  const [editformdata, setEditFormData] = useState({
    venue: event?.venueName || "",
    date: event?.eventDate?.slice(0, 10) || "",
    description: event?.fullDescription || "",
    city: event?.city || "",
  });
  const [editerrors, setEditErrors] = useState({});
  const [editformerror, setEditFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown === 0) return;
    const t = setInterval(() => setCooldown((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  if (!showEditForm) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
    setEditErrors((prev) => ({ ...prev, [name]: false }));
  };

  function handleSubmit(e) {
    e.preventDefault();
    setEditFormError("");
    const newErrors = {};
    Object.entries(editformdata).forEach(([key, value]) => {
      if (!value) newErrors[key] = true;
    });
    if (Object.keys(newErrors).length > 0) {
      setEditErrors(newErrors);
      setEditFormError("Please fill all fields!");
      return;
    }
    setLoading(true);
    setCooldown(5);
    handleEventEdit(editformdata);
    setLoading(false);
  }

  const inputClass = (field) =>
    `w-full h-11 px-4 rounded-lg border ${editerrors[field] ? "border-[#d70015] bg-[#fff5f5]" : "border-black/10"} bg-white text-sm outline-none transition focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10`;

  return (
    <div className="fixed inset-0 bg-black/35 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-black/10 bg-white shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-black/10 flex items-center justify-between">
          <h2 className="text-2xl font-semibold leading-tight text-[#1d1d1f]">Edit event</h2>
          <button onClick={() => setShowEditForm(false)} className="w-9 h-9 rounded-full border border-black/10">x</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input name="venue" type="text" placeholder="Venue" value={editformdata.venue} onChange={handleChange} className={inputClass("venue")} />
          <div className="grid grid-cols-2 gap-3">
            <input name="city" type="text" placeholder="City" value={editformdata.city} onChange={handleChange} className={inputClass("city")} />
            <input name="date" type="date" value={editformdata.date} onChange={handleChange} className={inputClass("date")} />
          </div>
          <textarea name="description" rows={4} placeholder="Description" value={editformdata.description} onChange={handleChange} className={`${inputClass("description")} h-auto py-3`} />

          {editformerror && <p className="text-sm text-[#d70015]">{editformerror}</p>}

          <div className="flex gap-2 pt-2 border-t border-black/10">
            <button type="button" onClick={() => setShowEditForm(false)} className="flex-1 h-11 rounded-full border border-black/10">Cancel</button>
            <button type="submit" disabled={loading || cooldown > 0} className="flex-1 h-11 rounded-full bg-[#0071e3] text-white disabled:opacity-50">
              {cooldown > 0 ? `Wait ${cooldown}s` : loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditEvent;
