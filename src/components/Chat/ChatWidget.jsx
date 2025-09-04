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
        "Hi! I’m Smart Spend. Ask things like:\n• How much did I spend on rent?\n• How much did I get from salary?\nOr use the Quick Ask tabs above.",
    },
  ]);

  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  async function handleSend(forcedText) {
    const userText = (forcedText ?? text).trim();
    if (!userText) return;

    const next = [...messages, { role: 'user', content: userText }];
    setMessages(next);
    setText('');
    setLoading(true);

    try {
      const { data } = await axiosInstance.post(API_PATHS.CHAT.SEND, { messages: next }, { timeout: 20000 });
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

  function quickAsk(kind) {
    // Sends the simple triggers your backend understands:
    // 'expenses', 'incomes', 'insights' (last 30 days)
    const phrase = kind === 'expenses' ? 'expenses' : kind === 'incomes' ? 'incomes' : 'insights';
    if (!open) setOpen(true);
    handleSend(phrase);
  }

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

          {/* Quick Ask tabs now INSIDE the chatbot */}
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
              Try: “how much did I spend on rent” or “how much did I get from salary”.
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
            {loading && <div className="text-xs text-gray-500">Smart Spend is typing…</div>}
          </div>

          {/* Input */}
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
