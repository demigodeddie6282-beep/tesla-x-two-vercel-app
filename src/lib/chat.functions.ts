import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ADMIN_ID = "Demigod6282";
const ADMIN_PW = "Original6282";

const creds = z.object({ id: z.string(), pw: z.string() });
function check(c: { id: string; pw: string }) {
  if (c.id !== ADMIN_ID || c.pw !== ADMIN_PW) throw new Error("Invalid admin credentials");
}

export const adminListConversations = createServerFn({ method: "POST" })
  .inputValidator((d) => creds.parse(d))
  .handler(async ({ data }) => {
    check(data);
    const { data: rows, error } = await supabaseAdmin
      .from("chat_messages")
      .select("user_id, body, sender, created_at, read_by_admin")
      .order("created_at", { ascending: false })
      .limit(2000);
    if (error) throw new Error(error.message);
    const map = new Map<string, { user_id: string; last: string; sender: string; created_at: string; unread: number }>();
    for (const r of rows ?? []) {
      const existing = map.get(r.user_id);
      if (!existing) {
        map.set(r.user_id, { user_id: r.user_id, last: r.body, sender: r.sender, created_at: r.created_at, unread: 0 });
      }
      if (r.sender === "user" && !r.read_by_admin) {
        const e = map.get(r.user_id)!;
        e.unread += 1;
      }
    }
    return { conversations: Array.from(map.values()) };
  });

const listSchema = creds.extend({ user_id: z.string().uuid() });
export const adminListMessages = createServerFn({ method: "POST" })
  .inputValidator((d) => listSchema.parse(d))
  .handler(async ({ data }) => {
    check({ id: data.id, pw: data.pw });
    const { data: rows, error } = await supabaseAdmin
      .from("chat_messages")
      .select("*")
      .eq("user_id", data.user_id)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    await supabaseAdmin
      .from("chat_messages")
      .update({ read_by_admin: true })
      .eq("user_id", data.user_id)
      .eq("sender", "user");
    return { messages: rows ?? [] };
  });

const sendSchema = creds.extend({ user_id: z.string().uuid(), body: z.string().min(1).max(4000) });
export const adminSendMessage = createServerFn({ method: "POST" })
  .inputValidator((d) => sendSchema.parse(d))
  .handler(async ({ data }) => {
    check({ id: data.id, pw: data.pw });
    const { error } = await supabaseAdmin.from("chat_messages").insert({
      user_id: data.user_id,
      sender: "admin",
      body: data.body,
      read_by_admin: true,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
