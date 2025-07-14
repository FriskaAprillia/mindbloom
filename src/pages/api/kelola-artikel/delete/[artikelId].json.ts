// src/pages/api/kelola-artikel/delete/[artikelId].json.ts
import type { APIRoute } from "astro";
import { supabaseAdmin } from "../../../../lib/supabaseServer";

export const prerender = false;

export const DELETE: APIRoute = async ({ params }) => {
   const artikelId = params.artikelId;

   if (!artikelId) {
      return new Response(
         JSON.stringify({ error: "ID artikel tidak ditemukan." }),
         { status: 400, headers: { "Content-Type": "application/json" } }
      );
   }

   try {
      const { error } = await supabaseAdmin
         .from("artikel")
         .delete()
         .eq("idartikel", artikelId);

      if (error) {
         throw error;
      }

      return new Response(
         JSON.stringify({
            message: `Artikel dengan ID ${artikelId} berhasil dihapus.`,
         }),
         { status: 200, headers: { "Content-Type": "application/json" } }
      );
   } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Gagal menghapus artikel:", errorMessage);
      return new Response(
         JSON.stringify({ error: "Gagal menghapus artikel." }),
         { status: 500, headers: { "Content-Type": "application/json" } }
      );
   }
};
