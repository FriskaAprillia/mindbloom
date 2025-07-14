import { supabaseAdmin } from "../../../lib/supabaseServer";
import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
   try {
      const data = await request.json();

      const { judulartikel, linkartikel, fotoartikel } = data;

      // Generate ID artikel
      const idartikel = generateId(5); // ID acak 5 karakter

      // Simpan ke tabel 'artikel' dan ambil kembali data yang baru dimasukkan
      const { data: inserted, error } = await supabaseAdmin
         .from("artikel")
         .insert([
            {
               idartikel,
               judulartikel,
               linkartikel,
               fotoartikel,
            },
         ])
         .select()
         .single(); // ambil baris yang baru dimasukkan

      if (error) throw error;

      return new Response(
         JSON.stringify({
            message: "Artikel berhasil ditambahkan!",
            artikel: inserted,
         }),
         { status: 201, headers: { "Content-Type": "application/json" } }
      );
   } catch (error) {
      console.error("Error:", error);
      return new Response(
         JSON.stringify({
            message: "Gagal menambahkan artikel!",
         }),
         { status: 500, headers: { "Content-Type": "application/json" } }
      );
   }
};

function generateId(length: number): string {
   return Math.random().toString(36).substr(2, length);
}
