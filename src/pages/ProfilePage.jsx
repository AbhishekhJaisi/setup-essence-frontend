import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "../components/EditProfileModal";
import DeleteAccModal from "../components/DeleteAccModal";
import apiUrl from '../config/api';


function ProfilePage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [showAccDelForm, setShowAccDelForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  async function handleEditProfile(updatedData) {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        phone_number: updatedData.phone_number,
        country: updatedData.country,
        dob: userData.dob || null,
        city: userData.city || "",
        address: userData.address || "",
        interests: userData.interests || "",
        bio: userData.bio || "",
      };
      const res = await fetch(`${apiUrl}/auth/onboarding`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setUserData((prev) => ({ ...prev, ...payload }));
        setShowEditForm(false);
        return { ok: true };
      } else {
        return { ok: false, message: data?.message || "Profile update failed" };
      }
    } catch (err) {
      console.log(err);
      return { ok: false, message: "Profile update failed" };
    }
  }

  async function handleAccountDelete() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/auth/delete`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${apiUrl}/auth/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setUserData(data.data.user);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    fetchUser();
  }, []);

  const initials = userData.username
    ? userData.username
        .split("_")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const fields = [
    { label: "Username", value: userData.username },
    { label: "Phone", value: userData.phone_number },
    { label: "Email", value: userData.email },
    { label: "Country", value: userData.country },
  ];

  return (
    <div className="space-y-5 text-[#1d1d1f] max-w-7xl mx-auto">
      <section className="relative overflow-hidden rounded-2xl border border-white/70 bg-white/86 p-5 flex flex-col items-start gap-4 shadow-[0_18px_48px_rgba(31,41,55,0.08)] sm:rounded-3xl sm:p-7 sm:flex-row sm:items-center">
        <div className="absolute inset-y-0 right-0 w-2/5 bg-[radial-gradient(circle_at_70%_24%,rgba(99,102,241,0.24),transparent_32%),radial-gradient(circle_at_88%_78%,rgba(16,185,129,0.20),transparent_30%)]" />
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] border border-white/60 flex items-center justify-center text-xl font-semibold text-white shadow-[0_14px_28px_rgba(37,99,235,0.24)]">{initials}</div>
        <div className="relative flex-1">
          <p className="text-xs uppercase tracking-[0.12em] text-[#0071e3] font-semibold">Profile</p>
          <h1 className="mt-1 text-2xl font-semibold leading-tight text-[#1d1d1f] sm:text-3xl">{userData.username || "User"}</h1>
          <p className="text-sm text-[#6e6e73]">{userData.email || "-"}</p>
          <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full border border-black/10 bg-[#f5f5f7] text-xs text-[#424245]">
            {userData.role === "creator" ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L4.8 8.2l5-.7L12 3z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0" />
              </svg>
            )}
            {userData.role === "creator" ? "Creator" : "User"}
          </span>
        </div>
        <button onClick={() => setShowEditForm(true)} className="relative h-10 w-full px-4 rounded-xl bg-[#7c3aed] text-white text-sm shadow-[0_10px_22px_rgba(124,58,237,0.18)] sm:w-auto">Edit Profile</button>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {fields.map(({ label, value }) => (
          <div key={label} className="rounded-2xl border border-white/70 bg-white/88 px-5 py-4 shadow-[0_12px_28px_rgba(31,41,55,0.05)]">
            <p className="text-xs text-[#6e6e73]">{label}</p>
            <p className="mt-1 text-sm">{value || "Not set"}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-[#ffd6d6] bg-[#fff5f5] p-5 flex flex-col items-start gap-3 sm:rounded-3xl sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-medium text-[#b71c1c]">Delete Account</h2>
          <p className="text-sm text-[#a34d4d]">Permanently delete your account and all data.</p>
        </div>
        <button onClick={() => setShowAccDelForm(true)} className="h-10 w-full px-4 rounded-xl bg-[#d70015] text-white text-sm sm:w-auto">Delete</button>
      </section>

      <EditProfileModal
        showEditForm={showEditForm}
        setShowEditForm={setShowEditForm}
        handleEditProfile={handleEditProfile}
        currentProfile={userData}
      />
      <DeleteAccModal
        setShowAccDelForm={setShowAccDelForm}
        showAccDelForm={showAccDelForm}
        handleAccountDelete={handleAccountDelete}
        handleShowDeleteForm={() => setShowAccDelForm(true)}
      />
    </div>
  );
}

export default ProfilePage;
