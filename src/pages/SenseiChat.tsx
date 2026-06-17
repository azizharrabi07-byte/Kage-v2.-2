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
  const [convId, setConvId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<{ conversation_id: string }[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const fetchHistory = async (cid: string) => {
    try {
      const r = await apiClient.get(`/api/sensei/history?conversation_id=${cid}`);
      const msgs = (r.data ?? []).reverse().map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'sensei',
        content: m.content,
      }));
      if (msgs.length > 0) { setMessages(msgs); setConvId(cid); }
    } catch {}
  };

  const loadConversations = async () => {
    try {
      const r = await apiClient.get('/api/sensei/conversations');
      setConversations(r.data ?? []);
    } catch {}
  };

  useEffect(() => { loadConversations(); }, []);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const r = await apiClient.post('/api/sensei/chat', { message: input, conversation_id: convId });
      setMessages((prev) => [...prev, { role: 'sensei', content: r.data.reply }]);
      setConvId(r.data.conversation_id);
      loadConversations();
    } catch {
      setMessages((prev) => [...prev, { role: 'sensei', content: 'Sensei is meditating. Try again later.' }]);
    } finally { setLoading(false); }
  };

  const newChat = () => {
    setMessages([{ role: 'sensei', content: 'A fresh mind, a fresh path. What do you seek?' }]);
    setConvId(null);
  };

  return (
    <div className="p-4 max-w-lg mx-auto flex flex-col h-[calc(100vh-2rem)]">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-white text-lg font-bold font-mono">KAGE SENSEI</h1>
        <div className="flex gap-2">
          {conversations.length > 0 && (
            <select onChange={(e) => e.target.value && fetchHistory(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 text-zinc-400 text-[9px] font-mono rounded-lg px-2 py-1">
              <option value="">History</option>
              {conversations.map((c) => (
                <option key={c.conversation_id} value={c.conversation_id}>
                  {c.conversation_id.slice(0, 18)}...
                </option>
              ))}
            </select>
          )}
          <button onClick={newChat} className="text-zinc-500 text-[10px] font-mono hover:text-zinc-300 cursor-pointer">NEW</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${
              msg.role === 'user'
                ? 'bg-rose-600/20 border border-rose-500/30 text-rose-200'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-300'
            } text-xs font-mono leading-relaxed`}>
              <p className="text-[9px] font-bold uppercase tracking-wider mb-1 opacity-60">
                {msg.role === 'user' ? 'You' : 'Sensei'}
              </p>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl text-zinc-500 text-xs font-mono animate-pulse">
              Meditating...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm font-mono placeholder-zinc-600"
          placeholder="Ask Sensei..." disabled={loading} />
        <button type="submit" disabled={loading || !input.trim()}
          className="px-6 py-3 rounded-xl bg-rose-600 text-white font-mono text-xs font-bold hover:bg-rose-500 disabled:opacity-50 cursor-pointer">
          SEND
        </button>
      </form>
    </div>
  );
}
