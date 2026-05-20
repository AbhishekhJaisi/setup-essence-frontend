import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [formData, setFormData] = useState({ email: "" });
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (!formData.email) {
        setError("Empty Fields!");
        return;
      }
      const res = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        console.log("ERROR:", data);
      } else {
        navigate("/otpverification");
      }
    } catch (err) {
      console.log(err);
    }
  }

  localStorage.setItem("email", formData.email);

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-black/5 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-6 sm:p-8">
        <p className="text-xs tracking-[0.14em] uppercase text-[#0071e3] font-semibold mb-2">Account recovery</p>
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight text-[#1d1d1f]">Reset password</h1>
        <p className="text-sm text-[#6e6e73] mt-2 mb-6">Enter your registered email.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-[#6e6e73] mb-2">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full h-12 px-4 rounded-lg border border-black/10 bg-white text-sm outline-none transition focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10"
            />
          </div>

          <p className="text-sm text-[#d70015] min-h-[20px]">{error}</p>

          <button type="submit" className="w-full h-12 rounded-xl bg-[#0071e3] text-white text-sm font-medium shadow-[0_10px_20px_rgba(0,113,227,0.18)] hover:bg-[#0077ed]">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
