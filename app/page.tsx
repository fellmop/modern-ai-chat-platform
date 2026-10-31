"use client";

import { useRef, useState } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const starterMessages: Message[] = [
  { role: 'assistant', content: 'Hi! I’m Nova, your AI assistant. Ask me to write, brainstorm, explain, summarize, or help you build something.' },
];

const chatPresets = [
  'Write a launch announcement for a modern AI startup',
  'Build a clean product roadmap for Q4',
  'Explain this concept like I’m five',
  'Give me a strong social caption for a product launch',
];

export default function Page() {
  const [messages, setMessages] = useState<Message[]>(starterMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeModel, setActiveModel] = useState('Gemini Flash');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const sendMessage = async (value?: string) => {
    const nextInput = (value ?? input).trim();
    if (!nextInput || isLoading) return;

    const userMessage: Message = { role: 'user', content: nextInput };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage], model: activeModel }),
      });

      if (!res.ok) {
        throw new Error('Request failed');
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Something went wrong. Try again in a moment.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <main className="min-h-screen bg-mesh-gradient px-4 py-6 text-slate-100 md:px-8">
      <div className="mx-auto flex max-w-[1600px] overflow-hidden rounded-[30px] border border-white/10 bg-slate-950/70 shadow-glow backdrop-blur-xl">
        <aside className="hidden w-[300px] border-r border-white/10 bg-white/[0.02] p-4 md:block">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 font-bold">N</div>
              <div>
                <div className="text-lg font-semibold">Nova</div>
                <div className="text-xs text-slate-400">AI workspace</div>
              </div>
            </div>
            <button className="rounded-xl border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-200">New</button>
          </div>

          <div className="mt-8 space-y-2">
            <button className="flex w-full items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-left text-sm text-slate-200">
              <span>Today</span>
              <span className="text-xs text-slate-400">7</span>
            </button>
            <button className="flex w-full items-center justify-between rounded-xl border border-violet-500/50 bg-violet-500/10 px-3 py-2 text-left text-sm text-violet-200">
              <span>Product launch draft</span>
            </button>
            <button className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-slate-300">
              <span>Brand strategy</span>
            </button>
            <button className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-slate-300">
              <span>Code review notes</span>
            </button>
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/10 to-blue-500/10 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-violet-200/80">Upgrade</div>
            <div className="mt-3 text-xl font-semibold">Boost with premium tools</div>
            <div className="mt-2 text-sm text-slate-300">Faster answers, mode switching, and more automation.</div>
            <button className="mt-5 rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-900">Explore Pro</button>
          </div>
        </aside>

        <section className="flex min-h-[820px] flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-4 py-3 md:px-6">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <div className="text-sm text-slate-200">Live assistant</div>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1.5">
              <span className="text-xs text-slate-400">Model</span>
              <select
                value={activeModel}
                onChange={(e) => setActiveModel(e.target.value)}
                className="rounded-full border-0 bg-transparent px-2 py-1 text-sm text-white outline-none"
              >
                <option>Gemini Flash</option>
                <option>OpenRouter Free</option>
                <option>Demo Mode</option>
              </select>
            </div>
          </header>

          <div className="flex flex-1 flex-col">
            <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
              <div className="mx-auto max-w-[1100px] space-y-5">
                {messages.map((message, idx) => (
                  <div
                    key={`${message.role}-${idx}`}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-[26px] px-4 py-3 text-base leading-7 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg shadow-violet-500/20'
                          : 'border border-white/10 bg-white/[0.04] text-slate-100'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 rounded-[26px] border border-white/10 bg-white/[0.04] px-4 py-3 text-slate-300">
                      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-violet-400 [animation-delay:-0.2s]" />
                      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-violet-400 [animation-delay:-0.1s]" />
                      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-violet-400" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-white/10 bg-slate-950/60 px-4 py-4 md:px-8">
              <div className="mx-auto max-w-[1100px]">
                <div className="mb-4 flex flex-wrap gap-2">
                  {chatPresets.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setInput(preset)}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300 transition hover:border-violet-500/50 hover:bg-violet-500/10"
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-3 shadow-inner shadow-white/5">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={3}
                    placeholder="Ask Nova anything..."
                    className="max-h-[180px] min-h-[80px] w-full resize-none border-0 bg-transparent px-2 py-2 text-base text-slate-100 outline-none placeholder:text-slate-500"
                  />

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="rounded-full border border-white/10 px-2 py-1">Fast</span>
                      <span className="rounded-full border border-white/10 px-2 py-1">Creative</span>
                    </div>

                    <button
                      onClick={() => sendMessage()}
                      disabled={isLoading || !input.trim()}
                      className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isLoading ? 'Thinking...' : 'Send'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
