import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ADMIN_ID = "Demigod6282";
const ADMIN_PW = "Original6282";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

function checkCreds(id: string, pw: string) {
  if (id !== ADMIN_ID || pw !== ADMIN_PW) throw new Error("Unauthorized");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { fn, id, pw, ...params } = body;

    if (fn === "listTransactions") {
      checkCreds(id, pw);
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return new Response(JSON.stringify({ transactions: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (fn === "updateTransaction") {
      checkCreds(id, pw);
      const { tx_id, status } = params;
      const { error } = await supabase
        .from("transactions")
        .update({ status })
        .eq("id", tx_id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (fn === "listConversations") {
      checkCreds(id, pw);
      const { data, error } = await supabase
        .from("chat_messages")
        .select("user_id, body, sender, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;

      const convs = new Map<string, { user_id: string; last: string; sender: string; created_at: string; unread: number }>();
      for (const msg of (data || [])) {
        const uid = msg.user_id;
        if (!convs.has(uid)) {
          convs.set(uid, {
            user_id: uid,
            last: msg.body.slice(0, 100),
            sender: msg.sender,
            created_at: msg.created_at,
            unread: 0,
          });
        }
        if (msg.sender === "user") {
          const c = convs.get(uid)!;
          c.unread++;
        }
      }
      return new Response(JSON.stringify({ conversations: Array.from(convs.values()) }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (fn === "listMessages") {
      checkCreds(id, pw);
      const { user_id } = params;
      const { data, error } = await supabase
        .from("chat_messages")
        .select("id, sender, body, created_at")
        .eq("user_id", user_id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return new Response(JSON.stringify({ messages: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (fn === "sendMessage") {
      checkCreds(id, pw);
      const { user_id, body: msgBody } = params;
      const { error } = await supabase
        .from("chat_messages")
        .insert({ user_id, sender: "admin", body: msgBody });
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Unknown function");
  } catch (e) {
    return new Response(JSON.stringify({ message: e instanceof Error ? e.message : "Error" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
