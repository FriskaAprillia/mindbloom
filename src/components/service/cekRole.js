import { supabaseClient } from "../../lib/supabaseClient";
// import { navigate } from 'astro:transitions/client';

const cekRoleUser = async (navigate) => {
   try {
      const { data, error: sessionError } = await supabaseClient.auth.getSession();
      const session = data.session;

      if (!session?.user?.email) {
         console.warn("Session atau email tidak ditemukan");
         return null;
      }

      const { data: pengguna, error } = await supabaseClient
         .from("pengguna")
         .select("*")
         .eq("emailpengguna", session.user.email);

      if (error) throw error;

      const user = pengguna[0];
      if (!user) {
         console.warn("Data pengguna tidak ditemukan");
         return null;
      }

      console.log("ROLE:", user.role);

      // Redirect berdasarkan role
      if (user.role === "admin") {
         navigate("/admin-dashboard");
         return null; // atau return user kalau kamu masih mau simpan datanya
      }

      // Kalau user biasa, lanjut biasa
      navigate("/mindbloom-home")
      return user;
   } catch (error) {
      console.error("Gagal ambil user:", error);
      throw error;
   }
};

export { cekRoleUser };
