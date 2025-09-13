// src/components/ChatWidget.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { sendChatMessage } from '../services/chatAiService';

type Role = 'user' | 'assistant';
type Msg = { role: Role; content: string };

const initialGreeting: Msg[] = [
  { role: 'assistant', content: 'Hi! Ask me anything about your expenses or the app.' },
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Msg[]>(initialGreeting);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [isOpen, messages, sending]);

  const canSend = useMemo(() => input.trim().length > 0 && !sending, [input, sending]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;

    setError('');
    setSending(true);

    // show user message locally
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');

    const controller = new AbortController();
    try {
      const { reply } = await sendChatMessage(text, controller.signal);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply ?? '(no reply)' }]);
    } catch (err: any) {
      console.error('[chat] error', err);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry—there was an error.' }]);
      setError(err?.response?.data?.error || 'Something went wrong. Please try again.');
      // (optional) restore input:
      // setInput(text);
    } finally {
      setSending(false);
    }
  };

  // close on ESC
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => ev.key === 'Escape' && setIsOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      {/* Floating button */}
      <button
        aria-label="Open chat"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-teal-500 hover:bg-teal-400 shadow-lg grid place-items-center"
      >
        <i className="bx bx-message-dots text-2xl text-white" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-40">
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsOpen(false)} />

          {/* panel */}
          <div className="absolute bottom-6 right-6 w-[min(92vw,380px)] h-[520px] bg-[#1f1f1f] text-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* header */}
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-teal-500 grid place-items-center">
                  <i className="bx bx-bot text-white" />
                </div>
                <div className="font-semibold">Assistant</div>
              </div>
              <button
                aria-label="Close chat"
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-md"
              >
                <i className="bx bx-x text-xl" />
              </button>
            </div>

            {/* messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <Bubble key={i} role={m.role} text={m.content} />
              ))}
              {sending && <TypingBubble />}
              {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
            </div>

            {/* input */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-white/10">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question…"
                  className="flex-1 bg-transparent border border-white/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) handleSubmit(e);
                  }}
                />
                <button
                  type="submit"
                  disabled={!canSend}
                  className="bg-teal-500 hover:bg-teal-400 disabled:opacity-60 rounded-md px-3 py-2 font-semibold"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function Bubble({ role, text }: { role: 'user' | 'assistant'; text: string }) {
  const isUser = role === 'user';
  const bg = isUser ? 'bg-teal-600' : 'bg-[#2a2a2a]';
  const align = isUser ? 'ml-auto' : 'mr-auto';
  return (
    <div className={`max-w-[85%] ${align} ${bg} rounded-2xl px-3 py-2 whitespace-pre-wrap`}>
      {text}
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="mr-auto bg-[#2a2a2a] rounded-2xl px-3 py-2 inline-flex items-center gap-2">
      <span className="h-2 w-2 rounded-full bg-white/70 animate-bounce [animation-delay:-0ms]" />
      <span className="h-2 w-2 rounded-full bg-white/70 animate-bounce [animation-delay:150ms]" />
      <span className="h-2 w-2 rounded-full bg-white/70 animate-bounce [animation-delay:300ms]" />
    </div>
  );
}
