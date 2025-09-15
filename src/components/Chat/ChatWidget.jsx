import React, { useEffect, useRef, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuMessageCircle, LuSend, LuX } from 'react-icons/lu';

export default function ChatWidget() {
  // Left-only placement
  const btnPos = 'left-6';
  const panelPos = 'left-6';

  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! I’m Smart Spend. Ask things like:\n• How much did I spend on rent?\n• How much did I get from salary?\nOr use the tabs above to see totals.",
    },
  ]);

  // Range + last clicked tab
  const [range, setRange] = useState('30d'); // '30d' | '2m'
  const [lastKind, setLastKind] = useState(null); // 'expenses' | 'incomes' | 'insights' | null

  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  // ---- Helpers --------------------------------------------------------------
  const rangePretty = (k) => (k === '2m' ? 'Last 2 months' : 'Last 30 days');

  function formatTHB(n) {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      maximumFractionDigits: 2,
    }).format(Number(n || 0));
  }

  const toISODate = (d) => d.toISOString().slice(0, 10);

  function getDates(k) {
    const now = new Date();
    const endDate = toISODate(now);

    const start = new Date(now);
    if (k === '2m') {
      const day = start.getDate();
      start.setMonth(start.getMonth() - 2);
      if (start.getDate() !== day) start.setDate(1); // handle short months
    } else {
      start.setDate(start.getDate() - 29); // last 30 days inclusive
    }
    return { startDate: toISODate(start), endDate };
  }

  // ---- Chat route for free-text --------------------------------------------
  async function handleSend(forcedText) {
    const userText = (forcedText ?? text).trim();
    if (!userText) return;

    const next = [...messages, { role: 'user', content: userText }];
    setMessages(next);
    setText('');
    setLoading(true);

    try {
      const { data } = await axiosInstance.post(
        API_PATHS.CHAT.SEND,
        { messages: next },
        { timeout: 20000 }
      );
      const reply = data?.reply?.content || 'Sorry, no reply.';
      setMessages((cur) => [...cur, { role: 'assistant', content: reply }]);
    } catch (err) {
      const status = err?.response?.status;
      let msg = 'Hmm, I hit an error talking to the server.';
      if (status === 401) msg = 'Please log in again to use chat.';
      if (status === 404) msg = 'Chat route not found on the server.';
      if (status === 500) msg = 'Server error. Check server logs for details.';
      setMessages((cur) => [...cur, { role: 'assistant', content: msg }]);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    handleSend();
  }

  // ---- NEW: direct totals for tabs (uses ?type=income|expense) -------------
  async function fetchTotal(kind, kRange) {
    const { startDate, endDate } = getDates(kRange);

    try {
      setLoading(true);

      if (kind === 'insights') {
        // call twice and compute net
        const [incRes, expRes] = await Promise.all([
          axiosInstance.get(API_PATHS.TRANSACTIONS.ANALYTICS_SUM, {
            params: { type: 'income', startDate, endDate },
          }),
          axiosInstance.get(API_PATHS.TRANSACTIONS.ANALYTICS_SUM, {
            params: { type: 'expense', startDate, endDate },
          }),
        ]);

        const income = incRes?.data?.total ?? incRes?.data?.sum ?? incRes?.data?.amount ?? 0;
        const expense = expRes?.data?.total ?? expRes?.data?.sum ?? expRes?.data?.amount ?? 0;
        const net = income - expense;

        const lines = [
          `${rangePretty(kRange)} • Insights`,
          `• Incomes:  ${formatTHB(income)}`,
          `• Expenses: ${formatTHB(expense)}`,
          `• Net:      ${formatTHB(net)}`,
        ].join('\n');

        setMessages((cur) => [
          ...cur,
          { role: 'user', content: `${kind} — ${rangePretty(kRange)}` },
          { role: 'assistant', content: lines },
        ]);
        return;
      }

      const typeParam = kind === 'expenses' ? 'expense' : 'income';
      const res = await axiosInstance.get(API_PATHS.TRANSACTIONS.ANALYTICS_SUM, {
        params: { type: typeParam, startDate, endDate },
      });
      const total = res?.data?.total ?? res?.data?.sum ?? res?.data?.amount ?? 0;

      const title =
        kind === 'expenses'
          ? `${rangePretty(kRange)} • Expenses`
          : `${rangePretty(kRange)} • Incomes`;

      const line = `${title} = ${formatTHB(total)}`;

      setMessages((cur) => [
        ...cur,
        { role: 'user', content: `${kind} — ${rangePretty(kRange)}` },
        { role: 'assistant', content: line },
      ]);
    } catch (e) {
      // Show a friendly error and stop spamming the raw backend text.
      setMessages((cur) => [
        ...cur,
        {
          role: 'assistant',
          content:
            'Unable to fetch totals. Make sure your endpoint /transactions/analytics/sum accepts ?type=income|expense and ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function quickAsk(kind) {
    setLastKind(kind);
    if (!open) setOpen(true);
    fetchTotal(kind, range);
  }

  // If user flips the range and a tab was selected before, refetch automatically
  useEffect(() => {
    if (lastKind) fetchTotal(lastKind, range);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  return (
    <>
      {/* Floating toggle button (LEFT ONLY) */}
      <button
        className={`fixed bottom-6 ${btnPos} z-40 w-12 h-12 rounded-full shadow-lg bg-primary text-white grid place-items-center`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle chat"
      >
        {open ? <LuX /> : <LuMessageCircle />}
      </button>

      {/* Panel (LEFT ONLY) */}
      {open && (
        <div
          className={`fixed bottom-24 ${panelPos} z-40 w-[340px] max-h-[70vh] bg-white border rounded-xl shadow-xl flex flex-col`}
        >
          {/* Header */}
          <div className="px-4 py-2 border-b font-semibold flex items-center justify-between">
            <span>Smart Spend</span>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              <LuX />
            </button>
          </div>

          {/* Range selector */}
          <div className="px-3 pt-2">
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => setRange('30d')}
                className={`px-3 py-1 rounded-lg border ${
                  range === '30d' ? 'bg-black/5' : 'bg-white hover:bg-gray-50'
                }`}
                aria-pressed={range === '30d'}
              >
                Last 30 days
              </button>
              <button
                onClick={() => setRange('2m')}
                className={`px-3 py-1 rounded-lg border ${
                  range === '2m' ? 'bg-black/5' : 'bg-white hover:bg-gray-50'
                }`}
                aria-pressed={range === '2m'}
              >
                Last 2 months
              </button>

              <div className="ml-auto text-[11px] text-gray-500 select-none">
                Range: {rangePretty(range)}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-3 pt-2 border-b">
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => quickAsk('expenses')}
                className="px-3 py-1 rounded-lg border bg-white hover:bg-gray-50"
              >
                Expenses
              </button>
              <button
                onClick={() => quickAsk('incomes')}
                className="px-3 py-1 rounded-lg border bg-white hover:bg-gray-50"
              >
                Incomes
              </button>
              <button
                onClick={() => quickAsk('insights')}
                className="px-3 py-1 rounded-lg border bg-white hover:bg-gray-50"
              >
                Insights
              </button>
            </div>
            <p className="text-[11px] text-gray-500 my-1">
              Click a tab to show totals for the selected range.
            </p>
          </div>

          {/* Messages */}
          <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'assistant' ? 'text-slate-800' : 'text-right'}>
                {m.role === 'assistant' ? (
                  <div className="inline-block max-w-[92%] bg-slate-50 border rounded-lg px-3 py-2 whitespace-pre-wrap">
                    {m.content}
                  </div>
                ) : (
                  <div className="inline-block max-w-[92%] bg-primary text-white rounded-lg px-3 py-2 whitespace-pre-wrap">
                    {m.content}
                  </div>
                )}
              </div>
            ))}
            {loading && <div className="text-xs text-gray-500">Working…</div>}
          </div>

          {/* Input -> still uses your chat route */}
          <form onSubmit={onSubmit} className="p-3 border-t flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a question…"
              className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring"
            />
            <button
              disabled={loading || !text.trim()}
              className="w-10 h-10 rounded-lg bg-primary text-white disabled:opacity-50 grid place-items-center"
              aria-label="Send"
            >
              <LuSend />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
