"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

type Conversation = {
  id: string;
  name: string;
};

export function AppShell({
  conversations,
  activeId,
  activeName,
  children,
}: {
  conversations: Conversation[];
  activeId?: string;
  activeName?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [desktop, setDesktop] = useState<boolean | null>(null);
  const title = activeId ? (activeName ?? "Conversation") : "New conversation";

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="flex h-dvh flex-col bg-background pt-[env(safe-area-inset-top)] text-foreground">
      <div className="h-1 shrink-0 bg-accent" aria-hidden="true" />
      <div className="flex min-h-0 flex-1">
        {open ? (
          <button
            type="button"
            className="fixed inset-0 z-20 bg-[#1e1b16]/40 md:hidden"
            aria-label="Close conversations"
            onClick={() => setOpen(false)}
          />
        ) : null}

        <nav
          aria-label="Conversations"
          inert={desktop === false && !open ? true : undefined}
          className={`fixed bottom-0 left-0 top-[env(safe-area-inset-top)] z-30 flex w-[min(18.5rem,88vw)] min-h-0 flex-col border-r border-line bg-sidebar shadow-xl transition-transform duration-200 motion-reduce:transition-none md:static md:inset-auto md:w-72 md:translate-x-0 md:shadow-none ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-start justify-between gap-3 px-4 pb-2 pt-5">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-white">
                <DocumentIcon />
              </span>
              <span>
                <span className="block text-[15px] font-semibold tracking-tight">ChatRAG</span>
                <span className="block text-xs text-muted">Company documents</span>
              </span>
            </div>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-xl text-foreground hover:bg-background md:hidden"
              aria-label="Close conversations"
              onClick={() => setOpen(false)}
            >
              <CloseIcon />
            </button>
          </div>

          <div className="px-3 py-3">
            <Link
              href="/"
              aria-label="+ New chat"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl bg-accent px-3 py-3 text-sm font-medium text-white hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <PlusIcon />
              New chat
            </Link>
          </div>

          <p className="px-4 pb-2 text-xs font-medium tracking-wide text-muted uppercase">Recent</p>
          <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
            {conversations.length === 0 ? (
              <p className="px-2 py-3 text-sm text-muted">No conversations yet</p>
            ) : (
              <ul className="space-y-1">
                {conversations.map((conversation) => {
                  const active = conversation.id === activeId;
                  return (
                    <li key={conversation.id}>
                      <Link
                        href={`/?session=${conversation.id}`}
                        title={conversation.name}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setOpen(false)}
                        className={`block truncate rounded-xl px-3 py-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                          active
                            ? "bg-accent-soft font-medium text-accent"
                            : "text-foreground hover:bg-background"
                        }`}
                      >
                        {conversation.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <p className="border-t border-line px-4 py-3 text-xs text-muted">Internal assistant</p>
        </nav>

        <section className="flex min-h-0 min-w-0 flex-1 flex-col">
          <header className="shrink-0 border-b border-line bg-sidebar/80 px-3 py-3 sm:px-6">
            <div className="mx-auto flex max-w-3xl items-center gap-2">
              <button
                type="button"
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-foreground hover:bg-background md:hidden"
                aria-label="Open conversations"
                aria-expanded={open}
                onClick={() => setOpen(true)}
              >
                <MenuIcon />
              </button>
              <div className="min-w-0">
                <h1 className="truncate text-[15px] font-semibold tracking-tight">{title}</h1>
                <p className="truncate text-xs text-muted">From your company documents</p>
              </div>
            </div>
          </header>
          {children}
        </section>
      </div>
    </div>
  );
}

function DocumentIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 3.75h7.2L19 8.4V20.25H7z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.2 3.75V8.4H19" />
      <path strokeLinecap="round" d="M9.5 12.5h6M9.5 16h4" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" d="M12 5v14M5 12h14" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
