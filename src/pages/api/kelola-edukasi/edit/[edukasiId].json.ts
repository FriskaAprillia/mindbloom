import type { APIRoute } from "astro";
import { supabaseAdmin } from "../../../../lib/supabaseServer";

export const prerender = false;

export const PUT: APIRoute = async ({ request, params }) => {
  const edukasiId = params.edukasiId;

  if (!edukasiId) {
    return new Response(
      JSON.stringify({ error: "ID edukasi wajib disertakan." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await request.json();
    const { juduledukasi, isiedukasi } = body;

    // Validasi sederhana
    if (!juduledukasi || !isiedukasi) {
      return new Response(
        JSON.stringify({ error: "Semua field wajib diisi." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { error } = await supabaseAdmin
      .from("edukasi")
      .update({
        juduledukasi,
        isiedukasi,
        
      })
      .eq("idedukasi", edukasiId);

    if (error) {
      console.error("❌ Gagal update edukasi:", error.message);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "edukasi berhasil diperbarui!" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("❌ Error tak terduga saat update edukasi:", error);
    return new Response(
      JSON.stringify({ error: "Terjadi kesalahan server." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
