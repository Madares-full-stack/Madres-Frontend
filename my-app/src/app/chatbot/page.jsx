"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function ChatbotPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [authorized, setAuthorized] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!stored || !token) { router.push("/login"); return; }
    const parsed = JSON.parse(stored);
    setUser(parsed);
    if (parsed.role !== "student") {
      setAuthorized(false);
    } else {
      setAuthorized(true);
      setMessages([{ role: "assistant", content: `أهلاً ${parsed.name}! 👋 أنا مساعدك الذكي. يمكنني مساعدتك في أسئلتك الدراسية ومعرفة سجل حضورك. كيف يمكنني مساعدتك اليوم؟` }]);
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    const newHistory = [...history, userMsg];
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: text, history }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "حدث خطأ");
      const assistantMsg = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, assistantMsg]);
      setHistory([...newHistory, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "error", content: "❌ " + err.message }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => {
    setHistory([]);
    setMessages([{ role: "assistant", content: "تم مسح المحادثة. كيف يمكنني مساعدتك؟ 😊" }]);
  };

  if (authorized === null) {
    return (
      <div className="chatbot-loading-page">
        <div className="chatbot-spinner" />
      </div>
    );
  }

  if (authorized === false) {
    return (
      <div className="chatbot-blocked-page">
        <div className="chatbot-blocked-card">
          <div className="chatbot-blocked-icon">🔒</div>
          <h2 className="chatbot-blocked-title">غير مصرح بالدخول</h2>
          <p className="chatbot-blocked-desc">هذه الصفحة مخصصة للطلاب فقط.</p>
          <button onClick={() => router.back()} className="chatbot-back-btn">العودة</button>
        </div>
      </div>
    );
  }

  return (
    <div className="chatbot-page">
      <aside className="chatbot-sidebar">
        <div className="chatbot-sidebar-top">
          <div className="chatbot-sidebar-logo">🤖</div>
          <h2 className="chatbot-sidebar-title">مساعد مدارس</h2>
          <p className="chatbot-sidebar-sub">مساعدك الذكي</p>
        </div>

        <div className="chatbot-sidebar-user">
          <div className="chatbot-avatar">{user?.name?.[0] || "ط"}</div>
          <div>
            <div className="chatbot-user-name">{user?.name}</div>
            <div className="chatbot-user-role">طالب 🎓</div>
          </div>
        </div>

        <div className="chatbot-suggestions">
          <p className="chatbot-suggest-title">اقتراحات سريعة</p>
          {["ما نسبة حضوري؟", "متى كنت غائباً آخر مرة؟", "اشرح لي مفهوم الدالة", "ما هي قوانين نيوتن؟"].map((s, i) => (
            <button key={i} onClick={() => { setInput(s); inputRef.current?.focus(); }} className="chatbot-suggest-btn">
              {s}
            </button>
          ))}
        </div>

        <button onClick={clearChat} className="chatbot-clear-btn">🗑️ مسح المحادثة</button>
      </aside>

      <main className="chatbot-main">
        <div className="chatbot-header">
          <div className="chatbot-header-left">
            <div className="chatbot-header-dot" />
            <span className="chatbot-header-status">متصل</span>
          </div>
          <div className="chatbot-header-center">
            <span className="chatbot-header-title">المساعد الذكي</span>
          </div>
          <div className="chatbot-header-spacer" />
        </div>

        <div className="chatbot-messages-area">
          {messages.map((msg, i) => (
            <div key={i} className={`chatbot-msg-row ${msg.role === "user" ? "chatbot-msg-row--user" : "chatbot-msg-row--bot"}`}>
              {msg.role !== "user" && <div className="chatbot-bot-avatar">🤖</div>}
              <div className={`chatbot-bubble ${msg.role === "user" ? "chatbot-bubble--user" : msg.role === "error" ? "chatbot-bubble--error" : "chatbot-bubble--bot"}`}>
                {msg.content}
              </div>
              {msg.role === "user" && <div className="chatbot-user-avatar-small">{user?.name?.[0] || "ط"}</div>}
            </div>
          ))}

          {loading && (
            <div className="chatbot-msg-row chatbot-msg-row--bot">
              <div className="chatbot-bot-avatar">🤖</div>
              <div className="chatbot-bubble chatbot-bubble--bot chatbot-typing-bubble">
                <span className="chatbot-dot chatbot-dot--1" />
                <span className="chatbot-dot chatbot-dot--2" />
                <span className="chatbot-dot chatbot-dot--3" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="chatbot-input-area">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="اكتب سؤالك هنا... (Enter للإرسال)"
            className="chatbot-textarea"
            rows={1}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className={`chatbot-send-btn ${!input.trim() || loading ? "chatbot-send-btn--disabled" : ""}`}
          >
            {loading ? "⏳" : "↑"}
          </button>
        </div>
        <p className="chatbot-hint">Enter للإرسال • Shift+Enter لسطر جديد</p>
      </main>
    </div>
  );
}