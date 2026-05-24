import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiUrl from '../config/api';


function RegisterPage() {
  const Navigate = useNavigate();
  const emptyFormData = {
    username: "",
    email: "",
    password: "",
    phone_number: "",
    role: "",
  };

  const [cnfmpassword, setCnfmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [register, setRegister] = useState("");

  const [formData, setFormData] = useState(emptyFormData);

  const HandleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email || !formData.password || !cnfmpassword || !formData.username || !formData.role) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }
    if (formData.password !== cnfmpassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError("Password must have 8 chars, 1 capital, 1 number, 1 symbol");
      setLoading(false);
      return;
    }

    setError("");
    try {
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }
      setRegister(data.message + ", Redirecting to login...");
      setTimeout(() => Navigate("/"), 1000);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    setFormData(emptyFormData);
  };

  const fields = [
    { label: "Username", type: "text", placeholder: "Enter your username", key: "username" },
    { label: "Email", type: "email", placeholder: "Enter your email", key: "email" },
    { label: "Phone", type: "tel", placeholder: "Enter your phone number", key: "phone_number" },
    { label: "Password", type: "password", placeholder: "Create a password", key: "password" },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl rounded-2xl border border-black/5 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-6 sm:p-8">
        <p className="text-xs tracking-[0.14em] uppercase text-[#0071e3] font-semibold mb-2">Get started</p>
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight text-[#1d1d1f]">Create your account</h1>
        <p className="text-sm text-[#6e6e73] mt-2 mb-6">Join your event workspace and start managing registrations.</p>

        <div className="space-y-4">
          {fields.map(({ label, type, placeholder, key }) => (
            <div key={key}>
              <p className="text-xs text-[#6e6e73] mb-2">{label}</p>
              <input
                type={type}
                placeholder={placeholder}
                value={formData[key]}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                className="w-full h-12 px-4 rounded-lg border border-black/10 bg-white text-sm outline-none transition focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10"
              />
            </div>
          ))}

          <div>
            <p className="text-xs text-[#6e6e73] mb-2">Confirm password</p>
            <input
              type="password"
              placeholder="Repeat your password"
              value={cnfmpassword}
              onChange={(e) => setCnfmPassword(e.target.value)}
              className="w-full h-12 px-4 rounded-lg border border-black/10 bg-white text-sm outline-none transition focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10"
            />
          </div>

          <div>
            <p className="text-xs text-[#6e6e73] mb-2">Register as</p>
            <div className="grid grid-cols-2 gap-2">
              {[{ value: "user", label: "User" }, { value: "creator", label: "Event Manager" }].map(({ value, label }) => {
                const active = formData.role === value;
                return (
                  <label
                    key={value}
                    className={`h-11 rounded-lg border text-sm flex items-center justify-center cursor-pointer transition ${
                      active ? "border-[#0071e3] bg-[#0071e3]/10 text-[#0071e3]" : "border-black/10 text-[#424245]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={value}
                      checked={active}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="sr-only"
                    />
                    {label}
                  </label>
                );
              })}
            </div>
          </div>

          {error && <p className="text-sm text-[#d70015]">{error}</p>}
          {register && <p className="text-sm text-[#248a3d]">{register}</p>}

          <button
            type="submit"
            disabled={loading}
            onClick={HandleSubmit}
            className="w-full h-12 rounded-xl bg-[#0071e3] text-white text-sm font-medium shadow-[0_10px_20px_rgba(0,113,227,0.18)] hover:bg-[#0077ed] disabled:opacity-60"
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </div>

        <p className="text-center text-sm text-[#6e6e73] mt-6">
          Already have an account?{" "}
          <button onClick={() => Navigate("/")} className="text-[#0071e3] hover:underline">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
