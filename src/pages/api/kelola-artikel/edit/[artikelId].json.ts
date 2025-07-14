import type { APIRoute } from "astro";
import { supabaseAdmin } from "../../../../lib/supabaseServer";

export const prerender = false;

export const PUT: APIRoute = async ({ request, params }) => {
  const artikelId = params.artikelId;

  if (!artikelId) {
    return new Response(
      JSON.stringify({ error: "ID artikel wajib disertakan." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await request.json();
    const { judulartikel, linkartikel, fotoartikel } = body;

    // Validasi sederhana
    if (!judulartikel || !linkartikel || !fotoartikel) {
      return new Response(
        JSON.stringify({ error: "Semua field wajib diisi." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { error } = await supabaseAdmin
      .from("artikel")
      .update({
        judulartikel,
        linkartikel,
        fotoartikel,
      })
      .eq("idartikel", artikelId);

    if (error) {
      console.error("❌ Gagal update artikel:", error.message);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "Artikel berhasil diperbarui!" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("❌ Error tak terduga saat update artikel:", error);
    return new Response(
      JSON.stringify({ error: "Terjadi kesalahan server." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
