import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendMessage } from "../../Service/chatService";
import { addToCart } from "../../Service/Cart";
import { addToWishlist } from "../../Service/Wishlist";
import { getProfile } from "../../Service/Profile";
import { getImageUrl } from "../../utils/imageHelpers";
import {
  FiSend,
  FiX,
  FiRotateCcw,
  FiCpu,
  FiUser,
  FiZap,
  FiShoppingBag,
  FiHeart,
  FiArrowRight,
  FiAlertCircle,
} from "react-icons/fi";

const PLACEHOLDER_IMG =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22150%22%20height%3D%22150%22%20viewBox%3D%220%200%20150%20150%22%3E%3Crect%20fill%3D%22%23262626%22%20width%3D%22150%22%20height%3D%22150%22%2F%3E%3Ctext%20fill%3D%22%23888%22%20font-family%3D%22sans-serif%22%20font-size%3D%2213%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%3EVASTRA%3C%2Ftext%3E%3C%2Fsvg%3E";

const AGENT_PROMPTS = [
  { label: "Shirts under 2000", query: "Show me trending shirts under 2000" },
  { label: "Men's Hoodies", query: "Show me hoodies for men" },
  { label: "Women Collection", query: "Recommend women dresses under 1500" },
];

const Chat = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      text: "Hello! I'm your VASTRA Shopping Copilot. Ask for any product or say 'Order that for me' and I'll take you straight to checkout!",
      sender: "ai",
      timestamp: "Just now",
      products: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [agentPhase, setAgentPhase] = useState("");

  const chatbox = useRef(null);

  useEffect(() => {
    if (chatbox.current) {
      chatbox.current.scrollTop = chatbox.current.scrollHeight;
    }
  }, [messages, loading, agentPhase]);

  const getTimeString = () => {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getSafeUserId = () => {
    try {
      const profile = typeof getProfile === "function" ? getProfile() : null;
      if (profile && profile.id) return profile.id;
      const stored = JSON.parse(localStorage.getItem("user") || "null");
      if (stored && stored.id) return stored.id;
    } catch {
      // Demo fallback
    }
    return 1;
  };

  // Safe Image Resolver matching Kids.jsx and Products.jsx
  const resolveChatImage = (prod) => {
    if (typeof getImageUrl === "function") {
      const resolved = getImageUrl(prod);
      if (resolved) return resolved;
    }

    const raw = prod?.imageUrl || prod?.image || prod?.img;
    if (!raw) return PLACEHOLDER_IMG;
    if (typeof raw === "string") {
      if (/^(https?:|data:|blob:)/i.test(raw)) return raw;
      if (raw.includes("localhost:") && !raw.includes(":8081")) {
        const filename = raw.split("/").pop();
        return `http://localhost:8081/images/${filename}`;
      }
      if (!raw.startsWith("http")) {
        return `http://localhost:8081/images/${raw}`;
      }
    }

    return raw;
  };

  // Auto-detect and handle interrupted Razorpay checkouts
  useEffect(() => {
    const handleCheckoutInterruption = () => {
      const contextRaw = sessionStorage.getItem("agent_checkout_context");
      if (!contextRaw) return;

      try {
        const context = JSON.parse(contextRaw);
        sessionStorage.removeItem("agent_checkout_context");

        setIsOpen(true);

        const recoveryMessage =
          context.status === "FAILED"
            ? `⚠️ I noticed your payment of ₹${Number(context.cartTotal).toLocaleString()} encountered an issue (${context.reason}). Would you like me to reserve your items or re-open checkout to complete your order?`
            : `I noticed you stepped away from checkout (Total: ₹${Number(context.cartTotal).toLocaleString()}). Your bag is still saved and ready to complete!`;

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            text: recoveryMessage,
            sender: "ai",
            timestamp: getTimeString(),
            products: [],
            isRecovery: true,
          },
        ]);
      } catch (err) {
        console.error("Failed to parse checkout context:", err);
      }
    };

    handleCheckoutInterruption();
    window.addEventListener("agent-checkout-interrupted", handleCheckoutInterruption);
    return () => window.removeEventListener("agent-checkout-interrupted", handleCheckoutInterruption);
  }, []);

  const parseAIContent = (rawText = "") => {
    let cleanText = rawText;
    let products = [];
    let action = null;

    const productRegex = /```(?:json:products|products|json)?\s*(\[\s*\{[\s\S]*?\}\s*\])\s*```/i;
    const productMatch = cleanText.match(productRegex);

    if (productMatch) {
      try {
        const parsed = JSON.parse(productMatch[1].trim());
        if (Array.isArray(parsed)) {
          // Standardize product objects with img key exactly like Kids.jsx
          products = parsed.map((p) => ({
            ...p,
            img: p.imageUrl || p.image || p.img || p.images?.[0],
          }));
          cleanText = cleanText.replace(productMatch[0], "").trim();
        }
      } catch (e) {
        console.error("Failed to parse product array:", e);
      }
    }

    const actionRegex = /```(?:json:action|action|json)?\s*(\{\s*"type"[\s\S]*?\})\s*```/i;
    const actionMatch = cleanText.match(actionRegex);

    if (actionMatch) {
      try {
        action = JSON.parse(actionMatch[1].trim());
        cleanText = cleanText.replace(actionMatch[0], "").trim();
      } catch (e) {
        console.error("Failed to parse action object:", e);
      }
    }

    return { cleanText, products, action };
  };

  const executeAgentAction = async (action, fallbackProducts = []) => {
    const userId = getSafeUserId();
    const targetProductId = action?.productId || fallbackProducts[0]?.id;

    try {
      if (action.type === "ADD_TO_CART") {
        if (targetProductId) {
          await addToCart(userId, targetProductId, 1);
          setAgentPhase("Autonomous Action: Added to Bag");
        }
      } else if (action.type === "ADD_TO_WISHLIST") {
        if (targetProductId && typeof addToWishlist === "function") {
          await addToWishlist(userId, targetProductId);
          setAgentPhase("Autonomous Action: Saved to Wishlist");
        }
      } else if (action.type === "DIRECT_CHECKOUT") {
        if (targetProductId) {
          await addToCart(userId, targetProductId, 1);
        }
        setAgentPhase("Preparing Razorpay Gateway...");
        setTimeout(() => {
          setIsOpen(false);
          navigate("/checkout?retry=true");
        }, 800);
      }
    } catch (err) {
      console.error("Agent Action Execution failed:", err);
    }
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

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    setAgentPhase("Scanning catalog & inventory...");
    const phaseTimer = setTimeout(() => {
      setAgentPhase("Reasoning recommendation...");
    }, 1000);

    try {
      const memoryPayload = nextMessages
        .filter((m) => m.id !== "welcome" && m.id !== "welcome-reset")
        .slice(-8)
        .map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.text,
        }));

      const rawAiResponse = await sendMessage(memoryPayload);
      const { cleanText, products, action } = parseAIContent(rawAiResponse);

      if (action) {
        await executeAgentAction(action, products);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: cleanText,
          sender: "ai",
          timestamp: getTimeString(),
          products: products || [],
          action: action || null,
        },
      ]);
    } catch (error) {
      console.error("VASTRA Agent Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "I encountered a problem accessing the store database. Please check your backend connection.",
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

  const handleDirectBuy = async (product) => {
    const userId = getSafeUserId();
    try {
      await addToCart(userId, product.id, 1);
    } catch (err) {
      console.error("Direct buy cart step warning:", err);
    } finally {
      navigate("/checkout");
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        text: "Memory cleared. What clothing or style can I help you find?",
        sender: "ai",
        timestamp: getTimeString(),
        products: [],
      },
    ]);
  };

  return (
    <div className="font-sans">
      {isOpen && (
        <div className="fixed bottom-24 right-6 h-[600px] w-[420px] max-w-[calc(100vw-2rem)] rounded-3xl bg-[#0f0f15]/95 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
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
                    AUTONOMOUS
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">Context-Aware AI Commerce</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearChat}
                title="Reset Conversation"
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition cursor-pointer"
              >
                <FiRotateCcw className="w-3.5 h-3.5" />
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

          {/* Messages Stream */}
          <div
            ref={chatbox}
            className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2.5 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.sender === "ai" && (
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      message.isRecovery
                        ? "bg-amber-500/20 border border-amber-500/40 text-amber-400"
                        : "bg-purple-500/10 border border-purple-500/30 text-purple-400"
                    }`}
                  >
                    {message.isRecovery ? <FiAlertCircle className="w-3.5 h-3.5" /> : <FiZap className="w-3.5 h-3.5" />}
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    message.sender === "user"
                      ? "bg-purple-600 text-white rounded-tr-none shadow-md shadow-purple-900/20"
                      : message.isRecovery
                      ? "bg-amber-500/10 text-amber-100 rounded-tl-none border border-amber-500/30 shadow-sm"
                      : "bg-white/5 text-gray-200 rounded-tl-none border border-white/10 shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>

                  {/* Payment Recovery 1-Click Action */}
                  {message.isRecovery && (
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsOpen(false);
                          navigate("/checkout?retry=true");
                        }}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] rounded-lg tracking-wider uppercase transition cursor-pointer flex items-center gap-1.5 shadow-md"
                      >
                        Re-open Razorpay Gateway <FiArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* Autonomous Action Badge */}
                  {message.action && (
                    <div className="mt-2.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="font-mono font-bold text-[10px] uppercase tracking-wider">
                        Action Executed: {message.action.type.replace(/_/g, " ")}
                      </span>
                    </div>
                  )}

                  {/* Product Cards */}
                  {message.products && message.products.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.products.map((prod) => {
                        const imageSrc = resolveChatImage(prod);

                        return (
                          <div
                            key={prod.id}
                            onClick={() => navigate(`/product/${prod.id}`)}
                            className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-2xl p-2.5 hover:border-purple-500/50 hover:bg-white/5 transition-all cursor-pointer group/card"
                          >
                            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-900 shrink-0 border border-white/10">
                              <img
                                src={imageSrc}
                                alt={prod.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-110"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = PLACEHOLDER_IMG;
                                }}
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/product/${prod.id}`);
                                }}
                                className="text-white font-bold text-[11px] truncate uppercase tracking-tight hover:text-purple-400 transition cursor-pointer"
                              >
                                {prod.name}
                              </h4>
                              <p className="text-purple-400 font-mono font-black text-xs mt-0.5">
                                ₹{Number(prod.price).toLocaleString()}
                              </p>

                              <div className="flex items-center gap-1.5 mt-2">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDirectBuy(prod);
                                  }}
                                  className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition active:scale-95 cursor-pointer"
                                >
                                  Buy Now <FiArrowRight className="w-2.5 h-2.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    const userId = getSafeUserId();
                                    await addToCart(userId, prod.id, 1);
                                    alert(`Added ${prod.name} to Cart!`);
                                  }}
                                  className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition cursor-pointer"
                                  title="Add to Bag"
                                >
                                  <FiShoppingBag className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    const userId = getSafeUserId();
                                    if (typeof addToWishlist === "function") {
                                      await addToWishlist(userId, prod.id);
                                      alert(`Saved ${prod.name} to Wishlist!`);
                                    }
                                  }}
                                  className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition cursor-pointer"
                                  title="Add to Wishlist"
                                >
                                  <FiHeart className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div
                    className={`mt-1.5 text-[9px] ${
                      message.sender === "user" ? "text-purple-200/80 text-right" : "text-gray-500"
                    }`}
                  >
                    {message.timestamp}
                  </div>
                </div>

                {message.sender === "user" && (
                  <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-gray-300 shrink-0 mt-0.5">
                    <FiUser className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

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

          {/* Quick Prompts */}
          <div className="px-4 py-2 border-t border-white/5 bg-black/20 flex gap-1.5 overflow-x-auto no-scrollbar">
            {AGENT_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                disabled={loading}
                onClick={() => handleSend(prompt.query)}
                className="whitespace-nowrap px-2.5 py-1 text-[10px] rounded-lg bg-white/5 hover:bg-purple-600/20 text-gray-300 hover:text-purple-300 border border-white/5 hover:border-purple-500/30 transition disabled:opacity-40 cursor-pointer"
              >
                {prompt.label}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3.5 border-t border-white/10 bg-black/40">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 focus-within:border-purple-500/60 rounded-xl px-3 py-1.5 transition">
              <input
                disabled={loading}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
                placeholder="Find clothes or say 'Retry payment'..."
                className="flex-1 bg-transparent border-none outline-none text-xs text-white placeholder-gray-500 py-1"
              />

              <button
                type="button"
                disabled={loading || !input.trim()}
                onClick={() => handleSend()}
                className="w-8 h-8 rounded-lg bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center transition disabled:opacity-40 cursor-pointer"
              >
                <FiSend className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Launcher Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-xl shadow-purple-900/40 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center z-50 border border-white/20 cursor-pointer"
      >
        <FiCpu className={`w-6 h-6 transition-transform ${isOpen ? "rotate-90" : ""}`} />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
        </span>
      </button>
    </div>
  );
};

export default Chat;