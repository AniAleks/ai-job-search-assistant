import { useRef, useState, type FormEvent } from "react";
import { chat } from "../api/client";
import { Markdown } from "../components/Markdown";

interface ChatMessage {
  role: "user" | "assistant" | "error";
  text: string;
}

export function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setSending(true);
    try {
      const { reply } = await chat(text);
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      const text = err instanceof Error ? err.message : "Something went wrong";
      setMessages((prev) => [...prev, { role: "error", text }]);
    } finally {
      setSending(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  };

  return (
    <div className="page page-chat">
      <h1>Assistant</h1>
      <p className="muted">
        Ask about your applications or report progress — e.g. "Which applications am I waiting to hear back on?"
        or "I got an interview at Acme on Friday." Each message is answered independently; the assistant looks up
        your tracker fresh every time rather than remembering earlier turns in this chat.
      </p>

      <div className="chat-window">
        {messages.length === 0 ? <p className="state-message">No messages yet — say hello.</p> : null}
        {messages.map((m, i) => (
          <div key={i} className={`chat-message chat-${m.role}`}>
            {m.role === "assistant" ? <Markdown text={m.text} /> : m.text}
          </div>
        ))}
        {sending ? <div className="chat-message chat-assistant chat-pending">Thinking…</div> : null}
        <div ref={bottomRef} />
      </div>

      <form className="form-inline" onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
          disabled={sending}
          autoFocus
        />
        <button type="submit" disabled={sending || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}
