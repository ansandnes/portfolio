"use client";

import React, { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
}

const GREETING: Message = {
  id: "0",
  role: "model",
  text: "Hello! I'm a Gemini-powered assistant. Ask me anything about code, design, or the universe. (Each message is answered on its own — I don't keep the conversation in context.)",
};

const AiChatApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = input.trim();
    if (!prompt || loading) return;

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", text: prompt }]);
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

      if (res.status === 429) {
        text = "You're sending messages quickly — give it a minute and try again.";
      } else if (!res.ok || !json?.data) {
        text = "Sorry, I couldn't get a response. Please try again.";
      } else {
        text = json.data;
      }
    } catch {
      text = "Sorry, I couldn't reach the server. Please try again.";
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
          <h2 className="text-2xl font-bold text-white">AI Playground</h2>
          <p className="text-slate-400 text-xs">Powered by Google Gemini 2.5 Flash</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-900/50 rounded-xl p-4 border border-slate-700 mb-4 custom-scrollbar">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === "user" ? "bg-emerald-600" : "bg-purple-600"
                }`}
              >
                {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div
                className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === "user"
                    ? "bg-emerald-600/20 text-emerald-100 rounded-tr-none"
                    : "bg-slate-800 text-slate-200 rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                <Bot size={16} />
              </div>
              <div className="bg-slate-800 px-4 py-2 rounded-2xl rounded-tl-none flex items-center gap-1">
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75" />
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150" />
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
          placeholder="Ask something..."
          aria-label="Message"
          disabled={loading}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
        />
        <Button
          type="submit"
          variant="secondary"
          disabled={loading}
          aria-label="Send message"
          className="!bg-purple-600 hover:!bg-purple-700"
        >
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
};

export default AiChatApp;
