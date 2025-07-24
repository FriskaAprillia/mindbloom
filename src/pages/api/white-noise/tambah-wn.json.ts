// src/pages/api/white-noise/tambah-wn.json.ts
import { supabaseAdmin } from "../../../lib/supabaseServer";
import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
   try {
      const data = await request.json();

      const { namawhitenoise, fileaudio, fotowhitenoise } = data;

      // Generate ID whitenoise
      const idwhitenoise = generateId(5); // ID acak 5 karakter

      // Simpan ke tabel 'white_noise' dan ambil kembali data yang baru dimasukkan
      const { data: inserted, error } = await supabaseAdmin
         .from("white_noise")
         .insert([
            {
               idwhitenoise,
               namawhitenoise,
               fileaudio,
               fotowhitenoise,
            },
         ])
         .select()
         .single(); // ambil baris yang baru dimasukkan

      if (error) throw error;

      return new Response(
         JSON.stringify({
            message: "whitenoise berhasil ditambahkan!",
            white_noise: inserted, // FIX: Mengubah 'whitenoise' menjadi 'white_noise' agar konsisten
         }),
         { status: 201, headers: { "Content-Type": "application/json" } }
      );
   } catch (error) {
      console.error("Error:", error);
      return new Response(
         JSON.stringify({
            message: "Gagal menambahkan whitenoise!",
         }),
         { status: 500, headers: { "Content-Type": "application/json" } }
      );
   }
};

function generateId(length: number): string {
   return Math.random().toString(36).substr(2, length);
}