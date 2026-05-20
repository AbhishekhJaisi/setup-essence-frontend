import { useEffect, useState } from "react";

function EditProfileModal({
  handleEditProfile,
  showEditForm,
  setShowEditForm,
  currentProfile,
}) {
  const [editProfileFormData, setEditProfileFormData] = useState({ phone_number: "", country: "" });
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!showEditForm) return;
    setEditProfileFormData({
      phone_number: currentProfile?.phone_number ? String(currentProfile.phone_number) : "",
      country: currentProfile?.country || "",
    });
    setFormError("");
  }, [showEditForm, currentProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProfileFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!showEditForm) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editProfileFormData.phone_number || editProfileFormData.phone_number.length !== 10) {
      setFormError("Phone number must be exactly 10 digits");
      return;
    }
    setLoading(true);
    const result = await handleEditProfile(editProfileFormData);
    if (!result?.ok) {
      setFormError(result?.message || "Profile update failed");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white shadow-2xl p-6">
        <h2 className="text-2xl font-semibold">Edit profile</h2>
        <p className="text-sm text-[#6e6e73] mt-1 mb-4">Update your details.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-[#6e6e73] mb-2">Phone Number</label>
            <input type="number" name="phone_number" onChange={handleChange} value={editProfileFormData.phone_number} className="w-full h-11 px-4 rounded-2xl border border-black/10 text-sm outline-none focus:border-[#0071e3]" />
          </div>
          <div>
            <label className="block text-xs text-[#6e6e73] mb-2">Country</label>
            <input type="text" name="country" onChange={handleChange} value={editProfileFormData.country} className="w-full h-11 px-4 rounded-2xl border border-black/10 text-sm outline-none focus:border-[#0071e3]" />
          </div>
          {formError && <p className="text-sm text-[#d70015]">{formError}</p>}
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={() => setShowEditForm(false)} className="flex-1 h-11 rounded-full border border-black/10">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 h-11 rounded-full bg-[#0071e3] text-white disabled:opacity-60">{loading ? "Saving..." : "Save changes"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;
