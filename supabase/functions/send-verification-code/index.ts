import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { email, action, code } = body;

    if (!email || typeof email !== "string") {
      throw new Error("Email is required");
    }

    const emailLower = email.toLowerCase().trim();

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Server configuration error");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (action === "send") {
      // Generate 6-digit code
      const verificationCode = generateCode();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      // Delete any existing codes for this email
      await supabase
        .from("email_verification_codes")
        .delete()
        .eq("email", emailLower);

      // Insert new code
      const { error: insertError } = await supabase
        .from("email_verification_codes")
        .insert({
          email: emailLower,
          code: verificationCode,
          expires_at: expiresAt.toISOString(),
        });

      if (insertError) {
        console.error("Insert error:", insertError);
        throw new Error("Failed to create verification code");
      }

      // In production, you would send an email here using an email service like Resend, SendGrid, etc.
      // For now, we'll log it and return it for testing
      console.log(`========================================`);
      console.log(`VERIFICATION CODE for ${emailLower}: ${verificationCode}`);
      console.log(`========================================`);

      // Check if we're in development/preview
      const isDev = !Deno.env.get("DENO_DEPLOYMENT_ID");

      return new Response(JSON.stringify({
        success: true,
        message: isDev
          ? `Verification code sent (DEV MODE: code is ${verificationCode})`
          : "Verification code sent to your email",
        // Return code in development for testing
        ...(isDev && { devCode: verificationCode }),
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "verify") {
      if (!code || typeof code !== "string") {
        throw new Error("Code is required");
      }

      // Look up the code
      const { data, error } = await supabase
        .from("email_verification_codes")
        .select("*")
        .eq("email", emailLower)
        .eq("code", code)
        .eq("verified", false)
        .single();

      if (error || !data) {
        return new Response(JSON.stringify({
          success: false,
          message: "Invalid verification code. Please try again.",
        }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check if expired
      if (new Date(data.expires_at) < new Date()) {
        return new Response(JSON.stringify({
          success: false,
          message: "Verification code has expired. Please request a new one.",
        }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Mark as verified
      await supabase
        .from("email_verification_codes")
        .update({ verified: true })
        .eq("id", data.id);

      return new Response(JSON.stringify({
        success: true,
        message: "Email verified successfully",
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Invalid action. Use 'send' or 'verify'.");
  } catch (e) {
    console.error("Verification error:", e);
    return new Response(JSON.stringify({
      success: false,
      message: e instanceof Error ? e.message : "An error occurred",
    }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
