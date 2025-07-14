import { supabaseAdmin } from "../../../lib/supabaseServer";
import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
   try {
      const data = await request.json();

      const { juduledukasi, isiedukasi } = data;

      // Generate ID artikel
      const idedukasi = generateId(5); // ID acak 5 karakter

      // Simpan ke tabel 'artikel' dan ambil kembali data yang baru dimasukkan
      const { data: inserted, error } = await supabaseAdmin
         .from("edukasi")
         .insert([
            {
               idedukasi,
               juduledukasi,
               isiedukasi
            },
         ])
         .select()
         .single(); // ambil baris yang baru dimasukkan

      if (error) throw error;

      return new Response(
         JSON.stringify({
            message: "edukasi berhasil ditambahkan!",
            artikel: inserted,
         }),
         { status: 201, headers: { "Content-Type": "application/json" } }
      );
   } catch (error) {
      console.error("Error:", error);
      return new Response(
         JSON.stringify({
            message: "edukasi menambahkan artikel!",
         }),
         { status: 500, headers: { "Content-Type": "application/json" } }
      );
   }
};

function generateId(length: number): string {
   return Math.random().toString(36).substr(2, length);
}
