import type { APIRoute } from "astro";
import { supabaseAdmin } from "../../../lib/supabaseServer";
export const prerender = false

export const GET: APIRoute = async () => {
try {
    // Mengambil semua data dari tabel 'materi'
    // Gunakan supabaseAdmin untuk memastikan akses penuh tanpa terpengaruh RLS
    // (karena ini adalah fungsi admin).
    const { data, error } = await supabaseAdmin
      .from('pengguna') // Sesuaikan dengan nama tabel materi Anda di Supabase
      .select('*'); // Pilih kolom yang Anda butuhkan, minimal ID dan nama materi

    if (error) {
      console.error('Gagal mengambil data pengguna', error.message);
      return new Response(
        JSON.stringify({
          message: 'Gagal mengambil data pengguna',
          error: error.message,
        }),
        {
          status: 500, // Internal Server Error
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Mengembalikan daftar materi sebagai JSON
    return new Response(
      JSON.stringify({
        message: 'Data pengguna berhasil di ambil',
        pengguna: data, // Array objek materi
      }),
      {
        status: 200, // OK
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err: any) {
    console.error('API Error untuk mengambil semua data pengguna:', err.message);
    return new Response(
      JSON.stringify({
        message: 'An unexpected error occurred while fetching materi',
        error: err.message,
      }),
      {
        status: 500, // Internal Server Error
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};