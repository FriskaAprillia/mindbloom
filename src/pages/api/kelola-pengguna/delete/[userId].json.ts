import type { APIRoute } from "astro";
import { supabaseAdmin } from "../../../../lib/supabaseServer"; 


export const prerender = false;

export const DELETE: APIRoute = async ({ params, request }) => {
  const userIdToDelete = params.userId; // Ini adalah ID pengguna yang akan dihapus

  if (!userIdToDelete) {
    return new Response(
      JSON.stringify({
        error: "User ID is required.",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // --- Langkah 1: Hapus data pengguna dari tabel 'profiles' atau tabel pengguna kustom Anda ---
    // ASUMSI: Anda memiliki tabel bernama 'profiles' (atau sejenisnya)
    // yang memiliki kolom 'id' yang sesuai dengan user ID dari auth.users.
    // Jika nama tabel atau kolom ID berbeda, sesuaikan di sini.

    const { error: profileError } = await supabaseAdmin
      .from('pengguna') // Ganti 'profiles' dengan nama tabel pengguna kustom Anda
      .delete()
      .eq('idpengguna', userIdToDelete); // Ganti 'id' dengan nama kolom yang menyimpan user ID

    if (profileError) {
      console.error(`Error deleting user profile from database: ${profileError.message}`);
      return new Response(
        JSON.stringify({
          error: `Failed to delete user profile: ${profileError.message}`,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // --- Langkah 2: Hapus pengguna dari auth.users (Supabase Authentication) ---
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.deleteUser(userIdToDelete);

    if (authError) {
        // Cek apakah errornya adalah "user not found" atau serupa
        // Pesan error Supabase bisa bervariasi, periksa dokumentasi atau coba log errornya.
        // Contoh umum: "User not found" atau "User already deleted"
        if (authError.message.includes("User not found") || authError.message.includes("user_not_found")) {
            console.warn(`User with ID ${userIdToDelete} was not found in auth.users, but profile was deleted.`);
            // Jika pengguna tidak ditemukan, kita bisa anggap ini sebagai sukses parsial
            // atau setidaknya bukan error 500, karena tujuan akhir tercapai (pengguna tidak ada di auth).
            // Lanjutkan ke respons sukses
        } else {
            // Ini adalah error otentikasi yang sebenarnya dan harus dilaporkan
            console.error(`Error deleting user from authentication: ${authError.message}`);
            return new Response(
                JSON.stringify({
                    error: `Failed to delete user from authentication: ${authError.message}`,
                }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }
    }

    // Jika kedua operasi (atau setidaknya penghapusan profil dan auth user tidak ditemukan) berhasil
    return new Response(
      JSON.stringify({
        message: `User with ID ${userIdToDelete} and their profile deleted successfully.`,
        auth_data: authData, // Biasanya null setelah penghapusan berhasil
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("An unexpected error occurred during user deletion:", err);
    return new Response(
      JSON.stringify({
        error: "An unexpected error occurred.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};