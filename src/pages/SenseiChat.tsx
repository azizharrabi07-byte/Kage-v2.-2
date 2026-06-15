import { useState, type FormEvent, useRef, useEffect } from 'react';
import apiClient from '../services/apiClient';

interface Message {
  role: 'user' | 'sensei';
  content: string;
}

export default function SenseiChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'sensei', content: 'Welcome to the dojo, warrior. What troubles your spirit today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await apiClient.post('/api/sensei/chat', { message: input });
      setMessages((prev) => [...prev, { role: 'sensei', content: res.data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'sensei', content: 'Sensei is meditating. Try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto flex flex-col h-[calc(100vh-2rem)]">
      <h1 className="text-white text-lg font-bold font-mono mb-4">KAGE SENSEI</h1>
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-rose-600/20 border border-rose-500/30 text-rose-200'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-300'
              } text-xs font-mono leading-relaxed`}
            >
              <p className="text-[9px] font-bold uppercase tracking-wider mb-1 opacity-60">
                {msg.role === 'user' ? 'You' : 'Sensei'}
              </p>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl text-zinc-500 text-xs font-mono">
              Thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm font-mono placeholder-zinc-600 focus:outline-none focus:border-rose-500"
          placeholder="Ask Sensei..."
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-6 py-3 rounded-xl bg-rose-600 text-white font-mono text-xs font-bold hover:bg-rose-500 disabled:opacity-50 cursor-pointer"
        >
          SEND
        </button>
      </form>
    </div>
  );
}
