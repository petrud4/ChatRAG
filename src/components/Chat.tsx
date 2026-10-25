"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Message } from "@/lib/ragflow";

export function Chat({ sessionId, history }: { sessionId?: string; history: Message[] }) {
  const router = useRouter();
  const [messages, setMessages] = useState(history);
  const [question, setQuestion] = useState("");
  const [waiting, setWaiting] = useState(false);

  async function send(event: React.FormEvent) {
    event.preventDefault();
    setMessages([...messages, { role: "user", content: question }]);
    setQuestion("");
    setWaiting(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, sessionId }),
    });
    const data = await response.json();

    setMessages((current) => [...current, { role: "assistant", content: data.answer }]);
    setWaiting(false);
    // A new chat got a session: move to its URL, so it shows up in the list.
    if (!sessionId) router.push(`/?session=${data.sessionId}`);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        {messages.length === 0 && !waiting ? (
          <div className="flex h-full flex-col items-center justify-center px-6 py-10 text-center">
            <span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-accent text-white shadow-sm">
              <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 3.75h7.2L19 8.4V20.25H7z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.2 3.75V8.4H19" />
                <path strokeLinecap="round" d="M9.5 12.5h6M9.5 16h4" />
              </svg>
            </span>
            <h2 className="text-2xl font-semibold tracking-tight">Ask about company documents</h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
              ChatRAG reads your company&apos;s documents and answers in plain language. Try a policy, a process, or a document by name.
            </p>
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6">
            {messages.map((message, i) => {
              const fromUser = message.role === "user";
              return (
                <div key={i} className={`flex ${fromUser ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[85%] sm:max-w-[36rem]">
                    <p className={`mb-1.5 text-xs font-medium text-muted ${fromUser ? "text-right" : ""}`}>
                      {fromUser ? "You" : "ChatRAG"}
                    </p>
                    <div
                      className={`whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-[15px] leading-6 ${
                        fromUser
                          ? "rounded-br-md bg-accent text-white"
                          : "rounded-bl-md border border-line bg-card text-foreground shadow-sm"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              );
            })}
            {waiting && (
              <p className="flex items-center gap-2 text-sm text-muted">
                <span className="size-2 animate-pulse rounded-full bg-accent" aria-hidden="true" />
                Looking through the documents…
              </p>
            )}
          </div>
        )}
      </div>

      <form
        onSubmit={send}
        className="shrink-0 border-t border-line bg-sidebar/90 px-3 pt-3 shadow-[0_-8px_24px_rgb(30_27_22/0.04)] pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6"
      >
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question…"
            aria-label="Question"
            className="min-w-0 flex-1 rounded-xl border border-line bg-card px-4 py-3 text-base text-foreground outline-none placeholder:text-muted/80 focus:border-accent focus:ring-4 focus:ring-accent/15"
          />
          <button
            disabled={!question || waiting}
            className="rounded-xl bg-accent px-4 py-3 text-sm font-medium text-white hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
