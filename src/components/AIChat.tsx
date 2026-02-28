import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, X, Bot, User } from 'lucide-react';
import { useGroqAI } from '@/hooks/useGroqAI';
import { cn } from '@/lib/utils';

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: 'floating' | 'embedded' | 'fullscreen';
}

export function AIChat({ isOpen, onClose, variant = 'floating' }: AIChatProps) {
  const { messages, isLoading, sendMessage } = useGroqAI();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && variant !== 'embedded') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, variant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  const quickReplies = [
    "Tell me about your skills",
    "Show me your projects",
    "I'm a recruiter hiring for...",
    "What's your design process?",
  ];

  if (variant === 'embedded') {
    return (
      <div className="w-full h-full flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={cn(
                  'flex gap-3',
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                    message.role === 'user'
                      ? 'bg-electric/20'
                      : 'bg-white/10'
                  )}
                >
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-electric" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div
                  className={cn(
                    'max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed',
                    message.role === 'user'
                      ? 'bg-electric text-white rounded-br-md'
                      : 'bg-white/5 text-white/90 rounded-bl-md'
                  )}
                >
                  {message.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white/5 px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1">
                <span className="w-2 h-2 bg-white/50 rounded-full typing-dot" />
                <span className="w-2 h-2 bg-white/50 rounded-full typing-dot" />
                <span className="w-2 h-2 bg-white/50 rounded-full typing-dot" />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        {messages.length < 3 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => sendMessage(reply)}
                className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-full transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-electric/50 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-11 h-11 bg-electric rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-electric/90 transition-colors"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (variant === 'fullscreen') {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-void"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-electric/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-electric" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">AI Recruiter Assistant</h3>
                    <p className="text-sm text-white/50">Powered by Groq AI</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-white/70" />
                </button>
              </div>

              {/* Chat Content */}
              <div className="flex-1 overflow-hidden">
                <AIChat isOpen={true} onClose={() => {}} variant="embedded" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Floating variant
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[600px] bg-surface/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-electric/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-electric" />
              </div>
              <span className="text-sm font-medium text-white">AI Assistant</span>
            </div>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white/50" />
            </button>
          </div>

          {/* Chat */}
          <div className="h-[400px]">
            <AIChat isOpen={true} onClose={() => {}} variant="embedded" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function AIChatButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-electric rounded-full flex items-center justify-center shadow-lg glow-accent"
    >
      <Sparkles className="w-6 h-6 text-white" />
    </motion.button>
  );
}
