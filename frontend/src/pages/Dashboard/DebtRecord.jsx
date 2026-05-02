import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LuArrowLeft } from 'react-icons/lu';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageShell from '../../components/Dashboard/PageShell';
import DebtDetailsPanel from '../../components/Debts/DebtDetailsPanel';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/UserContext';
import { useSocketContext } from '../../context/SocketContext';
import { useUserAuth } from '../../hooks/useUserAuth';
import toast from 'react-hot-toast';

export default function DebtRecordPage() {
  useUserAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const { prefs, user } = useContext(UserContext) || {};
  const userId = user?.id || user?._id || null;
  const { socket } = useSocketContext() || {};
  const isDark = prefs?.theme === 'dark';

  const [debt, setDebt] = useState(null);
  const [loading, setLoading] = useState(false);

  const patchConversationUnread = useCallback((conversationId, unreadCounts) => {
    if (!conversationId) return;

    setDebt((current) => {
      const currentConversationId = current?.chatConversationId?._id || current?.chatConversationId;
      if (!current || String(currentConversationId) !== String(conversationId)) return current;

      return {
        ...current,
        chatConversationId: {
          ...(typeof current.chatConversationId === 'object' ? current.chatConversationId : { _id: current.chatConversationId }),
          unreadCounts: unreadCounts || {},
        },
      };
    });
  }, []);

  const loadDebt = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(API_PATHS.DEBTS.DETAIL(id));
      setDebt(data?.data || null);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to load debt record');
      setDebt(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadDebt();
  }, [loadDebt]);

  useEffect(() => {
    if (!socket) return;
    const refreshCurrent = () => loadDebt();
    const updateUnreadCounts = (payload) => {
      patchConversationUnread(payload?.conversationId, payload?.unreadCounts);
    };

    socket.emit('debt:join', id);
    socket.on('debt:updated', refreshCurrent);
    socket.on('debt:update', refreshCurrent);
    socket.on('debt:reminder', refreshCurrent);
    socket.on('conversation:update', updateUnreadCounts);

    return () => {
      socket.emit('debt:leave', id);
      socket.off('debt:updated', refreshCurrent);
      socket.off('debt:update', refreshCurrent);
      socket.off('debt:reminder', refreshCurrent);
      socket.off('conversation:update', updateUnreadCounts);
    };
  }, [socket, id, loadDebt, patchConversationUnread]);

  const onUpdated = async (updatedDebt) => {
    if (updatedDebt?._id && String(updatedDebt._id) === String(id)) {
      setDebt(updatedDebt);
      return;
    }
    await loadDebt();
  };

  const clearConversationUnread = useCallback((conversationId) => {
    patchConversationUnread(conversationId, { [String(userId)]: 0 });
  }, [patchConversationUnread, userId]);

  const pageClass = isDark
    ? 'bg-[radial-gradient(circle_at_top_left,rgba(217,255,52,0.12),transparent_26%),radial-gradient(circle_at_top_right,rgba(71,215,255,0.08),transparent_22%),linear-gradient(180deg,#090b11_0%,#05070b_100%)] text-white'
    : 'bg-[radial-gradient(circle_at_top_left,rgba(217,255,52,0.14),transparent_24%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.7),transparent_20%),linear-gradient(180deg,#fefbf8_0%,#f6faee_100%)] text-[#11131b]';
  const panelClass = isDark
    ? 'border-white/10 bg-white/[0.05] text-white shadow-[0_24px_90px_rgba(0,0,0,0.35)] ring-1 ring-white/[0.08] backdrop-blur-2xl'
    : 'border-white/28 bg-white/28 text-[#11131b] shadow-[0_24px_90px_rgba(15,23,42,0.08)] ring-1 ring-white/45 backdrop-blur-3xl';

  return (
    <DashboardLayout activeMenu="/debts">
      <PageShell isDark={isDark} pageClass={pageClass}>
        <button
          type="button"
          onClick={() => navigate('/debts')}
          className={`mb-5 inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition ${
            isDark ? 'border-white/15 text-white hover:bg-white/5' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <LuArrowLeft className="text-base" />
          Back to loans
        </button>

        {loading ? (
          <div className={`rounded-[24px] border p-5 ${panelClass}`}>
            Loading record...
          </div>
        ) : debt ? (
          <DebtDetailsPanel
            debt={debt}
            onUpdated={onUpdated}
            onConversationRead={clearConversationUnread}
            isDark={isDark}
            currentUserId={userId}
          />
        ) : (
          <div className={`rounded-[24px] border p-6 ${panelClass}`}>
            Debt record not found.
          </div>
        )}
      </PageShell>
    </DashboardLayout>
  );
}
