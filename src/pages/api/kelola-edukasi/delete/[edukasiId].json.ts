// src/pages/api/kelola-artikel/delete/[artikelId].json.ts
import type { APIRoute } from "astro";
import { supabaseAdmin } from "../../../../lib/supabaseServer";

export const prerender = false;

export const DELETE: APIRoute = async ({ params }) => {
   const edukasiId = params.edukasiId;

   if (!edukasiId) {
      return new Response(
         JSON.stringify({ error: "ID edukasi tidak ditemukan." }),
         { status: 400, headers: { "Content-Type": "application/json" } }
      );
   }

   try {
      const { error } = await supabaseAdmin
         .from("edukasi")
         .delete()
         .eq("idedukasi", edukasiId);

      if (error) {
         throw error;
      }

      return new Response(
         JSON.stringify({
            message: `edukasi dengan ID ${edukasiId} berhasil dihapus.`,
         }),
         { status: 200, headers: { "Content-Type": "application/json" } }
      );
   } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Gagal menghapus edukasi:", errorMessage);
      return new Response(
         JSON.stringify({ error: "Gagal menghapus edukasi." }),
         { status: 500, headers: { "Content-Type": "application/json" } }
      );
   }
};
