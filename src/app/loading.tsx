export default function Loading() {
  return (
    <div className="flex h-dvh flex-col bg-background pt-[env(safe-area-inset-top)] text-foreground">
      <div className="h-1 shrink-0 bg-accent" aria-hidden="true" />
      <div className="flex min-h-0 flex-1">
        <div className="hidden w-72 shrink-0 flex-col border-r border-line bg-sidebar p-4 md:flex">
          <div className="h-10 w-36 animate-pulse rounded-xl bg-line" />
          <div className="mt-5 h-11 animate-pulse rounded-xl bg-accent/15" />
          <div className="mt-6 space-y-2">
            <div className="h-11 animate-pulse rounded-xl bg-line" />
            <div className="h-11 animate-pulse rounded-xl bg-line" />
            <div className="h-11 w-4/5 animate-pulse rounded-xl bg-line" />
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="border-b border-line px-4 py-4 sm:px-6">
            <div className="mx-auto max-w-3xl">
              <div className="h-4 w-40 animate-pulse rounded bg-line" />
              <p className="mt-2 text-xs text-muted">Loading conversations…</p>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center px-6">
            <p className="text-sm text-muted">Loading…</p>
          </div>
        </div>
      </div>
    </div>
  );
}
