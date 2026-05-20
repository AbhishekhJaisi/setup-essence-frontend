function NotificationModal({
  setShowNotification,
  showNotification,
  notifications = [],
  handleNotificationClick,
  unreadCount,
  handleMarkAllAsRead,
}) {
  if (!showNotification) return null;

  const TYPE_STYLES = {
    System: "text-[#248a3d] bg-[#e8f7ed] border-[#bfe7ca]",
    Event: "text-[#0071e3] bg-[#eef5ff] border-[#d8e8ff]",
    Alert: "text-[#8a5a00] bg-[#fff5e6] border-[#f4deba]",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={() => setShowNotification(false)}
    >
      <div
        className="relative w-full max-w-lg bg-white border border-black/10 rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/10">
          <div>
            <p className="text-xs tracking-[0.12em] uppercase text-[#6e6e73] mb-1">Inbox</p>
            <p className="text-2xl font-semibold text-[#1d1d1f] leading-none">Notifications</p>
            <p className="text-xs text-[#6e6e73] mt-1">
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
            </p>
          </div>
          <button
            onClick={() => setShowNotification(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-black/10 text-[#6e6e73] hover:bg-[#f5f5f7]"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="divide-y divide-black/5 max-h-[65vh] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <p className="text-sm text-[#6e6e73]">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif.id)}
                className={`flex items-start gap-3 px-5 py-3.5 cursor-pointer transition-colors hover:bg-[#f8f9fb] ${
                  !notif.isRead ? "bg-[#f3f8ff]" : ""
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-[#eef5ff] border border-[#d8e8ff] flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] text-[#0071e3] font-medium">
                    {(notif.data?.eventTitle || "U")[0].toUpperCase()}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-medium text-[#1d1d1f] truncate">
                      {notif.data?.eventTitle || "Notification"}
                    </p>
                    <span className="text-[10px] text-[#6e6e73] whitespace-nowrap flex-shrink-0">
                      {notif.time}
                    </span>
                  </div>
                  <p className="text-xs text-[#4d4d52] leading-relaxed">{notif.message}</p>
                  {notif.type && (
                    <span
                      className={`inline-block mt-1.5 text-[9px] tracking-[0.08em] uppercase px-2 py-0.5 rounded-full border font-medium ${
                        TYPE_STYLES[notif.type] ?? "text-[#6e6e73] bg-[#f5f5f7] border-[#e2e2e6]"
                      }`}
                    >
                      {notif.type}
                    </span>
                  )}
                </div>

                {!notif.isRead && <div className="w-1.5 h-1.5 rounded-full bg-[#0071e3] flex-shrink-0 mt-1.5" />}
              </div>
            ))
          )}
        </div>

        <div className="px-5 py-3 border-t border-black/10 flex justify-center">
          <button onClick={handleMarkAllAsRead} className="text-xs text-[#0071e3] hover:underline">
            Mark all as read
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotificationModal;
