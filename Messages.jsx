import { useState, useRef, useEffect } from "react";
import { Send, Phone, Video, Info, ArrowLeft } from "lucide-react";
import { users, messages as initialMessages } from "../data/mockData";
import { useApp } from "../context/AppContext";
import "./Messages.css";

const CONVERSATIONS = [
  { id: "u1_u2", participants: ["u1", "u2"] },
];

export default function Messages() {
  const { user } = useApp();
  const [activeConv, setActiveConv] = useState("u1_u2");
  const [allMessages, setAllMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [showChat, setShowChat] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const convMessages = allMessages[activeConv] || [];
  const otherUserId = activeConv.replace("u1_u2", "").trim() === ""
    ? (user.id === "u1" ? "u2" : "u1")
    : activeConv.split("_").find((id) => id !== user.id);
  const otherUser = users.find((u) => u.id === (user.id === "u1" ? "u2" : "u1"));

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [convMessages]);

  const sendMessage = () => {
    if (!draft.trim()) return;
    const newMsg = {
      id: `m${Date.now()}`,
      senderId: user.id,
      text: draft.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: true,
    };
    setAllMessages((prev) => ({
      ...prev,
      [activeConv]: [...(prev[activeConv] || []), newMsg],
    }));
    setDraft("");
    inputRef.current?.focus();

    // Auto-reply after 1.2s
    setTimeout(() => {
      const replies = [
        "Sure, let me check and get back to you!",
        "Sounds good! I can ship tomorrow.",
        "Thanks for your interest 😊",
        "Yes, it's still available!",
        "I can do $50 off if you buy today.",
      ];
      const reply = {
        id: `m${Date.now() + 1}`,
        senderId: otherUser?.id || "u2",
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        read: false,
      };
      setAllMessages((prev) => ({
        ...prev,
        [activeConv]: [...(prev[activeConv] || []), reply],
      }));
    }, 1200);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="messages-page">
      {/* Sidebar */}
      <div className={`conv-sidebar ${showChat ? "hide-mobile" : ""}`}>
        <div className="conv-sidebar-header">
          <h2 className="messages-title">Messages</h2>
        </div>
        <div className="conv-list">
          {CONVERSATIONS.map((conv) => {
            const other = users.find((u) => u.id === (user.id === "u1" ? "u2" : "u1"));
            const lastMsg = (allMessages[conv.id] || []).slice(-1)[0];
            return (
              <button
                key={conv.id}
                className={`conv-item ${activeConv === conv.id ? "active" : ""}`}
                onClick={() => { setActiveConv(conv.id); setShowChat(true); }}
              >
                <img src={other?.avatar} alt={other?.name} className="conv-avatar" />
                <div className="conv-info">
                  <div className="conv-name-row">
                    <span className="conv-name">{other?.name}</span>
                    <span className="conv-time">{lastMsg?.time}</span>
                  </div>
                  <p className="conv-preview">{lastMsg?.text}</p>
                </div>
              </button>
            );
          })}
          <div className="conv-placeholder">
            <p>More conversations coming soon…</p>
          </div>
        </div>
      </div>

      {/* Chat */}
      <div className={`chat-area ${showChat ? "show-mobile" : ""}`}>
        {/* Chat Header */}
        <div className="chat-header">
          <button className="back-to-convs mobile-only" onClick={() => setShowChat(false)}>
            <ArrowLeft size={18} />
          </button>
          {otherUser && (
            <>
              <img src={otherUser.avatar} alt={otherUser.name} className="chat-avatar" />
              <div className="chat-user-info">
                <span className="chat-user-name">{otherUser.name}</span>
                <span className="chat-user-handle">{otherUser.username}</span>
              </div>
            </>
          )}
          <div className="chat-actions">
            <button className="chat-action-btn"><Phone size={18} /></button>
            <button className="chat-action-btn"><Video size={18} /></button>
            <button className="chat-action-btn"><Info size={18} /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          <div className="chat-date-divider">Today</div>
          {convMessages.map((msg) => {
            const isMe = msg.senderId === user.id;
            const sender = users.find((u) => u.id === msg.senderId);
            return (
              <div key={msg.id} className={`message-row ${isMe ? "me" : "them"}`}>
                {!isMe && (
                  <img src={sender?.avatar} alt={sender?.name} className="msg-avatar" />
                )}
                <div className="bubble-wrap">
                  <div className={`bubble ${isMe ? "bubble-me" : "bubble-them"}`}>
                    {msg.text}
                  </div>
                  <span className="msg-time">{msg.time}</span>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="chat-input-area">
          <textarea
            ref={inputRef}
            className="chat-input"
            placeholder="Type a message..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button
            className={`send-btn ${draft.trim() ? "active" : ""}`}
            onClick={sendMessage}
            disabled={!draft.trim()}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
