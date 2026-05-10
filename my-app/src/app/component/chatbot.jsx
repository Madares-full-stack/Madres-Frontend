"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "@/app/globals.css";

const Chatbot = () => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState(null);
  const [open, setOpen] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Load user
  useEffect(() => {
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!stored || !token) {
      router.push("/login");
      return;
    }

    let parsed;

    try {
      parsed = JSON.parse(stored);
    } catch {
      parsed = {
        name: stored,
        role: "student",
      };
    }

    setUser(parsed);

    if (parsed.role !== "student") {
      setAuthorized(false);
    } else {
      setAuthorized(true);

      setMessages([
        {
          role: "assistant",
          content: `أهلاً ${parsed.name}! 👋 أنا مساعدك الذكي، كيف يمكنني مساعدتك اليوم؟`,
        },
      ]);
    }
  }, []);

  // Scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Send message
  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = {
      role: "user",
      content: text,
    };

    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const API = "http://localhost:5000";

      // تنظيف الهستوري (مهم جداً لـ Groq)
      const cleanHistory = updatedMessages.filter(
        (msg) =>
          msg.role === "user" ||
          msg.role === "assistant" ||
          msg.role === "system"
      );

      const res = await fetch(`${API}/api/chatbot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: text,
          history: cleanHistory,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "حدث خطأ");
      }

      const assistantMsg = {
        role: "assistant",
        content: data.reply,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ " + err.message,
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "تم مسح المحادثة 😊",
      },
    ]);
  };

  if (authorized === false) return null;

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          className="chatbot-floating-btn"
          onClick={() => setOpen(true)}
        >
          🤖
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="chatbot-widget">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-left">
              <span className="chatbot-status-dot"></span>
              <span>المساعد الذكي</span>
            </div>

            <button
              className="chatbot-close-btn"
              onClick={() => setOpen(false)}
            >
              ✖
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chatbot-message-row ${
                  msg.role === "user"
                    ? "chatbot-message-row-user"
                    : "chatbot-message-row-bot"
                }`}
              >
                <div
                  className={`chatbot-bubble ${
                    msg.role === "user"
                      ? "chatbot-user-bubble"
                      : "chatbot-bot-bubble"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chatbot-message-row chatbot-message-row-bot">
                <div className="chatbot-bubble chatbot-bot-bubble">
                  ⏳ جاري الكتابة...
                </div>
              </div>
            )}

            <div ref={bottomRef}></div>
          </div>

          {/* Input */}
          <div className="chatbot-input-area">
            <textarea
              ref={inputRef}
              value={input}
              disabled={loading}
              rows={1}
              placeholder="اكتب سؤالك..."
              className="chatbot-input"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="chatbot-send-btn"
            >
              ↑
            </button>
          </div>

          {/* Clear */}
          <button
            className="chatbot-clear-btn"
            onClick={clearChat}
          >
            🗑️ مسح المحادثة
          </button>
        </div>
      )}
    </>
  );
};

export default Chatbot;