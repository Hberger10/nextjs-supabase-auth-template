'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Plus, Send, TrendingUp, BarChart2, Clock, ChevronRight, 
  Loader2, Sparkles, PanelLeftClose, PanelLeftOpen, 
  CircleDollarSign, LineChart, AlertCircle,
} from 'lucide-react';

type Role = 'user' | 'assistant';

interface Message {
  id: string;
  role: Role;
  content: string;
}

interface HistoryItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  date: string;
}

const HISTORY: HistoryItem[] = [
  { id: '1', label: 'Análise PETR4 — Maio 2025', icon: <TrendingUp size={14} />, date: 'hoje' },
  { id: '2', label: 'Carteira diversificada renda fixa', icon: <BarChart2 size={14} />, date: 'ontem' },
  { id: '3', label: 'Comparativo FIIs vs CRI/CRA', icon: <LineChart size={14} />, date: '3d' },
  { id: '4', label: 'Risco x Retorno — small caps', icon: <AlertCircle size={14} />, date: '5d' },
  { id: '5', label: 'Projeção dividendos BBSE3', icon: <CircleDollarSign size={14} />, date: '1sem' },
];

const STUB_MESSAGES: Message[] = [
  {
    id: '0',
    role: 'assistant',
    content: 'Olá! Sou seu Analista de IA especializado em investimentos. Posso analisar ativos, carteiras, projetar dividendos e avaliar riscos. Como posso ajudá-lo hoje?',
  },
];

function AssistantAvatar() {
  return (
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
      <Sparkles size={14} className="text-blue-400" />
    </div>
  );
}

function UserBubble({ content }: { content: string }) {
  return (
    <div className="flex justify-end gap-3 group">
      <div className="max-w-[75%]">
        <div className="bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-tr-sm text-sm leading-relaxed tracking-wide shadow-lg shadow-blue-900/30 group-hover:bg-blue-500 transition-colors duration-200">
          {content}
        </div>
        <p className="text-[11px] text-slate-600 mt-1.5 text-right pr-1">você</p>
      </div>
    </div>
  );
}

function AssistantBubble({ content }: { content: string }) {
  return (
    <div className="flex justify-start gap-3 group">
      <AssistantAvatar />
      <div className="max-w-[75%]">
        <div 
          className="bg-slate-800/70 border border-slate-700/50 text-slate-200 px-4 py-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed tracking-wide shadow-lg shadow-black/20 group-hover:border-slate-600/60 transition-colors duration-200"
          style={{ fontFamily: "'Georgia', 'Cambria', serif" }}
        >
          {content}
        </div>
        <p className="text-[11px] text-slate-600 mt-1.5 pl-1">Analista IA</p>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start gap-3">
      <AssistantAvatar />
      <div className="bg-slate-800/70 border border-slate-700/50 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function ChatDashboard() {
  const [messages, setMessages] = useState<Message[]>(STUB_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeHistory, setActiveHistory] = useState<string | null>('1');
  
  // Fix Hydration: Data manipulada apenas no Client
  const [dateStr, setDateStr] = useState<string>('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDateStr(new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [input]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 1800));
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: 'Analisando os dados disponíveis... Esta é uma resposta simulada. Integre o `useChat` do Vercel AI SDK para substituir esta lógica pelo streaming real.',
    };
    setMessages((prev) => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleNewAnalysis = () => {
    setMessages(STUB_MESSAGES);
    setInput('');
    setActiveHistory(null);
  };

  return (
    <div className="flex h-screen text-slate-100 overflow-hidden font-sans antialiased" style={{ background: '#0a0a0b' }}>
      <aside className={`flex-shrink-0 flex flex-col border-r border-slate-800/80 transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`} style={{ background: '#111113' }}>
        <div className="px-5 pt-5 pb-4 border-b border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/50">
              <TrendingUp size={14} className="text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-slate-100">
              Analist <span className="text-blue-400">Invest</span>
            </span>
          </div>
        </div>

        <div className="px-3 pt-4 pb-3">
          <button onClick={handleNewAnalysis} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-medium transition-all duration-150 shadow-md shadow-blue-900/40 group">
            <Plus size={15} className="group-hover:rotate-90 transition-transform duration-200" />
            Nova Análise
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700">
          <p className="px-2 pt-2 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Recentes</p>
          {HISTORY.map((item) => (
            <button key={item.id} onClick={() => setActiveHistory(item.id)} className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left group transition-all duration-150 ${activeHistory === item.id ? 'bg-blue-600/15 text-blue-300 border border-blue-600/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'}`}>
              <span className={`flex-shrink-0 ${activeHistory === item.id ? 'text-blue-400' : 'text-slate-500'}`}>{item.icon}</span>
              <span className="flex-1 truncate text-xs">{item.label}</span>
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className="text-[10px] text-slate-600">{item.date}</span>
                <ChevronRight size={11} className={`text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity`} />
              </div>
            </button>
          ))}
        </div>

        <div className="px-4 py-3 border-t border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-300 truncate">Henrique Berger</p>
              <p className="text-[10px] text-slate-500 truncate">Plano Pro</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-slate-800/40 backdrop-blur-sm" style={{ background: 'rgba(10,10,11,0.90)' }}>
          <button onClick={() => setSidebarOpen((v) => !v)} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all duration-150">
            {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-1.5 text-blue-400">
              <Sparkles size={13} />
              <span className="text-xs font-semibold text-slate-300 truncate">Analista de Investimentos IA</span>
            </div>
            <span className="hidden sm:flex items-center gap-1 text-[10px] text-slate-500 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              online
            </span>
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            <Clock size={12} className="text-slate-600" />
            <span className="text-[11px] text-slate-600 hidden sm:block">
              {dateStr}
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5" style={{ background: '#0a0a0b' }}>
          {messages.map((msg) =>
            msg.role === 'user' ? <UserBubble key={msg.id} content={msg.content} /> : <AssistantBubble key={msg.id} content={msg.content} />
          )}
          {isLoading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        <footer className="flex-shrink-0 border-t border-slate-800/40 backdrop-blur-sm px-4 py-3" style={{ background: 'rgba(17,17,19,0.95)' }}>
          <form onSubmit={handleSubmit} className="flex items-end gap-3 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef} value={input} onChange={handleInputChange} onKeyDown={handleKeyDown}
                placeholder="Faça uma pergunta sobre investimentos..." disabled={isLoading} rows={1}
                className="w-full resize-none bg-slate-800/60 border border-slate-700/60 text-slate-100 placeholder-slate-500 text-sm leading-relaxed tracking-wide rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:border-blue-600/60 focus:bg-slate-800/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700"
                style={{ minHeight: '48px', maxHeight: '160px' }}
              />
              <p className="absolute bottom-2 right-3 text-[10px] text-slate-600 select-none pointer-events-none">↵ enviar</p>
            </div>

            <button type="submit" disabled={!input.trim() || isLoading} className="flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:bg-slate-800 disabled:border disabled:border-slate-700 disabled:cursor-not-allowed text-white disabled:text-slate-600 transition-all duration-150 shadow-lg shadow-blue-900/40 disabled:shadow-none group">
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150" />}
            </button>
          </form>
          <p className="text-center text-[10px] text-slate-700 mt-2">Não é aconselhamento financeiro — consulte um profissional habilitado.</p>
        </footer>
      </main>
    </div>
  );
}