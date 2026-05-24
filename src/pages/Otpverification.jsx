import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiUrl from '../config/api';


function ForgotPassword() {
  const [formData, setFormData] = useState({
    otp: "",
    email: localStorage.getItem("email"),
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (!formData.otp) {
        setError("Empty field!");
        return;
      }
      const res = await fetch(`${apiUrl}/auth/verifyOtp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        console.log("ERROR:", data);
      } else {
        navigate("/resetpassword");
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-black/5 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-6 sm:p-8">
        <p className="text-xs tracking-[0.14em] uppercase text-[#0071e3] font-semibold mb-2">Security check</p>
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight text-[#1d1d1f]">Verify OTP</h1>
        <p className="text-sm text-[#6e6e73] mt-2 mb-6">Enter the code sent to your email.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-[#6e6e73] mb-2">OTP</label>
            <input
              name="otp"
              type="text"
              value={formData.otp}
              onChange={handleChange}
              placeholder="Enter OTP"
              className="w-full h-12 px-4 rounded-lg border border-black/10 bg-white text-sm outline-none transition focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10"
            />
          </div>

          <p className="text-sm text-[#d70015] min-h-[20px]">{error}</p>

          <button type="submit" className="w-full h-12 rounded-xl bg-[#0071e3] text-white text-sm font-medium shadow-[0_10px_20px_rgba(0,113,227,0.18)] hover:bg-[#0077ed]">
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
