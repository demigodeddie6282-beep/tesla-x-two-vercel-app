import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { amountUsd, itemName, category, quantity, redirectUrl, customerName } = body;

    if (typeof amountUsd !== "number" || amountUsd <= 0) {
      throw new Error("Invalid amount");
    }
    if (!itemName || !category || !quantity) {
      throw new Error("Missing required fields");
    }

    const secret = Deno.env.get("FLUTTERWAVE_SECRET_KEY");
    if (!secret) throw new Error("Payment provider not configured");

    const txRef = `TESLA-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const email = `checkout-${Date.now()}@tesla.checkout`;

    const res = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref: txRef,
        amount: Number(amountUsd.toFixed(2)),
        currency: "USD",
        redirect_url: redirectUrl || "https://tesla.com/account",
        customer: {
          email,
          name: customerName || "Tesla Customer",
        },
        customizations: {
          title: "Tesla Checkout",
          description: `${quantity} x ${itemName}`,
          logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg",
        },
        meta: {
          category,
          item_name: itemName,
          quantity,
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

    return new Response(JSON.stringify({ link: json.data.link, txRef }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ message: e instanceof Error ? e.message : "Error" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
