import React, { useState, useRef, useEffect } from "react";
import { sendMessage } from "../../Service/chatService";
import {
  FiSend,
  FiX,
  FiRotateCcw,
  FiCpu,
  FiUser,
FiZap,
  FiTrendingUp,
  FiPackage,
  FiDollarSign,
} from "react-icons/fi";

const AGENT_PROMPTS = [
  { label: "Revenue breakdown", query: "Give me a quick summary of my current revenue and top margin drivers." },
  { label: "Best sellers", query: "Which products are performing best in my store right now?" },
  { label: "Fulfillment status", query: "Are there any pending orders or bottlenecks in fulfillment?" },
];

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      text: "Hello! I'm your Vastra Merchant Copilot. I can analyze your sales trends, track pending orders, or help optimize catalog performance. What would you like to review?",
      sender: "ai",
      timestamp: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [agentPhase, setAgentPhase] = useState(""); // Thinking step tracker

  const chatbox = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatbox.current) {
      chatbox.current.scrollTop = chatbox.current.scrollHeight;
    }
  }, [messages, loading, agentPhase]);

  const getTimeString = () => {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSend = async (textToSend = input) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    const userMessage = {
      id: Date.now().toString(),
      text: trimmed,
      sender: "user",
      timestamp: getTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Dynamic reasoning simulation
    setAgentPhase("Accessing merchant metrics...");
    const phaseTimer = setTimeout(() => {
      setAgentPhase("Synthesizing insights...");
    }, 1200);

    try {
      const aiResponse = await sendMessage(trimmed);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: aiResponse,
          sender: "ai",
          timestamp: getTimeString(),
        },
      ]);
    } catch (error) {
      console.error("VASTRA Agent Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "I encountered an error querying the analytics engine. Please ensure your backend service is running and try again.",
          sender: "ai",
          timestamp: getTimeString(),
        },
      ]);
    } finally {
      clearTimeout(phaseTimer);
      setLoading(false);
      setAgentPhase("");
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        text: "Chat memory cleared. How can I assist you with your store metrics?",
        sender: "ai",
        timestamp: getTimeString(),
      },
    ]);
  };

  return (
    <div className="font-sans">
      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 h-[560px] w-[390px] max-w-[calc(100vw-2rem)] rounded-3xl bg-[#0f0f15]/95 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* AGENT HEADER */}
          <div className="px-5 py-4 border-b border-white/10 bg-black/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                  <FiCpu className="w-5 h-5 animate-pulse" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0f0f15]" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-semibold text-white tracking-wide">Vastra Agent</h3>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 font-medium px-1.5 py-0.2 rounded border border-purple-500/30">
                    COPILOT
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">Autonomous Store Intelligence</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                title="Reset Conversation"
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition"
              >
                <FiRotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* MESSAGES CONTAINER */}
          <div
            ref={chatbox}
            className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2.5 ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* Agent Avatar */}
                {message.sender === "ai" && (
                                <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                                    <FiZap className="w-3.5 h-3.5" />
                                </div>
                                )}

                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    message.sender === "user"
                      ? "bg-purple-600 text-white rounded-tr-none shadow-md shadow-purple-900/20"
                      : "bg-white/5 text-gray-200 rounded-tl-none border border-white/10 shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  <div
                    className={`mt-1 text-[9px] ${
                      message.sender === "user" ? "text-purple-200/80 text-right" : "text-gray-500"
                    }`}
                  >
                    {message.timestamp}
                  </div>
                </div>

                {/* User Avatar */}
                {message.sender === "user" && (
                  <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-gray-300 shrink-0 mt-0.5">
                    <FiUser className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {/* LIVE AGENT THINKING INDICATOR */}
            {loading && (
              <div className="flex gap-2.5 justify-start items-center">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
                  <FiCpu className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="p-3 bg-white/5 border border-white/10 rounded-2xl rounded-tl-none text-xs text-purple-300/90 flex items-center gap-2">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                  <span className="text-[11px] tracking-wide text-gray-400">{agentPhase}</span>
                </div>
              </div>
            )}
          </div>

          {/* QUICK PROMPT SUGGESTIONS */}
          <div className="px-4 py-2 border-t border-white/5 bg-black/20 flex gap-1.5 overflow-x-auto no-scrollbar">
            {AGENT_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                disabled={loading}
                onClick={() => handleSend(prompt.query)}
                className="whitespace-nowrap px-2.5 py-1 text-[10px] rounded-lg bg-white/5 hover:bg-purple-600/20 text-gray-300 hover:text-purple-300 border border-white/5 hover:border-purple-500/30 transition disabled:opacity-40"
              >
                {prompt.label}
              </button>
            ))}
          </div>

          {/* INPUT SECTION */}
          <div className="p-3.5 border-t border-white/10 bg-black/40">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 focus-within:border-purple-500/60 rounded-xl px-3 py-1.5 transition">
              <input
                disabled={loading}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
                placeholder="Ask your merchant copilot..."
                className="flex-1 bg-transparent border-none outline-none text-xs text-white placeholder-gray-500 py-1"
              />

              <button
                disabled={loading || !input.trim()}
                onClick={() => handleSend()}
                className="w-8 h-8 rounded-lg bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center transition disabled:opacity-40 disabled:hover:bg-purple-600"
              >
                <FiSend className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING ACTION LAUNCHER */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-xl shadow-purple-900/40 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center z-50 border border-white/20"
      >
        <FiCpu className={`w-6 h-6 transition-transform ${isOpen ? "rotate-90" : ""}`} />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
      </button>
    </div>
  );
};

export default Chat;