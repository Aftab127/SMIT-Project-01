import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") || "http://localhost:5000";

export default function Chat() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("connecting");
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    const token = localStorage.getItem("dukan_token");
    const socket = io(SOCKET_URL, { auth: { token } });
    socketRef.current = socket;

    socket.on("connect", () => setStatus("connected"));
    socket.on("disconnect", () => setStatus("disconnected"));
    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error.message);
      setStatus("error");
    });

    socket.on("chat:system", (message) => setMessages((current) => [...current, message]));
    socket.on("chat:message", (message) => setMessages((current) => [...current, message]));
    socket.on("chat:response", (message) => setMessages((current) => [...current, message]));

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user, navigate]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (event) => {
    event.preventDefault();
    const cleanText = text.trim();
    if (!cleanText || !socketRef.current?.connected) return;

    socketRef.current.emit("chat:message", { text: cleanText });
    setText("");
  };

  const statusLabel = {
    connecting: "Connecting...",
    connected: "● Online",
    disconnected: "○ Disconnected",
    error: "Connection error"
  }[status];

  return (
    <main className="page chat-page">
      <div className="container">
        <div className="chat-shell">
          <div className="chat-header">
            <div>
              <p className="eyebrow">DUKANONLINE SUPPORT</p>
              <h1>Live Chat</h1>
              <p className="muted">Messages are sent between the React client and Node.js server using Socket.IO.</p>
            </div>
            <span className={`chat-status ${status}`}>{statusLabel}</span>
          </div>

          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`chat-row ${message.sender === "client" ? "mine" : "theirs"}`}>
                <div className={`chat-bubble ${message.sender === "client" ? "mine" : "theirs"}`}>
                  <span>{message.sender === "client" ? "You" : "DukanOnline Server"}</span>
                  <p>{message.text}</p>
                  <small>{new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</small>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <form className="chat-input" onSubmit={sendMessage}>
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Type your message..."
              disabled={status !== "connected"}
              aria-label="Chat message"
            />
            <button type="submit" disabled={!text.trim() || status !== "connected"}>Send</button>
          </form>
        </div>
      </div>
    </main>
  );
}
