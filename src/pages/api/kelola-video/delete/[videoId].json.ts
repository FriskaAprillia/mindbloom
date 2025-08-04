// src/pages/api/kelola-artikel/delete/[artikelId].json.ts
import type { APIRoute } from "astro";
import { supabaseAdmin } from "../../../../lib/supabaseServer";

export const prerender = false;

export const DELETE: APIRoute = async ({ params }) => {
   const videoId = params.videoId;

   if (!videoId) {
      return new Response(
         JSON.stringify({ error: "ID video tidak ditemukan." }),
         { status: 400, headers: { "Content-Type": "application/json" } }
      );
   }

   try {
      const { error } = await supabaseAdmin
         .from("video")
         .delete()
         .eq("idvideo", videoId);

      if (error) {
         throw error;
      }

      return new Response(
         JSON.stringify({
            message: `Video dengan ID ${videoId} berhasil dihapus.`,
         }),
         { status: 200, headers: { "Content-Type": "application/json" } }
      );
   } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Gagal menghapus video:", errorMessage);
      return new Response(
         JSON.stringify({ error: "Gagal menghapus video" }),
         { status: 500, headers: { "Content-Type": "application/json" } }
      );
   }
};
