import { useNavigate } from "react-router-dom";
import { useState } from "react";
import eventosMark from "../assets/eventos-mark.svg";
import StickyEventBanner from "../components/StickyEventBanner";

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorlogin, setErrorLogin] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  const HandleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrorLogin("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, rememberMe }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        setErrorLogin(data?.message || "Invalid credentials");
        setLoading(false);
        return;
      }
      const user = data?.data?.user ?? data?.user ?? null;
      const token = data?.data?.token ?? data?.token ?? null;

      if (!user || !token) {
        setErrorLogin("Login response is incomplete. Please try again.");
        return;
      }

      localStorage.setItem("username", user.username ?? "");
      localStorage.setItem("userId", String(user.id ?? ""));
      localStorage.setItem("role", user.role ?? "");
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      setErrorLogin("Invalid credentials");
    } finally {
      setLoading(false);
    }
    setFormData({ email: "", password: "" });
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex flex-col">
      <header className="px-6 py-5">
        <div className="inline-flex items-center gap-2.5">
          <img src={eventosMark} alt="Eventos" className="h-9 w-9 rounded-xl shadow-[0_8px_18px_rgba(37,99,235,0.24)]" />
          <div className="leading-tight">
            <p className="text-[18px] font-semibold text-[#1d1d1f]">Eventos</p>
            <p className="text-[10px] tracking-[0.1em] uppercase text-[#6e6e73]">Event Management</p>
          </div>
        </div>
      </header>
      <StickyEventBanner />

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <section>
            <p className="text-xs tracking-[0.14em] uppercase text-[#0071e3] font-semibold mb-3">Welcome back</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.04] text-[#1d1d1f]">
              Run every event
              <br />
              from one sharp
              <br />
              workspace.
            </h1>
            <p className="mt-6 text-lg text-[#424245] max-w-xl">
              Manage events, registrations, and updates from one calm, focused dashboard.
            </p>
          </section>

          <section className="rounded-2xl border border-black/5 bg-white/90 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-6 sm:p-8">
            <form onSubmit={HandleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-[#6e6e73] mb-2">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-12 px-4 rounded-lg border border-black/10 bg-white text-sm outline-none transition focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10"
                />
              </div>

              <div>
                <label className="block text-xs text-[#6e6e73] mb-2">Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full h-12 px-4 rounded-lg border border-black/10 bg-white text-sm outline-none transition focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-[#0071e3]"
                />
                <label htmlFor="rememberMe" className="text-xs text-[#424245]">Remember me</label>
                <button
                  type="button"
                  onClick={() => navigate("/forgotpassword")}
                  className="ml-auto text-xs text-[#0071e3] hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <p className="text-sm text-[#d70015] min-h-[20px]">{errorlogin}</p>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-[#0071e3] text-white text-sm font-medium shadow-[0_10px_20px_rgba(0,113,227,0.18)] hover:bg-[#0077ed] disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-5 text-sm text-[#424245] text-center">
              Do not have an account?{" "}
              <button onClick={() => navigate("/register")} className="text-[#0071e3] hover:underline">
                Register
              </button>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
