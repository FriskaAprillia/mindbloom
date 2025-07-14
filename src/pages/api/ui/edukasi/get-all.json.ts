import type { APIRoute } from "astro";
import { supabaseClient } from "../../../../lib/supabaseClient";
export const prerender = false

export async function GET() {
  const { data, error } = await supabaseClient.from("edukasi").select("*");

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ edukasi: data }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}