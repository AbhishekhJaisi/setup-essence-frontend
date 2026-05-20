import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const [formData, setFormData] = useState({
    email: localStorage.getItem("email"),
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (!formData.newPassword || !formData.confirmPassword) {
        setError("Empty fields!");
        return;
      }

      const res = await fetch(`${apiUrl}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        console.log("ERROR:", data);
      } else {
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-black/5 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-6 sm:p-8">
        <p className="text-xs tracking-[0.14em] uppercase text-[#0071e3] font-semibold mb-2">New credentials</p>
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight text-[#1d1d1f]">Set password</h1>
        <p className="text-sm text-[#6e6e73] mt-2 mb-6">Create your new password.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-[#6e6e73] mb-2">New password</label>
            <input
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full h-12 px-4 rounded-lg border border-black/10 bg-white text-sm outline-none transition focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10"
            />
          </div>

          <div>
            <label className="block text-xs text-[#6e6e73] mb-2">Confirm password</label>
            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="w-full h-12 px-4 rounded-lg border border-black/10 bg-white text-sm outline-none transition focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10"
            />
          </div>

          <p className="text-sm text-[#d70015] min-h-[20px]">{error}</p>

          <button type="submit" className="w-full h-12 rounded-xl bg-[#0071e3] text-white text-sm font-medium shadow-[0_10px_20px_rgba(0,113,227,0.18)] hover:bg-[#0077ed]">
            Save password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
