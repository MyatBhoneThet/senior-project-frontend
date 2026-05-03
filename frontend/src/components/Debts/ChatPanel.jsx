import React, { useContext, useEffect, useRef, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useSocketContext } from '../../context/SocketContext';
import { UserContext } from '../../context/UserContext';
import toast from 'react-hot-toast';
import { LuBellRing, LuSend, LuX } from 'react-icons/lu';
import { ListSkeleton, SkeletonBlock } from '../Dashboard/DashboardSkeleton';

function formatRelativeTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.max(0, Math.floor(diffMs / 1000));

  if (diffSec < 10) return 'just now';
  if (diffSec < 60) return `${diffSec}s ago`;

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay}d ago`;

  return date.toLocaleString();
}

export default function ChatPanel({
  debt,
  isDark,
  open = false,
  onClose = null,
  title = 'Chat',
  onUpdated = null,
  onConversationRead = null,
}) {
  const { socket } = useSocketContext() || {};
  const { user } = useContext(UserContext) || {};
  const userId = user?.id || user?._id || null;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sendingReminder, setSendingReminder] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, setClockTick] = useState(0);
  const listRef = useRef(null);

  const conversationId = debt?.chatConversationId?._id || debt?.chatConversationId || null;

  useEffect(() => {
    if (!open || !debt?._id) return;

    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(API_PATHS.DEBTS.MESSAGES(debt._id));
        if (active) {
          setMessages(data?.data?.messages || []);
          onConversationRead?.(data?.data?.conversation?._id || conversationId);
        }
      } catch (error) {
        if (active) {
          toast.error(error?.response?.data?.message || 'Unable to load chat');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    if (conversationId && socket) {
      socket.emit('conversation:join', conversationId);
    }

    const handleMessage = (message) => {
      if (!message || String(message.debtId) !== String(debt._id)) return;
      setMessages((current) =>
        current.some((item) => String(item._id) === String(message._id))
          ? current
          : [...current, message]
      );
    };

    socket?.on('chat:message', handleMessage);

    return () => {
      active = false;
      socket?.off('chat:message', handleMessage);
      if (conversationId && socket) socket.emit('conversation:leave', conversationId);
    };
  }, [open, debt?._id, conversationId, socket, onConversationRead]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [open, messages]);

  useEffect(() => {
    if (!open) return undefined;

    const onEsc = (event) => {
      if (event.key === 'Escape') onClose?.();
    };

    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return undefined;

    const intervalId = window.setInterval(() => {
      setClockTick((current) => current + 1);
    }, 30000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [open]);

  const send = async (event) => {
    event.preventDefault();
    const message = text.trim();
    if (!message) return;

    try {
      const { data } = await axiosInstance.post(API_PATHS.DEBTS.MESSAGES(debt._id), { message });
      const sent = data?.data?.message || null;
      if (sent) {
        setMessages((current) =>
          current.some((item) => String(item._id) === String(sent._id))
            ? current
            : [...current, sent]
        );
        setText('');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to send message');
    }
  };

  const sendReminder = async () => {
    const message = `You owe ${debt?.currency || 'THB'} ${Number(debt?.remainingAmount || 0).toLocaleString()}`;

    setSendingReminder(true);
    try {
      const { data } = await axiosInstance.post(API_PATHS.DEBTS.REMINDERS(debt._id), {
        message,
        type: 'manual',
      });
      toast.success(data?.message || 'Reminder sent');
      onUpdated?.(data?.data?.debt || null);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to send reminder');
    } finally {
      setSendingReminder(false);
    }
  };

  const bubbleClass = (mine) => mine
    ? (isDark ? 'bg-[#d9ff34] text-black' : 'bg-slate-900 text-white')
    : (isDark ? 'border border-white/10 bg-white/[0.05] text-white' : 'border border-white/60 bg-white/80 text-[#11131b] shadow-sm');

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1300] flex items-end justify-center bg-slate-950/55 p-3 backdrop-blur-sm motion-safe:animate-[fade-in-up_0.2s_ease-out] sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-2xl overflow-hidden rounded-[28px] border p-5 shadow-[0_28px_90px_rgba(0,0,0,0.35)] motion-safe:animate-[scale-in_0.24s_cubic-bezier(0.16,1,0.3,1)] ${
          isDark
            ? 'border-white/10 bg-white/[0.05] text-white ring-1 ring-white/[0.08] backdrop-blur-2xl'
            : 'border-white/35 bg-white/72 text-[#11131b] ring-1 ring-white/55 backdrop-blur-3xl backdrop-saturate-150'
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className={`pointer-events-none absolute inset-0 ${
            isDark
              ? 'bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_34%,rgba(217,255,52,0.08)_70%,transparent)]'
              : 'bg-[linear-gradient(135deg,rgba(255,255,255,0.58),transparent_36%,rgba(132,204,22,0.1)_72%,transparent)]'
          }`}
        />
        <div className="flex items-center justify-between gap-3">
          <div className="relative">
            <div className={`text-[11px] font-bold uppercase tracking-[0.2em] ${isDark ? 'text-[#7b8095]' : 'text-[#6b7080]'}`}>
              Conversation
            </div>
            <h4 className="mt-1 text-lg font-semibold">{title}</h4>
            {loading ? (
              <SkeletonBlock isDark={isDark} className="mt-2 h-3 w-28 rounded" />
            ) : (
              <span className={`mt-0.5 block text-xs ${isDark ? 'text-white/45' : 'text-slate-500'}`}>
                Live conversation
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cancel"
            title="Cancel"
            className={`relative grid h-10 w-10 place-items-center rounded-xl border transition ${
              isDark
                ? 'border-white/15 bg-white/[0.02] text-white/80 hover:bg-white/10'
                : 'border-slate-200 bg-white/70 text-slate-700 hover:bg-white'
            }`}
          >
            <LuX className="text-[18px]" />
          </button>
        </div>

        <div
          ref={listRef}
          className={`relative mt-4 max-h-[48vh] min-h-[280px] space-y-3 overflow-y-auto rounded-[22px] border p-3 pr-2 ${
            isDark ? 'border-white/10 bg-black/10' : 'border-white/50 bg-white/45'
          }`}
        >
          {loading ? (
            <ListSkeleton rows={4} isDark={isDark} />
          ) : messages.length === 0 ? (
            <div className={`rounded-3xl border border-dashed p-4 text-sm ${isDark ? 'border-white/10 text-white/55' : 'border-slate-200 text-slate-500'}`}>
              No messages yet.
            </div>
          ) : messages.map((message) => {
            const mine = String(message.senderId) === String(userId);
            return (
              <div key={message._id} className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${mine ? 'ml-auto' : ''} ${bubbleClass(mine)}`}>
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className={`mt-1 text-[11px] ${mine ? 'opacity-70' : isDark ? 'text-white/45' : 'text-slate-500'}`}>
                  {formatRelativeTime(message.createdAt)}
                </div>
              </div>
            );
          })}
        </div>

        <form onSubmit={send} className="relative mt-4 flex gap-2">
          <input
            className={`min-w-0 flex-1 rounded-2xl border px-4 py-3 outline-none ${
              isDark
                ? 'border-white/10 bg-white/[0.03] text-white placeholder:text-white/35 focus:border-[#d9ff34]/30'
                : 'border-white/55 bg-white/80 text-[#11131b] placeholder:text-[#9aa2b8] focus:border-[#84cc16]/45'
            }`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a message..."
          />
          <button
            type="submit"
            aria-label="Send message"
            title="Send message"
            className={`grid h-11 w-11 place-items-center rounded-2xl ${
              isDark ? 'bg-[#d9ff34] text-black hover:bg-[#cbe93a]' : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <LuSend className="-rotate-12 text-[18px]" />
          </button>
          <button
            type="button"
            onClick={sendReminder}
            disabled={sendingReminder}
            aria-label="Send reminder"
            title="Send reminder"
            className={`grid h-11 w-11 place-items-center rounded-2xl border ${
              isDark
                ? 'border-[#d9ff34]/40 bg-[#d9ff34]/10 text-[#f1ffb8] hover:bg-[#d9ff34]/20 disabled:opacity-50'
                : 'border-slate-900/20 bg-slate-100 text-slate-900 hover:bg-slate-200 disabled:opacity-50'
            }`}
          >
            {sendingReminder ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <LuBellRing className="text-[18px]" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
