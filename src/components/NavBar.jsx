import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import NotificationModal from "./NotificationModal";
import { socket } from "../socket";
import LogOut from "./LogOut";
import eventosMark from "../assets/eventos-mark.svg";

function NavBar() {
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showlogoutform, setShowLogoutForm] = useState(false);
  const [unreadcount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const apiUrl = import.meta.env.VITE_API_URL;

  const userData = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  const user = userData && userData !== "undefined" ? JSON.parse(userData) : null;

  const name = user?.name || user?.username || localStorage.getItem("username") || "User";
  const initials = name.charAt(0).toUpperCase();

  const handleNotificationClick = async (id) => {
    let alreadyRead = false;
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          alreadyRead = n.isRead;
          return { ...n, isRead: true };
        }
        return n;
      }),
    );
    if (!alreadyRead) setUnreadCount((prev) => Math.max(prev - 1, 0));
    try {
      const res = await fetch(`${apiUrl}/api/notifications/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUnreadCount(data.unreadCount);
    } catch (err) {
      console.error("Failed to update notification");
    }
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    try {
      const res = await fetch(`${apiUrl}/api/notifications/mark-all-read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUnreadCount(data.unreadCount);
    } catch (err) {
      console.error("Failed to mark all as read");
    }
  };

  useEffect(() => {
    socket.connect();
    const userId = localStorage.getItem("userId");
    socket.on("connect", () => {
      if (userId) socket.emit("join", userId);
    });
    socket.on("notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });
    return () => {
      socket.off("connect");
      socket.off("notification");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    async function getNotification() {
      try {
        const res = await fetch(`${apiUrl}/api/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setNotifications(data.data);
      } catch (err) {
        console.log(err);
      }
    }
    getNotification();
  }, []);

  useEffect(() => {
    async function notifCount() {
      try {
        const res = await fetch(`${apiUrl}/api/notifications/unread-count`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUnreadCount(data.data.unreadCount);
      } catch (error) {
        console.log(error);
      }
    }
    notifCount();
  }, []);

  const navItems = [
    { item: "Dashboard", path: "/dashboard" },
    { item: "Events", path: "/events" },
    { item: "Profile", path: "/profile" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#f5f5f7]/92 backdrop-blur-xl border-b border-black/5">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 py-2">
          <nav className="h-12 rounded-xl bg-white flex items-center gap-2 px-3 shadow-[0_6px_20px_rgba(0,0,0,0.05)]">
            <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 pr-3">
              <img src={eventosMark} alt="Eventos" className="h-8 w-8 rounded-lg" />
              <span className="text-[15px] font-semibold text-[#1d1d1f]">Eventos</span>
            </button>

            <div className="flex items-center gap-1">
              {navItems.map(({ item, path }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={item}
                    to={path}
                    className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                      isActive ? "bg-[#0071e3] text-white" : "text-[#5c5c61] hover:bg-[#f3f3f5] hover:text-[#1d1d1f]"
                    }`}
                  >
                    {item}
                  </Link>
                );
              })}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                aria-label="Notifications"
                onClick={() => setShowNotification(true)}
                className="relative w-8 h-8 rounded-full border border-black/10 bg-white text-[#4d4d52] hover:bg-[#f7f7f9]"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 mx-auto">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 1-5.714 0M18 8.25a6 6 0 1 0-12 0c0 7.372-3 8.25-3 8.25h18s-3-.878-3-8.25ZM13.73 21a2.25 2.25 0 0 1-3.46 0" />
                </svg>
                {unreadcount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full bg-[#d70015] text-white text-[9px] flex items-center justify-center px-1">
                    {unreadcount}
                  </span>
                )}
              </button>

              <button
                onClick={() => navigate("/profile")}
                className="hidden sm:flex items-center gap-2 h-8 px-2.5 rounded-full border border-black/10 bg-white hover:bg-[#f7f7f9]"
              >
                <span className="w-5 h-5 rounded-full bg-[#eef5ff] text-[#0071e3] text-[10px] flex items-center justify-center font-semibold">{initials}</span>
                <span className="text-xs text-[#424245] max-w-[120px] truncate">{name}</span>
              </button>

              <button onClick={() => setShowLogoutForm(true)} className="h-8 px-3 rounded-full bg-[#d70015] text-white text-xs font-medium">
                Log out
              </button>
            </div>
          </nav>
        </div>
      </header>

      <NotificationModal
        setShowNotification={setShowNotification}
        showNotification={showNotification}
        handleNotification={() => setShowNotification(true)}
        notifications={notifications}
        handleNotificationClick={handleNotificationClick}
        unreadCount={unreadcount}
        handleMarkAllAsRead={handleMarkAllAsRead}
      />

      {showlogoutform && <LogOut setShowLogoutForm={setShowLogoutForm} showlogoutform={showlogoutform} />}
    </>
  );
}

export default NavBar;
