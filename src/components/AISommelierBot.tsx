import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles, Compass, ChefHat, GlassWater } from 'lucide-react';
import { ChatMessage } from '../types';

export default function AISommelierBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Salam, tamu terhormat. Saya adalah AI Sommelier dan Maître d' GOURMET. Izinkan saya membantu Anda merancang pengalaman sempurna malam ini dengan merekomendasikan anggur terbaik, menjelaskan menu pencicipan musiman kami, atau menjawab pertanyaan mengenai panduan alergi.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const rawVal = textToSend || inputVal;
    if (!rawVal.trim()) return;

    if (!textToSend) {
      setInputVal('');
    }

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: rawVal,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: rawVal, history: messages })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server returned an error');
      }
      
      const assistantMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'assistant',
        text: data.text || "Saya siap melayani Anda sepenuhnya untuk merekomendasikan padanan anggur terbaik.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const assistantMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'assistant',
        text: "Mohon maaf. Saya mengalami gangguan koneksi singkat di ruang bawah tanah batu kami. Yakinlah, tim dapur dan sommelier kami sepenuhnya siap untuk memadukan anggur Anda.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } finally {
      setLoading(false);
    }
  };
  const presetQuestions = [
    { text: "Rekomendasikan padanan untuk A5 Wagyu & Truffle", icon: <GlassWater class="w-3.5 h-3.5 text-[#C5A059]" /> },
    { text: "Apakah scallop crudo sepenuhnya bebas gluten?", icon: <ChefHat class="w-3.5 h-3.5 text-[#C5A059]" /> },
    { text: "Apa filosofi Anda tentang santapan musiman modern?", icon: <Compass class="w-3.5 h-3.5 text-[#C5A059]" /> }
  ];

  return (
    <div id="ai-sommelier-container" class="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            id="ai-toggle-btn"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            class="flex items-center gap-2.5 bg-[#C5A059] hover:bg-[#8E6E3A] text-black px-4.5 py-3.5 rounded-sm shadow-[0_8px_30px_rgba(197,160,89,0.25)] border border-[#C5A059]/20 transition-all font-display tracking-[0.1em] uppercase text-xs group cursor-pointer font-medium"
          >
            <Sparkles class="w-4 h-4 text-black animate-pulse" />
            <span>Konsultasi AI Sommelier</span>
            <span class="w-2 h-2 rounded-full bg-[#C5A059] animate-ping absolute -top-0.5 -right-0.5"></span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="ai-chat-window"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            class="w-96 max-w-[calc(100vw-2rem)] h-[600px] max-h-[85vh] bg-[#0A0A0B]/95 backdrop-blur-xl border border-white/10 rounded-sm shadow-[0_24px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div class="px-5 py-4 bg-gradient-to-r from-black via-[#0A0A0B] to-black border-b border-white/5 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-sm bg-gradient-to-br from-[#C5A059] to-[#8E6E3A] flex items-center justify-center shadow-[0_0_15px_rgba(197,160,89,0.3)]">
                  <Sparkles class="w-4.5 h-4.5 text-black" />
                </div>
                <div>
                  <h4 class="font-display font-medium text-sm text-white tracking-wide">AI Sommelier & Maître d'</h4>
                  <div class="flex items-center gap-1.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse"></span>
                    <span class="text-[10px] text-white/40 font-mono tracking-wider">KONSIERJ ANGGUR</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                class="text-white/40 hover:text-white p-1.5 transition-colors rounded-sm hover:bg-white/5 cursor-pointer"
              >
                <X class="w-4 h-4" />
              </button>
            </div>

            {/* Content list */}
            <div ref={scrollRef} class="flex-grow overflow-y-auto p-4 space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  class={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    class={`max-w-[85%] rounded-sm px-4 py-3 text-xs leading-relaxed font-light ${
                      m.sender === 'user'
                        ? 'bg-[#C5A059]/10 border border-[#C5A059]/20 text-zinc-100 font-normal lg:font-light'
                        : 'bg-white/5 border border-white/5 text-[#E5E5E5]'
                    }`}
                  >
                    <p class="whitespace-pre-line">{m.text}</p>
                    <span class="block text-[8px] text-white/30 mt-1.5 text-right font-mono">
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {loading && (
                <div class="flex justify-start">
                  <div class="bg-white/5 border border-white/5 rounded-sm px-4 py-3 flex items-center gap-2">
                    <div class="flex space-x-1">
                      <div class="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div class="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div class="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span class="text-[10px] text-white/40 font-mono italic">Sommelier sedang memilih anggur...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div class="p-3 bg-black/60 border-t border-white/5 space-y-1.5">
              <span class="text-[9px] text-white/40 font-mono block tracking-widest uppercase px-1">Pertanyaan Cepat:</span>
              <div class="flex flex-col gap-1.5">
                {presetQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(q.text)}
                    class="flex items-center gap-2 text-left text-xs text-[#E5E5E5]/75 hover:text-[#C5A059] bg-[#0A0A0B] hover:bg-white/5 border border-white/5 hover:border-[#C5A059]/30 rounded-sm p-2 transition-all cursor-pointer group"
                  >
                    {q.icon}
                    <span class="truncate text-[11px] font-sans font-light">{q.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <div class="p-3 bg-[#0A0A0B] border-t border-white/10 flex items-center gap-2">
              <input
                id="ai-chat-input"
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                placeholder="Tanyakan tentang anggur, bebas gluten, resep rahasia..."
                class="flex-grow bg-black border border-white/5 focus:border-[#C5A059]/40 outline-none text-xs rounded-sm px-3.5 py-2.5 text-zinc-100 placeholder:text-zinc-500 transition-all font-sans"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputVal.trim() || loading}
                class="bg-[#C5A059] hover:bg-[#8E6E3A] disabled:bg-[#0A0A0B] disabled:opacity-30 disabled:text-[#E5E5E5]/30 text-black p-2.5 rounded-sm transition-all shadow-md flex items-center justify-center shrink-0 border border-[#C5A059]/10 cursor-pointer"
              >
                <Send class="w-4.5 h-4.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
