import { useState, useEffect } from "react";
import { navigate } from "astro:transitions/client"; // atau navigate dari astro:transitions jika pakai Astro
import { supabaseClient } from "../../lib/supabaseClient";

export default function UpdatePassword() {
   const [newPassword, setNewPassword] = useState("");
   const [message, setMessage] = useState("");

   useEffect(() => {
      const checkSession = async () => {
         const { data } = await supabaseClient.auth.getSession();
         if (!data.session) {
            // kalau tidak ada session, redirect ke login
            navigate("/autentikasi/login");
         }
      };
      checkSession();
   }, [navigate]);

   const handleUpdatePassword = async (e) => {
      e.preventDefault();
      const { error } = await supabaseClient.auth.updateUser({
         password: newPassword,
      });

      if (error) {
         setMessage(`❌ Gagal ganti password: ${error.message}`);
      } else {
         setMessage("✅ Password berhasil diubah! Mengarahkan ke login...");

         // Logout user supaya token tidak bisa dipakai ulang
         await supabaseClient.auth.signOut();

         // Redirect ke login setelah 3 detik
         setTimeout(() => {
            navigate("/autentikasi/login");
         }, 3000);
      }
   };

   return (
      <div
         className="min-h-screen flex items-center justify-center px-4"
         style={{
            background: "linear-gradient(to bottom, #FFF2E0, #C0C9EE)",
            fontFamily: "Inter, sans-serif",
         }}
      >
         <div className="w-full max-w-md bg-white bg-opacity-90 backdrop-blur-md shadow-xl rounded-3xl p-8 border border-[#A2AADB]">
            <div className="text-center mb-6">
               <div className="text-5xl mb-2">🔐</div>
               <h2 className="text-3xl font-bold text-[#4A4A4A]">
                  Reset Password
               </h2>
               <p className="text-sm text-[#6B6B6B] mt-1">
                  Masukkan password baru kamu
               </p>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-5">
               <input
                  type="password"
                  placeholder="Password baru kamu"
                  className="w-full px-4 py-3 border border-[#C0C9EE] bg-[#F5F6FA] text-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#898AC4]"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
               />
               <button
                  type="submit"
                  className="w-full bg-[#898AC4] hover:bg-[#7a7bb0] text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105"
               >
                  Simpan Password Baru
               </button>
            </form>

            {message && (
               <div className="mt-6 text-center text-sm font-medium text-gray-700">
                  {message.startsWith("✅") ? (
                     <p className="text-green-600">{message}</p>
                  ) : (
                     <p className="text-red-500">{message}</p>
                  )}
               </div>
            )}
         </div>
      </div>
   );
}
