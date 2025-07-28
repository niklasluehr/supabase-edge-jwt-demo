import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { jwtVerify } from "https://esm.sh/jose@5.9.6";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const HS256_SECRET = Deno.env.get("HS256_SECRET")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  try {
    const { token, topic } = await req.json();

    // JWT verifizieren
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(HS256_SECRET)
    );

    const userId = payload.sub;
    if (!userId) {
      return new Response("Token invalid: no sub (user ID)", { status: 401 });
    }

    // Session speichern
    const { error } = await supabase.from("game_sessions").insert([
      {
        user_id: userId,
        topic: topic,
      },
    ]);

    if (error) {
      console.error(error);
      return new Response("Error writing session", { status: 500 });
    }

    return new Response("Session saved!", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Unauthorized", { status: 401 });
  }
});
