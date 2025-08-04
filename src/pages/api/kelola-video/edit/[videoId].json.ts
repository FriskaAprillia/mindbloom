import type { APIRoute } from "astro";
import { supabaseAdmin } from "../../../../lib/supabaseServer";

export const prerender = false;

export const PUT: APIRoute = async ({ request, params }) => {
  const videoId = params.videoId;

  if (!videoId) {
    return new Response(
      JSON.stringify({ error: "ID video wajib disertakan." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await request.json();
    const { judulvideo, linkvideo, fotovideo } = body;

    // Validasi sederhana
    if (!judulvideo || !linkvideo) {
      return new Response(
        JSON.stringify({ error: "Semua field wajib diisi." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { error } = await supabaseAdmin
      .from("video")
      .update({
        judulvideo, linkvideo, fotovideo
      })
      .eq("idvideo", videoId);

    if (error) {
      console.error("❌ Gagal update video:", error.message);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "Video berhasil diperbarui!" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("❌ Error tak terduga saat update Video:", error);
    return new Response(
      JSON.stringify({ error: "Terjadi kesalahan server." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
