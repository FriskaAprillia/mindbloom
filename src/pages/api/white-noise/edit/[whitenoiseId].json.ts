import type { APIRoute } from "astro";
import { supabaseAdmin } from "../../../../lib/supabaseServer";

export const prerender = false;

export const PUT: APIRoute = async ({ request, params }) => {
  const whitenoiseid = params.whitenoiseId;

  if (!whitenoiseid) {
    return new Response(
      JSON.stringify({ error: "ID whitenoiseid wajib disertakan." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await request.json();
    const { namawhitenoise, fileaudio,fotowhitenoise } = body;

    // Validasi sederhana
    if (!namawhitenoise || !fileaudio || !fotowhitenoise) {
      return new Response(
        JSON.stringify({ error: "Semua field wajib diisi." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { error } = await supabaseAdmin
      .from("white_noise")
      .update({
        namawhitenoise,
        fileaudio,
        fotowhitenoise
        
      })
      .eq("idwhitenoise", whitenoiseid);

    if (error) {
      console.error("❌ Gagal update whitenoise:", error.message);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "whitenoise berhasil diperbarui!" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("❌ Error tak terduga saat update whitenoise:", error);
    return new Response(
      JSON.stringify({ error: "Terjadi kesalahan server." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
