import { Chat } from "@/components/Chat";
import { AppShell } from "@/components/AppShell";
import { getSession, listSessions } from "@/lib/ragflow";

export default async function Home({ searchParams }: PageProps<"/">) {
  const { session } = await searchParams;
  const sessionId = typeof session === "string" ? session : undefined;

  const sessions = await listSessions();
  const current = sessionId ? await getSession(sessionId) : undefined;

  return (
    <AppShell
      conversations={sessions.map((item) => ({ id: item.id, name: item.name }))}
      activeId={sessionId}
      activeName={current?.name}
    >
      <Chat key={sessionId ?? "new"} sessionId={sessionId} history={current?.messages ?? []} />
    </AppShell>
  );
}
