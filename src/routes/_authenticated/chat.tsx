import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/chat")({
  head: () => ({ meta: [{ title: "Live Chat — Tesla" }] }),
  component: ChatPage,
});

type Msg = { id: string; sender: "user" | "admin"; body: string; created_at: string };

function ChatPage() {
  const { session } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  async function load() {
    if (!session?.user) return;
    const { data } = await supabase
      .from("chat_messages")
      .select("id, sender, body, created_at")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: true });
    setMessages((data ?? []) as Msg[]);
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, [session?.user?.id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || !session?.user) return;
    setSending(true);
    const text = body.trim();
    setBody("");
    const { error } = await supabase.from("chat_messages").insert({
      user_id: session.user.id,
      sender: "user",
      body: text,
    });
    setSending(false);
    if (error) {
      setBody(text);
      return;
    }
    load();
  }

  return (
    <div className="pt-24 pb-10 min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">Live Chat</p>
            <h1 className="text-3xl font-semibold tracking-tight">Talk to a strategist</h1>
          </div>
          <Link to="/account" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">Account</Link>
        </div>

        <div className="rounded-3xl border border-border bg-background flex flex-col h-[70vh]">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center mt-10">
                Send a message and a strategist will get back to you shortly.
              </p>
            ) : (
              messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${m.sender === "user" ? "bg-primary text-primary-foreground" : "bg-accent text-foreground"}`}>
                    <p className="whitespace-pre-wrap break-words">{m.body}</p>
                    <p className={`text-[10px] mt-1 opacity-70`}>{new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={endRef} />
          </div>
          <form onSubmit={send} className="border-t border-border p-3 flex gap-2">
            <input
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Type your message…"
              className="flex-1 px-4 py-3 rounded-full bg-accent text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <button
              type="submit"
              disabled={sending || !body.trim()}
              className="px-5 py-3 rounded-full bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-widest disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
