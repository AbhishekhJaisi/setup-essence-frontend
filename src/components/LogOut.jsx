import { useNavigate } from "react-router-dom";

function LogOut({ setShowLogoutForm, showlogoutform }) {
  const navigate = useNavigate();

  if (!showlogoutform) return null;

  async function CnfLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");

    setShowLogoutForm(false);

    navigate("/", { replace: true });
  }

  return (
    <div className="fixed inset-0 bg-[#05070d]/75 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-sm rounded-3xl border border-white/[0.1] bg-[#0f1526] shadow-[0_30px_90px_rgba(0,0,0,0.55)] overflow-hidden">
        <div className="px-6 py-6">
          <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-400/25 flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-red-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 15l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
          </div>

          <h2 className="font-serif text-2xl text-[#eaf0ff] mb-1">Sign out</h2>
          <p className="text-sm text-white/60 mb-6">
            Are you sure you want to sign out? You will need to log in again.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => setShowLogoutForm(false)}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white/70 bg-white/[0.08] hover:bg-white/[0.14] rounded-xl border border-white/[0.1] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={CnfLogout}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-red-100 bg-red-500/70 hover:bg-red-500 rounded-xl transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogOut;
