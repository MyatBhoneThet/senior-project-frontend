import { useEffect, useRef, useState, useContext } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/UserContext';
import { useCurrency } from '../../context/CurrencyContext';
import { LuMessageCircle, LuSend, LuX } from 'react-icons/lu';
import MicButton from '../../components/Voice/MicButton';

export default function ChatWidget() {
  const { prefs } = useContext(UserContext);
  const isDark = prefs?.theme === 'dark';
  const { format } = useCurrency();

  const btnPos = 'left-6';
  const panelPos = 'left-6';
  const PANEL_WIDTH = 'w-[400px]';
  const PANEL_MAX_H = 'max-h-[80vh]';
  const Z_STACK = 'z-[9999]';

  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! I’m Smart Spend.\nExamples:\n• How much did I spend today?\n• How much did I get today?\n• How much did I get on June 2025?\n• How much did I get on 16th June 2025?\n\nUse the tabs to see quick totals.",
    },
  ]);

  const [range, setRange] = useState('30d');
  const [lastKind, setLastKind] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  const rangePretty = (k) => (k === '2m' ? 'Last 2 months' : 'Last 30 days');

  const toISODate = (d) => d.toISOString().slice(0, 10);
  function getDates(k) {
    const now = new Date();
    const endDate = toISODate(now);
    const start = new Date(now);
    if (k === '2m') {
      const day = start.getDate();
      start.setMonth(start.getMonth() - 2);
      if (start.getDate() !== day) start.setDate(1);
    } else {
      start.setDate(start.getDate() - 29);
    }
    return { startDate: toISODate(start), endDate };
  }

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
        { timeout: 60000 }
      );

      const payload = data?.reply;
      if (payload?.totals) {
        const where = payload?.range?.label ? ` (${payload.range.label})` : '';
        const { expenseTHB, incomeTHB, netTHB } = payload.totals;

        let reply;
        if (payload.intent === 'expense') {
          reply = `You spent ${format(expenseTHB)}${where}.`;
        } else if (payload.intent === 'income') {
          reply = `You received ${format(incomeTHB)}${where}.`;
        } else {
          reply = [
            `Totals${where}:`,
            `• Income:  ${format(incomeTHB)}`,
            `• Expenses: ${format(expenseTHB)}`,
            `• Net:     ${format(netTHB)}`,
          ].join('\n');
        }

        setMessages((cur) => [...cur, { role: 'assistant', content: reply }]);
      } else {
        const replyText = data?.reply?.content || 'Sorry, no reply.';
        setMessages((cur) => [...cur, { role: 'assistant', content: replyText }]);
      }
    } catch (err) {
      const status = err?.response?.status;
      let msg = 'Hmm, I hit an error talking to the server.';
      if (status === 401) msg = 'Please log in again to use chat.';
      if (status === 404) msg = 'Chat route not found on the server.';
      if (status === 500) msg = 'Server error. Check server logs.';
      setMessages((cur) => [...cur, { role: 'assistant', content: msg }]);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    handleSend();
  }

  async function fetchTotal(kind, kRange) {
    const { startDate, endDate } = getDates(kRange);
    try {
      setLoading(true);

      if (kind === 'insights') {
        const [incRes, expRes] = await Promise.all([
          axiosInstance.get(API_PATHS.TRANSACTIONS.ANALYTICS_SUM, { params: { type: 'income', startDate, endDate } }),
          axiosInstance.get(API_PATHS.TRANSACTIONS.ANALYTICS_SUM, { params: { type: 'expense', startDate, endDate } }),
        ]);

        const income = incRes?.data?.total ?? 0;
        const expense = expRes?.data?.total ?? 0;
        const net = income - expense;

        const lines = [
          `${rangePretty(kRange)} • Insights`,
          `• Incomes:  ${format(income)}`,
          `• Expenses: ${format(expense)}`,
          `• Net:      ${format(net)}`,
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
      const total = res?.data?.total ?? 0;

      const title = kind === 'expenses'
        ? `${rangePretty(kRange)} • Expenses`
        : `${rangePretty(kRange)} • Incomes`;

      const line = `${title} = ${format(total)}`;

      setMessages((cur) => [
        ...cur,
        { role: 'user', content: `${kind} — ${rangePretty(kRange)}` },
        { role: 'assistant', content: line },
      ]);
    } catch (e) {
      setMessages((cur) => [
        ...cur,
        { role: 'assistant', content: 'Unable to fetch totals. Check the analytics endpoint.' },
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

  useEffect(() => {
    if (lastKind) fetchTotal(lastKind, range);
  }, [range]);

  return (
    <>
      {/* Launcher */}
      <div className={`fixed bottom-6 ${btnPos} ${Z_STACK} flex items-center gap-2`}>
        <button
          className={`w-14 h-14 rounded-full shadow-lg grid place-items-center
            ${isDark ? 'bg-purple-600 text-gray-200' : 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'}`}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle chat"
        >
          {open ? <LuX size={26} /> : <LuMessageCircle size={28} />}
        </button>
        <div className={`px-3 py-2 rounded-full shadow-md text-sm font-medium flex items-center gap-1
            ${isDark ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900'}`}>
          <span>Chat with us</span> <span>👋</span>
        </div>
      </div>

      {/* Panel */}
      {open && (
        <div
          className={[
            'fixed bottom-24', panelPos, Z_STACK, PANEL_WIDTH, PANEL_MAX_H,
            'flex flex-col rounded-xl shadow-2xl border',
            isDark ? 'bg-gray-800 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-200'
          ].join(' ')}
        >
          {/* Header */}
          <div className={`px-4 py-2 border-b flex items-center justify-between font-semibold
            ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
            <span>Smart Spend</span>
            <button
              className={`${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              <LuX />
            </button>
          </div>

          {/* Range tabs */}
          <div className="px-3 pt-2">
            <div className="flex items-center gap-2 text-sm">
              {['30d', '2m'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-3 py-1 rounded-lg border transition-colors duration-200
                    ${range === r
                      ? isDark ? 'bg-gray-700 border-gray-500' : 'bg-gray-100 border-gray-300'
                      : isDark ? 'bg-gray-800 border-gray-600 hover:bg-gray-700' : 'bg-white hover:bg-gray-50 border-gray-200'}`}
                  aria-pressed={range === r}
                >
                  {rangePretty(r)}
                </button>
              ))}
              <div className="ml-auto text-[11px] text-gray-400 select-none">
                Range: {rangePretty(range)}
              </div>
            </div>
          </div>

          {/* Quick buttons */}
          <div className={`px-3 pt-2 border-b ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
            <div className="flex items-center gap-2 text-sm flex-wrap">
              {['expenses', 'incomes', 'insights'].map((kind) => (
                <button
                  key={kind}
                  onClick={() => quickAsk(kind)}
                  className={`px-3 py-1 rounded-lg border transition-colors duration-200
                    ${isDark ? 'bg-gray-800 border-gray-600 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                >
                  {kind.charAt(0).toUpperCase() + kind.slice(1)}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 my-1">Click a tab to show totals for the selected range.</p>
          </div>

          {/* Messages */}
          <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm">
            {messages.map((m, i) => {
              const isAssistant = m.role === 'assistant';
              return (
                <div key={i} className={isAssistant ? 'text-left' : 'text-right'}>
                  {isAssistant ? (
                    <div className={[
                      'inline-block max-w-[92%] rounded-lg px-3 py-2 whitespace-pre-wrap border',
                      isDark ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-slate-50 border-gray-200 text-gray-800'
                    ].join(' ')}>
                      {m.content}
                    </div>
                  ) : (
                    <div className="inline-block max-w-[92%] bg-primary text-white rounded-lg px-3 py-2 whitespace-pre-wrap">
                      {m.content}
                    </div>
                  )}
                </div>
              );
            })}
            {loading && <div className="text-xs text-gray-400">Working…</div>}
          </div>

          {/* Input Area */}
          <form
            onSubmit={onSubmit}
            className={`p-2 border-t flex items-center gap-1 ${isDark ? 'border-gray-600' : 'border-gray-200'}`}
          >
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder='Ask: "How much did I spend today?"'
              className={[
                'flex-1 rounded-lg px-3 py-2 border focus:outline-none focus:ring text-sm',
                isDark
                  ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400',
              ].join(' ')}
            />

            <MicButton
              lang="en-US"
              onFinal={(speech) => {
                setText(speech);
                setTimeout(() => handleSend(), 0);
              }}
              className={isDark ? 'border-gray-600 text-gray-200' : 'border-gray-300 text-gray-700'}
            />

            <button
              type="submit"
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
