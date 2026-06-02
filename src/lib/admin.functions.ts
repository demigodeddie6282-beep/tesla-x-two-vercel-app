import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ADMIN_ID = "Demigod6282";
const ADMIN_PW = "Original6282";

const credSchema = z.object({
  id: z.string().min(1).max(64),
  pw: z.string().min(1).max(128),
});

function checkCreds(c: { id: string; pw: string }) {
  if (c.id !== ADMIN_ID || c.pw !== ADMIN_PW) {
    throw new Error("Invalid admin credentials");
  }
}

export const adminListTransactions = createServerFn({ method: "POST" })
  .inputValidator((d) => credSchema.parse(d))
  .handler(async ({ data }) => {
    checkCreds(data);
    const { data: txs, error } = await supabaseAdmin
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return { transactions: txs ?? [] };
  });

const updateSchema = credSchema.extend({
  tx_id: z.string().uuid(),
  status: z.enum(["pending", "paid", "fulfilled", "cancelled"]),
});

export const adminUpdateTransactionStatus = createServerFn({ method: "POST" })
  .inputValidator((d) => updateSchema.parse(d))
  .handler(async ({ data }) => {
    checkCreds({ id: data.id, pw: data.pw });
    const { error } = await supabaseAdmin
      .from("transactions")
      .update({ status: data.status })
      .eq("id", data.tx_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
