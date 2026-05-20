import { useState } from "react";

function ApplicationForm({ HandleEventApplication, showApplyForm, setShowApplyForm }) {
  const [applyFormData, setApplyFormData] = useState({ notes: "", numberOfGuests: "" });
  const [applyerrors, setApplyErrors] = useState({});
  const [applyformerror, setApplyFormError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!showApplyForm) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApplyFormData((prev) => ({ ...prev, [name]: value }));
    setApplyErrors((prev) => ({ ...prev, [name]: false }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const newErrors = {};
    Object.entries(applyFormData).forEach(([key, value]) => {
      if (!value) newErrors[key] = true;
    });
    if (Object.keys(newErrors).length > 0) {
      setApplyErrors(newErrors);
      setApplyFormError("Please fill all fields!");
      setLoading(false);
      return;
    }
    await HandleEventApplication(applyFormData);
    setLoading(false);
  }

  const inputClass = (field) =>
    `w-full h-11 px-4 rounded-2xl border ${applyerrors[field] ? "border-[#d70015] bg-[#fff5f5]" : "border-black/10"} bg-white text-sm outline-none focus:border-[#0071e3]`;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white shadow-2xl p-6">
        <h2 className="text-2xl font-semibold">Apply for event</h2>
        <p className="text-sm text-[#6e6e73] mt-1 mb-4">Fill your registration details.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-xs text-[#6e6e73] mb-2">Note</p>
            <textarea name="notes" rows={3} value={applyFormData.notes} onChange={handleChange} className={`${inputClass("notes")} h-auto py-3`} />
          </div>
          <div>
            <p className="text-xs text-[#6e6e73] mb-2">Number of guests</p>
            <input name="numberOfGuests" type="number" value={applyFormData.numberOfGuests} onChange={handleChange} className={inputClass("numberOfGuests")} />
          </div>
          {applyformerror && <p className="text-sm text-[#d70015]">{applyformerror}</p>}
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={() => setShowApplyForm(false)} className="flex-1 h-11 rounded-full border border-black/10">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 h-11 rounded-full bg-[#0071e3] text-white disabled:opacity-60">{loading ? "Applying..." : "Apply"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplicationForm;
