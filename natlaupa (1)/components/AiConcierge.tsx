import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send } from 'lucide-react';
import { generateTravelAdvice } from '../services/geminiService';
import { AiChatMessage } from '../types';

const AiConcierge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<AiChatMessage[]>([
    { role: 'model', text: "Welcome to Natlaupa. Where does your imagination take you today?" }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!query.trim()) return;

    const userMsg = query;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setQuery('');
    setLoading(true);

    const response = await generateTravelAdvice(userMsg);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-40 bg-midnight border border-gold text-gold p-4 rounded-full shadow-2xl hover:bg-gold hover:text-midnight transition-colors duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Sparkles size={24} />
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="ai-concierge-modal"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-4 md:right-8 w-[90vw] md:w-96 max-h-[60vh] flex flex-col bg-deepBlue/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-midnight/80 p-4 border-b border-white/10 flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-2">
                <Sparkles size={16} className="text-gold" />
                <h3 className="text-white font-serif tracking-wider text-sm">AI Concierge</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-white/10 text-white' : 'bg-gold/10 text-gold border border-gold/20'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && <div className="text-xs text-slate-500 animate-pulse">Consulting the archives...</div>}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-midnight/50 shrink-0">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask for recommendations..."
                  className="flex-1 bg-transparent border-none text-white text-sm focus:ring-0 placeholder-slate-600"
                />
                <button onClick={handleSend} disabled={loading} className="text-gold hover:text-white disabled:opacity-50">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AiConcierge;