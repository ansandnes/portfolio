"use client";

import React, { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { useT } from "@/i18n/LocaleProvider";

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
}

const AiChatApp: React.FC = () => {
  const t = useT();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const greeting: Message = { id: "greeting", role: "model", text: t.chat.greeting };
  const shown = messages.length === 0 ? [greeting] : messages;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = input.trim();
    if (!prompt || loading) return;

    setMessages((prev) => [
      ...(prev.length === 0 ? [greeting] : prev),
      { id: crypto.randomUUID(), role: "user", text: prompt },
    ]);
    setInput("");
    setLoading(true);

    let text: string;
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const json = await res.json().catch(() => null);

      if (res.status === 429) text = t.chat.errRate;
      else if (!res.ok || !json?.data) text = t.chat.errGeneric;
      else text = json.data;
    } catch {
      text = t.chat.errNetwork;
    } finally {
      setLoading(false);
    }

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "model", text }]);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="text-purple-400" size={24} />
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t.chat.title}</h2>
          <p className="text-muted text-xs">{t.chat.poweredBy}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-elevated rounded-xl p-4 border border-line mb-4 custom-scrollbar">
        <div className="space-y-4">
          {shown.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white ${
                  msg.role === "user" ? "bg-emerald-600" : "bg-purple-600"
                }`}
              >
                {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div
                className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === "user"
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-100 rounded-tr-none"
                    : "bg-card text-foreground rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 text-white">
                <Bot size={16} />
              </div>
              <div className="bg-card px-4 py-2 rounded-2xl rounded-tl-none flex items-center gap-1">
                <span className="w-2 h-2 bg-subtle rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-subtle rounded-full animate-bounce delay-75" />
                <span className="w-2 h-2 bg-subtle rounded-full animate-bounce delay-150" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.chat.placeholder}
          aria-label={t.chat.inputAria}
          disabled={loading}
          className="flex-1 bg-elevated border border-line rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
        />
        <Button
          type="submit"
          variant="secondary"
          disabled={loading}
          aria-label={t.chat.sendAria}
          className="!bg-purple-600 hover:!bg-purple-700"
        >
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
};

export default AiChatApp;
