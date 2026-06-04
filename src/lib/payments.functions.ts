import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const schema = z.object({
  amountUsd: z.number().positive().max(10_000_000),
  itemName: z.string().min(1).max(200),
  category: z.enum(["crypto", "ipo", "vehicle", "robot"]),
  quantity: z.number().positive(),
  redirectUrl: z.string().url(),
  customerName: z.string().min(1).max(120).optional(),
});

export const createFlutterwaveCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => schema.parse(d))
  .handler(async ({ data, context }) => {
    const secret = process.env.FLUTTERWAVE_SECRET_KEY;
    if (!secret) throw new Error("Payment provider not configured");

    const { userId } = context;
    const email = context.claims?.email ?? `user-${userId}@tesla.checkout`;
    const txRef = `TESLA-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const res = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref: txRef,
        amount: Number(data.amountUsd.toFixed(2)),
        currency: "USD",
        redirect_url: data.redirectUrl,
        customer: {
          email,
          name: data.customerName || "Tesla Customer",
        },
        customizations: {
          title: "Tesla Checkout",
          description: `${data.quantity} × ${data.itemName}`,
          logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg",
        },
        meta: {
          user_id: userId,
          category: data.category,
          item_name: data.itemName,
          quantity: data.quantity,
        },
      }),
    });

    const json = (await res.json()) as {
      status?: string;
      message?: string;
      data?: { link?: string };
    };

    if (!res.ok || json.status !== "success" || !json.data?.link) {
      throw new Error(json.message || "Failed to initiate payment");
    }

    return { link: json.data.link, txRef };
  });
