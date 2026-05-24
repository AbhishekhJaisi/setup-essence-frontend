import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import NotificationModal from "./NotificationModal";
import { socket } from "../socket";
import LogOut from "./LogOut";
import eventosMark from "../assets/eventos-mark.svg";
import apiUrl from '../config/api';


const CART_KEY = "eventCart";

function NavBar() {
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showlogoutform, setShowLogoutForm] = useState(false);
  const [unreadcount, setUnreadCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

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
      const res = await fetch(`${apiUrl}/notifications/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUnreadCount(data.unreadCount);
    } catch {
      console.error("Failed to update notification");
    }
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    try {
      const res = await fetch(`${apiUrl}/notifications/mark-all-read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUnreadCount(data.unreadCount);
    } catch {
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
        const res = await fetch(`${apiUrl}/notifications`, {
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
        const res = await fetch(`${apiUrl}/notifications/unread-count`, {
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

  useEffect(() => {
    function syncCartCount() {
      try {
        const cartItems = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
        setCartCount(Array.isArray(cartItems) ? cartItems.length : 0);
      } catch {
        setCartCount(0);
      }
    }

    syncCartCount();
    window.addEventListener("storage", syncCartCount);
    window.addEventListener("event-cart-updated", syncCartCount);
    return () => {
      window.removeEventListener("storage", syncCartCount);
      window.removeEventListener("event-cart-updated", syncCartCount);
    };
  }, []);

  const navItems = [
    { item: "Dashboard", path: "/dashboard" },
    { item: "Events", path: "/events" },
    { item: "Profile", path: "/profile" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/64 backdrop-blur-xl border-b border-white/70">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 py-2">
          <nav className="min-h-12 rounded-2xl border border-white/80 bg-white/78 flex flex-wrap items-center gap-2 px-2 py-2 shadow-[0_10px_28px_rgba(31,41,55,0.07)] sm:flex-nowrap sm:px-3 sm:py-0">
            <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 pr-1 sm:pr-3">
              <img src={eventosMark} alt="Eventos" className="h-9 w-9 rounded-xl shadow-[0_8px_18px_rgba(124,58,237,0.18)]" />
              <span className="text-[15px] font-semibold text-[#2f2a3a]">Eventos</span>
            </button>

            <div className="order-3 flex w-full items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:order-none sm:w-auto">
              {navItems.map(({ item, path }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={item}
                    to={path}
                    className={`shrink-0 px-3.5 py-1.5 rounded-xl text-[13px] font-medium transition-colors ${
                      isActive ? "bg-[#f0e9ff] text-[#6d28d9] ring-1 ring-[#ddd0ff]" : "text-[#5f5868] hover:bg-[#f8f4ff] hover:text-[#3b3149]"
                    }`}
                  >
                    {item}
                  </Link>
                );
              })}
            </div>

            <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
              <button
                aria-label="Cart"
                onClick={() => navigate("/cart")}
                className={`relative w-8 h-8 rounded-xl border text-[#5f5868] hover:bg-[#f8f4ff] ${
                  location.pathname === "/cart" ? "border-[#ddd0ff] bg-[#f0e9ff] text-[#6d28d9]" : "border-[#ece7f5] bg-white/76"
                }`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 mx-auto">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h2.1l1.7 9.35a2 2 0 0 0 1.96 1.65h6.99a2 2 0 0 0 1.93-1.47l1.03-4.03H7.05" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.25 20.25h.01M17.25 20.25h.01" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full bg-[#0071e3] text-white text-[9px] flex items-center justify-center px-1">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                aria-label="Notifications"
                onClick={() => setShowNotification(true)}
                className="relative w-8 h-8 rounded-xl border border-[#ece7f5] bg-white/76 text-[#5f5868] hover:bg-[#f8f4ff]"
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
                className="hidden sm:flex items-center gap-2 h-8 px-2.5 rounded-xl border border-[#ece7f5] bg-white/76 hover:bg-[#f8f4ff]"
              >
                <span className="w-5 h-5 rounded-lg bg-[#f0e9ff] text-[#6d28d9] text-[10px] flex items-center justify-center font-semibold">{initials}</span>
                <span className="text-xs text-[#5f5868] max-w-[120px] truncate">{name}</span>
              </button>

              <button onClick={() => setShowLogoutForm(true)} className="h-8 px-2.5 rounded-xl bg-[#e11d48] text-white text-xs font-medium shadow-[0_8px_18px_rgba(225,29,72,0.16)] sm:px-3">
                <span className="sm:hidden">Exit</span>
                <span className="hidden sm:inline">Log out</span>
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
