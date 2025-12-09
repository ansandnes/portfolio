import React, { useState, useRef, useEffect } from 'react';
import Button from '../../../components/Button';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
}

const AiChat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '0', role: 'model', text: 'Hello! I am a Gemini-powered assistant. Ask me anything about code, design, or the universe.' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/ai/gemini/generateText', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: input,
                    type: "text",
                }),
            });


            const data = await res.json();
            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: data.data || "No response received."
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: "Sorry, I encountered an error processing your request."
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
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
                        <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-emerald-600' : 'bg-purple-600'
                                }`}>
                                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                            </div>
                            <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                ? 'bg-emerald-600/20 text-emerald-100 rounded-tr-none'
                                : 'bg-slate-800 text-slate-200 rounded-tl-none'
                                }`}>
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
                                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"></span>
                                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"></span>
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
                    disabled={loading}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
                />
                <Button type="submit" variant="secondary" disabled={loading} className="!bg-purple-600 hover:!bg-purple-700">
                    <Send size={18} />
                </Button>
            </form>
        </div>
    );
};

export default AiChat;