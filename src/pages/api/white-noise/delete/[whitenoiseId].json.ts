// src/pages/api/kelola-artikel/delete/[artikelId].json.ts
import type { APIRoute } from "astro";
import { supabaseAdmin } from "../../../../lib/supabaseServer";

export const prerender = false;

export const DELETE: APIRoute = async ({ params }) => {
   const whitenoiseid = params.whitenoiseId;

   if (!whitenoiseid) {
      return new Response(
         JSON.stringify({ error: "ID whitenoise tidak ditemukan." }),
         { status: 400, headers: { "Content-Type": "application/json" } }
      );
   }

   try {
      const { error } = await supabaseAdmin
         .from("white_noise")
         .delete()
         .eq("idwhitenoise", whitenoiseid);

      if (error) {
         throw error;
      }

      return new Response(
         JSON.stringify({
            message: `whitenoise dengan ID ${whitenoiseid} berhasil dihapus.`,
         }),
         { status: 200, headers: { "Content-Type": "application/json" } }
      );
   } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Gagal menghapus whitenoise:", errorMessage);
      return new Response(
         JSON.stringify({ error: "Gagal menghapus whitenoise." }),
         { status: 500, headers: { "Content-Type": "application/json" } }
      );
   }
};
