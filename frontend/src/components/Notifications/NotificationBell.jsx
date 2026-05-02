import React, { useEffect, useState } from 'react';
import { LuBell, LuCheckCheck, LuX } from 'react-icons/lu';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useSocketContext } from '../../context/SocketContext';
import toast from 'react-hot-toast';

export default function NotificationBell({ isDark }) {
  const { unreadCounts, latestNotification, refreshUnreadCounts } = useSocketContext() || {};
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(API_PATHS.NOTIFICATIONS.BASE);
      setNotifications(data?.data?.notifications || []);
      refreshUnreadCounts?.();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) load();
  }, [open]);

  useEffect(() => {
    if (!latestNotification) return;
    setNotifications((current) => [latestNotification, ...current]);
  }, [latestNotification]);

  const markRead = async (id) => {
    try {
      await axiosInstance.patch(API_PATHS.NOTIFICATIONS.READ(id));
      setNotifications((current) =>
        current.map((item) => (String(item._id) === String(id) ? { ...item, isRead: true } : item))
      );
      refreshUnreadCounts?.();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to update notification');
    }
  };

  const markAll = async () => {
    try {
      await axiosInstance.patch(API_PATHS.NOTIFICATIONS.READ_ALL);
      setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
      refreshUnreadCounts?.();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to clear notifications');
    }
  };

  const unread = unreadCounts?.unreadNotifications || 0;

  return (
    <div className="fixed right-6 top-6 z-[9998]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`relative grid h-12 w-12 place-items-center rounded-full border shadow-lg transition ${
          isDark ? 'border-white/10 bg-[#11131b] text-white' : 'border-slate-200 bg-white text-slate-900'
        }`}
      >
        <LuBell />
        {unread > 0 ? (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white">
            {unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className={`mt-3 w-[360px] max-w-[calc(100vw-3rem)] rounded-[28px] border p-4 shadow-[0_20px_80px_rgba(15,23,42,0.24)] ${isDark ? 'border-white/10 bg-[#11131b] text-white' : 'border-slate-200 bg-white text-slate-900'}`}>
          <div className="flex items-center justify-between gap-2">
            <div>
              <h4 className="text-base font-semibold">Notifications</h4>
              <p className={`text-xs ${isDark ? 'text-white/45' : 'text-slate-500'}`}>
                {unread} unread
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={markAll}
                className={`rounded-xl px-3 py-2 text-xs font-semibold ${
                  isDark ? 'bg-white/5 text-white' : 'bg-slate-100 text-slate-900'
                }`}
              >
                Mark all read
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={`rounded-xl p-2 ${isDark ? 'bg-white/5 text-white' : 'bg-slate-100 text-slate-900'}`}
              >
                <LuX />
              </button>
            </div>
          </div>

          <div className="mt-4 max-h-[420px] space-y-3 overflow-y-auto pr-1">
            {loading ? (
              <div className={`rounded-3xl border border-dashed p-4 text-sm ${isDark ? 'border-white/10 text-white/55' : 'border-slate-200 text-slate-500'}`}>
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div className={`rounded-3xl border border-dashed p-4 text-sm ${isDark ? 'border-white/10 text-white/55' : 'border-slate-200 text-slate-500'}`}>
                No notifications yet.
              </div>
            ) : notifications.map((notification) => (
              <button
                key={notification._id}
                type="button"
                onClick={() => markRead(notification._id)}
                className={`w-full rounded-[22px] border p-4 text-left transition ${
                  notification.isRead
                    ? isDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-slate-50'
                    : isDark ? 'border-[#d9ff34]/30 bg-[#d9ff34]/10' : 'border-slate-900/10 bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold">{notification.title}</div>
                  {!notification.isRead ? <LuCheckCheck className="opacity-70" /> : null}
                </div>
                <div className={`mt-2 text-sm ${isDark ? 'text-white/65' : 'text-slate-600'}`}>{notification.message}</div>
                <div className={`mt-2 text-xs ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
                  {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : ''}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
