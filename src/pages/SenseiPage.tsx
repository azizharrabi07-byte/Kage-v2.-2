import { useState, type FormEvent, useRef, useEffect } from 'react';
import { post } from '../services/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function SenseiPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Welcome to the dojo, warrior. What troubles your spirit?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const r = await post('/api/sensei/chat', { message: input });
      setMessages((prev) => [...prev, { role: 'assistant', content: r.reply || 'Sensei nods wisely.' }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sensei is meditating. Try again.' }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="p-4 max-w-lg mx-auto flex flex-col h-[calc(100vh-2rem)] pb-20">
      <h1 className="text-white text-lg font-bold font-mono mb-4">SENSEI</h1>
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${
              msg.role === 'user' ? 'bg-[#e94560]/20 border border-[#e94560]/30 text-rose-200' : 'bg-[#1a1a2e] border border-zinc-800 text-zinc-300'
            } text-xs font-mono leading-relaxed`}>
              <p className="text-[9px] font-bold uppercase tracking-wider mb-1 opacity-60">{msg.role === 'user' ? 'You' : 'Sensei'}</p>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <div className="flex justify-start"><div className="bg-[#1a1a2e] border border-zinc-800 p-3 rounded-2xl text-zinc-500 text-xs font-mono animate-pulse">Thinking...</div></div>}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSend} className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-[#1a1a2e] border border-zinc-800 text-white text-sm font-mono placeholder-zinc-600" placeholder="Ask Sensei..." disabled={loading} />
        <button type="submit" disabled={loading || !input.trim()}
          className="px-6 py-3 rounded-xl bg-[#e94560] text-white font-mono text-xs font-bold hover:opacity-90 disabled:opacity-50 cursor-pointer">SEND</button>
      </form>
    </div>
  );
}
