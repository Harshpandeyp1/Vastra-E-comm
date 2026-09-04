import React, { useState, useRef, useEffect } from "react";
import {
  FiSend,
  FiX,
  FiTrash2,
  FiTrendingUp,
  FiTruck,
  FiDollarSign,
  FiBarChart2,
  FiActivity,
  FiZap,
} from "react-icons/fi";
import { sendMessage } from "../../Service/chatService";

const QUICK_PROMPTS = [
  {
    label: "Profit Analysis",
    text: "How can I improve my profit based on my current business performance?",
    icon: FiTrendingUp,
  },
  {
    label: "Best Products",
    text: "Which of my products are performing the best?",
    icon: FiBarChart2,
  },
  {
    label: "Delivery Optimization",
    text: "Which pending deliveries should I prioritize and why?",
    icon: FiTruck,
  },
  {
    label: "Business Insights",
    text: "Give me actionable insights to improve my store performance.",
    icon: FiDollarSign,
  },
];

const MerchantChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your VASTRA Merchant Copilot. I can help you analyze profit margins, delivery partners, and sales performance.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendChat = async (messageText) => {
    const text = messageText.trim();
    if (!text || loading) return;

    const userMessage = {
      role: "user",
      content: text,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const history = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Explicitly pass "MERCHANT" to activate merchant tools on the backend
      const res = await sendMessage(history, "MERCHANT");
      const reply = typeof res === "object" && res.reply ? res.reply : res;

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply,
        },
      ]);
    } catch (error) {
      console.error("Merchant AI error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I couldn't process that operational query right now. Please verify your connection or token.",
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendChat(input);
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hello! I'm your VASTRA Merchant Copilot. I can help you analyze profit margins, delivery partners, and sales performance.",
      },
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="mb-4 h-[580px] w-[420px] max-w-[calc(100vw-2rem)] rounded-3xl bg-[#0f0f15]/95 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="px-5 py-4 border-b border-white/10 bg-black/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <FiActivity className="w-5 h-5 animate-pulse" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0f0f15]" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-semibold text-white tracking-wide">
                    Merchant Copilot
                  </h3>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 font-medium px-1.5 py-0.2 rounded border border-amber-500/30">
                    OPS AGENT
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">
                  Logistics & Profit Intelligence
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearChat}
                disabled={loading}
                title="Reset conversation"
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition cursor-pointer disabled:opacity-40"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition cursor-pointer"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts */}
          {messages.length === 1 && (
            <div className="p-3 border-b border-white/5 bg-black/20 flex gap-2 overflow-x-auto no-scrollbar">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt.label}
                  type="button"
                  onClick={() => sendChat(prompt.text)}
                  disabled={loading}
                  className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-white/5 hover:bg-amber-500/10 text-gray-300 hover:text-amber-300 border border-white/5 hover:border-amber-500/30 text-[11px] transition disabled:opacity-40 cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <prompt.icon className="w-3 h-3 text-amber-400" />
                  {prompt.label}
                </button>
              ))}
            </div>
          )}

          {/* Message Stream */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-white/10"
          >
            {messages.map((message, index) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex gap-2.5 ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                      <FiZap className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isUser
                        ? "bg-amber-600 text-white rounded-tr-none shadow-md shadow-amber-900/20"
                        : message.error
                        ? "bg-red-950/30 border border-red-800/40 text-red-300 rounded-tl-none"
                        : "bg-white/5 text-gray-200 rounded-tl-none border border-white/10 shadow-sm"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-2.5 justify-start items-center">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <FiActivity className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="p-3 bg-white/5 border border-white/10 rounded-2xl rounded-tl-none text-xs text-amber-300/90 flex items-center gap-2">
                  <span className="flex gap-1">
                    <span
                      className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </span>
                  <span className="text-[11px] tracking-wide text-gray-400">
                    Running logistics & margin tools...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSubmit}
            className="p-3.5 border-t border-white/10 bg-black/40"
          >
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 focus-within:border-amber-500/60 rounded-xl px-3 py-1.5 transition">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                placeholder="Ask about orders, margins, couriers..."
                className="flex-1 bg-transparent border-none outline-none text-xs text-white placeholder-gray-500 py-1"
              />

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-8 h-8 rounded-lg bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center transition disabled:opacity-40 cursor-pointer shadow-md"
              >
                <FiSend className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Launcher Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-700 text-white shadow-xl shadow-amber-950/40 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center border border-white/20 cursor-pointer group"
      >
        <FiActivity
          className={`w-6 h-6 transition-transform duration-200 ${
            isOpen ? "rotate-90 scale-90" : "group-hover:scale-110"
          }`}
        />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
        </span>
      </button>
    </div>
  );
};

export default MerchantChat;