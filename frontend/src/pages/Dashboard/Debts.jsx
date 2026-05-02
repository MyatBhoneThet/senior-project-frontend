import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { LuPlus, LuBadgeDollarSign, LuClock3, LuHandCoins, LuWalletCards } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageShell from '../../components/Dashboard/PageShell';
import Modal from '../../components/layout/Modal';
import DebtForm from '../../components/Debts/DebtForm';
import DebtList from '../../components/Debts/DebtList';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/UserContext';
import { useSocketContext } from '../../context/SocketContext';
import toast from 'react-hot-toast';
import { useUserAuth } from '../../hooks/useUserAuth';

export default function DebtsPage() {
  useUserAuth();
  const { prefs, user } = useContext(UserContext) || {};
  const userId = user?.id || user?._id || null;
  const isDark = prefs?.theme === 'dark';
  const { socket } = useSocketContext() || {};
  const navigate = useNavigate();

  const [debts, setDebts] = useState([]);
  const [filters, setFilters] = useState({ view: 'all' });
  const [loading, setLoading] = useState(false);
  const [openAddDebtModal, setOpenAddDebtModal] = useState(false);

  const loadDebts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.view === 'lend') params.role = 'lender';
      if (filters.view === 'borrow') params.role = 'borrower';
      if (['pending', 'partially_paid', 'paid', 'overdue', 'cancelled'].includes(filters.view)) {
        params.status = filters.view;
      }
      const { data } = await axiosInstance.get(API_PATHS.DEBTS.BASE, { params });
      const rows = (data?.data || []).map((debt) => ({
        ...debt,
        role: String(debt.lenderId?._id || debt.lenderId) === String(userId) ? 'lend' : 'borrow',
      }));
      setDebts(rows);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to load debt records');
    } finally {
      setLoading(false);
    }
  }, [filters.view, userId]);

  useEffect(() => {
    loadDebts();
  }, [loadDebts]);

  const patchConversationUnread = useCallback((conversationId, unreadCounts) => {
    if (!conversationId) return;

    setDebts((current) => current.map((debt) => {
      const currentConversationId = debt?.chatConversationId?._id || debt?.chatConversationId;
      if (String(currentConversationId) !== String(conversationId)) return debt;

      return {
        ...debt,
        chatConversationId: {
          ...(typeof debt.chatConversationId === 'object' ? debt.chatConversationId : { _id: debt.chatConversationId }),
          unreadCounts: unreadCounts || {},
        },
      };
    }));
  }, []);

  useEffect(() => {
    if (!socket) return;

    const refreshCurrent = () => loadDebts();
    const updateUnreadCounts = (payload) => {
      patchConversationUnread(payload?.conversationId, payload?.unreadCounts);
    };
    const refreshForDebtNotification = (notification) => {
      if (notification?.type !== 'chat_message') refreshCurrent();
    };

    socket.on('debt:updated', refreshCurrent);
    socket.on('debt:update', refreshCurrent);
    socket.on('debt:reminder', refreshCurrent);
    socket.on('notification:new', refreshForDebtNotification);
    socket.on('conversation:update', updateUnreadCounts);

    return () => {
      socket.off('debt:updated', refreshCurrent);
      socket.off('debt:update', refreshCurrent);
      socket.off('debt:reminder', refreshCurrent);
      socket.off('notification:new', refreshForDebtNotification);
      socket.off('conversation:update', updateUnreadCounts);
    };
  }, [socket, loadDebts, patchConversationUnread]);

  const overview = useMemo(() => {
    const lent = debts.filter((item) => String(item.lenderId?._id || item.lenderId) === String(userId));
    const borrowed = debts.filter((item) => String(item.borrowerId?._id || item.borrowerId) === String(userId));
    return {
      lentCount: lent.length,
      borrowedCount: borrowed.length,
      outstanding: debts.reduce((sum, debt) => sum + Number(debt.remainingAmount || 0), 0),
      overdue: debts.filter((debt) => debt.status === 'overdue').length,
    };
  }, [debts, userId]);

  const onCreated = async (createdDebt) => {
    setOpenAddDebtModal(false);
    await loadDebts();
    if (createdDebt?._id) {
      navigate(`/debts/record/${createdDebt._id}`);
    }
  };

  const pageClass = isDark
    ? 'bg-[radial-gradient(circle_at_top_left,rgba(217,255,52,0.12),transparent_26%),radial-gradient(circle_at_top_right,rgba(71,215,255,0.08),transparent_22%),linear-gradient(180deg,#090b11_0%,#05070b_100%)] text-white'
    : 'bg-[radial-gradient(circle_at_top_left,rgba(217,255,52,0.14),transparent_24%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.7),transparent_20%),linear-gradient(180deg,#fefbf8_0%,#f6faee_100%)] text-[#11131b]';
  const panelClass = isDark
    ? 'border-white/10 bg-white/[0.04] text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)]'
    : 'border-white/20 bg-white/55 text-[#11131b] shadow-[0_24px_80px_rgba(15,23,42,0.08)]';
  const statClass = isDark
    ? 'border-white/10 bg-white/[0.05] text-white shadow-[0_24px_90px_rgba(0,0,0,0.35)] ring-1 ring-white/[0.08] backdrop-blur-2xl'
    : 'border-white/28 bg-white/28 text-[#11131b] shadow-[0_24px_90px_rgba(15,23,42,0.08)] ring-1 ring-white/45 backdrop-blur-3xl';
  const statCards = [
    { label: 'Lent', value: overview.lentCount, icon: LuHandCoins, accent: isDark ? 'text-[#d9ff34]' : 'text-[#84cc16]' },
    { label: 'Borrowed', value: overview.borrowedCount, icon: LuWalletCards, accent: 'text-[#8b5cf6]' },
    { label: 'Outstanding', value: overview.outstanding.toLocaleString(), icon: LuBadgeDollarSign, accent: 'text-[#38bdf8]' },
    { label: 'Overdue', value: overview.overdue, icon: LuClock3, accent: 'text-[#fb7185]' },
  ];

  const page = (
    <PageShell isDark={isDark} pageClass={pageClass}>
      <div className={`mb-4 flex flex-col gap-4 rounded-[28px] border px-5 py-5 backdrop-blur-2xl md:flex-row md:items-center md:justify-between md:px-6 md:py-6 ${panelClass}`}>
        <div>
          <div className="flex items-center gap-3">
            <h1
              className={`text-3xl font-bold tracking-[0.2em] ${isDark ? 'text-white' : 'text-[#11131b]'}`}
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              LOANS
            </h1>
            <div className={`flex items-center gap-2 text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-[#5f6477]'}`}>
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#a3e635] opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#84cc16]" />
              </span>
              <span>Live debt records</span>
            </div>
          </div>
          <p className={`mt-1 text-sm font-medium ${isDark ? 'text-gray-500' : 'text-[#6c7086]'}`}>
            Track repayments, reminders, and conversations.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpenAddDebtModal(true)}
          className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition-all ${
            isDark
              ? 'border border-[#d9ff34]/20 bg-[#d9ff34] text-black hover:-translate-y-0.5 hover:bg-[#cde939]'
              : 'border border-slate-900/10 bg-slate-900 text-white hover:-translate-y-0.5 hover:bg-slate-800'
          }`}
        >
          <LuPlus className="text-base" />
          Add debt record
        </button>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
          <div key={card.label} className={`relative overflow-hidden rounded-[24px] border p-5 ${statClass}`}>
            <div className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full blur-3xl ${card.accent.includes('rose') ? 'bg-[#fb7185]/15' : 'bg-[#d9ff34]/12'}`} />
            <div className="relative flex items-start justify-between gap-3">
              <div>
                <div className={`text-[11px] font-medium tracking-[0.12em] ${isDark ? 'text-[#7b8095]' : 'text-[#6b7080]'}`}>{card.label}</div>
                <div className="mt-3 text-2xl font-bold leading-none">{card.value}</div>
              </div>
              <div className={`grid h-11 w-11 place-items-center rounded-2xl ${isDark ? 'bg-white/[0.04]' : 'bg-[rgba(17,19,27,0.04)]'}`}>
                <Icon className={`text-xl ${card.accent}`} />
              </div>
            </div>
          </div>
        )})}
      </div>

      <div className="min-w-0 space-y-6">
        <DebtList
          debts={debts}
          selectedId={null}
          onSelect={(debt) => navigate(`/debts/record/${debt._id}`)}
          filters={filters}
          onFilterChange={(view) => setFilters({ view })}
          isDark={isDark}
          currentUserId={userId}
        />
        {loading ? (
          <div className={`rounded-[24px] border p-5 ${statClass}`}>
            Loading records...
          </div>
        ) : null}
      </div>

      <Modal
        isOpen={openAddDebtModal}
        onClose={() => setOpenAddDebtModal(false)}
        title="Add Debt Record"
        accent="neutral"
      >
        <DebtForm onCreated={onCreated} isDark={isDark} />
      </Modal>
    </PageShell>
  );

  return <DashboardLayout activeMenu="/debts">{page}</DashboardLayout>;
}
