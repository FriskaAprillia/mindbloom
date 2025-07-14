// components/ForgotPassword.jsx
import { useState } from "react";
import { supabaseClient } from "../../lib/supabaseClient";

export default function ForgotPassword() {
   const [email, setEmail] = useState("");
   const [message, setMessage] = useState("");

   const handleResetPassword = async (e) => {
      e.preventDefault();
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
         redirectTo: "http://localhost:4321/autentikasi/update-password", // Ubah ke domain production kamu
      });

      if (error) {
         setMessage(`❌ Gagal: ${error.message}`);
      } else {
         setMessage("✅ Link reset sudah dikirim ke email kamu!");
         setEmail("");
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
               <div className="text-5xl mb-2">📧</div>
               <h2 className="text-3xl font-bold text-[#4A4A4A]">
                  Reset Password
               </h2>
               <p className="text-sm text-[#6B6B6B] mt-1">
                  Kami akan kirimkan link reset ke email kamu!
               </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-5">
               <input
                  type="email"
                  placeholder="Alamat email kamu"
                  className="w-full px-4 py-3 border border-[#C0C9EE] bg-[#F5F6FA] text-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#898AC4]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
               />
               <button
                  type="submit"
                  className="w-full bg-[#898AC4] hover:bg-[#7a7bb0] text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105"
               >
                  Kirim Link Reset
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
