"use client";

import { useState, useEffect } from "react";
import api from "@/api";

export default function Notifications({ user }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      if (res.data.success) setNotifications(res.data.notifications || []);
    } catch {}
    finally { setLoading(false); }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch {}
  };

  const markAllAsRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {}
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60) return "الآن";
    if (diff < 3600) return `${Math.floor(diff / 60)}د`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}س`;
    return `${Math.floor(diff / 86400)}ي`;
  };

  return (
    <div className="notif-wrapper">

      <button className="notif-bell-btn" onClick={() => setOpen((p) => !p)}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unreadCount > 0 && (
          <span className="notif-badge">{unreadCount}</span>
        )}
      </button>

      {open && (
        <>
          <div className="notif-overlay" onClick={() => setOpen(false)} />

          <div className="notif-dropdown">

            <div className="notif-dropdown-header">
              <span className="notif-dropdown-title">
               - الإشعارات
                {unreadCount > 0 && (
                  <span className="notif-count-badge">{unreadCount}</span>
                )}
              </span>
              {unreadCount > 0 && (
                <button className="notif-mark-all-btn" onClick={markAllAsRead}>
                  تعليم الكل كمقروء
                </button>
              )}
            </div>

            <div className="notif-list">
              {loading ? (
                <div className="notif-loading">
                  <div className="spinner-border spinner-border-sm text-secondary mb-2" />
                  <p className="mb-0">جاري التحميل...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="notif-empty">
                  <div className="notif-empty-icon">🔕</div>
                  <p className="notif-empty-text">لا توجد إشعارات</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    onClick={() => !n.isRead && markAsRead(n._id)}
                    className={`notif-item ${n.isRead ? "notif-item--read" : "notif-item--unread"}`}
                  >
                    <div className="notif-avatar">
                      {n.sender?.name?.[0] || "؟"}
                    </div>
                    <div className="notif-item-body">
                      <div className="notif-item-top">
                        <span className="notif-sender ">{n.sender?.name}</span>
                        <span className="notif-time">{timeAgo(n.createdAt)}</span>
                      </div>
                      <p className="notif-message">{n.message}</p>
                    </div>
                    {!n.isRead && <div className="notif-dot" />}
                  </div>
                ))
              )}
            </div>

          </div>
        </>
      )}
    </div>
  );
}