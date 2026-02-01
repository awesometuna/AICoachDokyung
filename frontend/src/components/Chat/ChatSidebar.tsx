import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import ActionCard from './ActionCard';

const ChatSidebar: React.FC = () => {
  const { isSidebarOpen, messages, sendUserMessage, loadHistory } = useAppStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendUserMessage(input);
    setInput('');
  };

  if (!isSidebarOpen) return null;

  return (
    <div className="w-96 h-full bg-white border-l border-sunset-border flex flex-col shadow-xl">
      {/* Header */}
      <div className="p-4 border-b border-sunset-border bg-gradient-to-r from-pure-white to-warm-white flex justify-between items-center shrink-0">
        <div className="font-bold text-lg text-charcoal flex items-center">
          <span className="w-3 h-3 bg-sunset-coral rounded-full mr-2"></span>
          Coach Dokyung
        </div>
        <div className="text-xs text-warm-gray bg-gray-100 px-2 py-1 rounded-full">Online</div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.isUser ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.isUser
              ? 'bg-sunset-coral text-white rounded-br-none'
              : 'bg-warm-white text-charcoal border border-sunset-border rounded-bl-none'
              }`}>
              {msg.text}
            </div>

            {/* Action Card Rendering */}
            {!msg.isUser && msg.action && (
              <div className="max-w-[85%]">
                <ActionCard action={msg.action} onClick={() => alert(`Starting: ${msg.action?.title}`)} />
              </div>
            )}

            <div className="text-[10px] text-gray-400 mt-1 px-1">
              {new Date(msg.id).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-sunset-border bg-white shrink-0">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Tell me what's on your mind..."
            className="w-full pl-4 pr-12 py-3 rounded-full border border-sunset-border focus:outline-none focus:ring-2 focus:ring-sunset-coral focus:border-transparent text-sm transition-shadow shadow-sm"
          />
          <button
            onClick={handleSend}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-sunset-coral text-white rounded-full hover:bg-deep-coral transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
