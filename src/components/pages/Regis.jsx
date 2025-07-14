import React, { useState, useEffect } from "react";

import registerUser from "../service/supabaseRegister";

const Regis = () => {
   // Menggunakan palet warna yang sama
   const primaryColor = "#d4bfd3"; // Warna ungu dari palet (paling atas)
   const secondaryColor = "#EDDAEC"; // Warna ungu kedua dari palet
   const lightPurpleColor = "#E9C6FA"; // Warna ungu muda ketiga dari palet
   const lightestPinkColor = "#FDE2E2"; // Warna merah muda paling bawah dari palet
   const textColor = "#4a4a4a"; // Abu-abu tua untuk teks utama
   const lightTextColor = "#6b6b6b"; // Abu-abu lebih muda untuk teks sekunder
   const buttonDarkColor = "#333333"; // Warna abu-abu gelap untuk tombol Daftar

   // State untuk form input
   const [fullName, setFullName] = useState(""); // Menggunakan fullName sesuai placeholder
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");

   // State untuk menampilkan/menyembunyikan password
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

   // State untuk pesan registrasi (sukses/gagal)
   const [successMessage, setSuccessMessage] = useState(null);
   const [errorMessage, setErrorMessage] = useState(null);

   // Handle submit form
   const handleSubmit = async (event) => {
      event.preventDefault();
      setSuccessMessage(null); // Clear previous messages
      setErrorMessage(null);

      if (password !== confirmPassword) {
         setErrorMessage("Konfirmasi kata sandi tidak cocok.");
         return;
      }

      try {
         const data = await registerUser(email, password, fullName); // Menggunakan fullName untuk username
         console.log(data);
         setSuccessMessage(
            data.message ||
               "Registrasi berhasil silahkan cek email untuk komfirmasi!"
         );
         // Opsional: reset form setelah sukses
         setFullName("");
         setEmail("");
         setPassword("");
         setConfirmPassword("");
      } catch (error) {
         console.error("Error during registration:", error);
         setErrorMessage(
            error.message || "Registrasi gagal. Silakan coba lagi."
         );
      }
   };

   return (
      <div
         className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8"
         style={{
            background: "linear-gradient(to bottom right, #FFF2E0, #C0C9EE)",
            fontFamily: "Inter, sans-serif",
         }}
      >
         <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white bg-opacity-90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
            {/* Bagian Kiri */}
            <div
               className="w-full md:w-1/2 flex flex-col justify-center items-center text-center p-10 md:p-14"
               style={{ backgroundColor: "#898AC4", color: "white" }}
            >
               <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                  Daftarkan Dirimu Hari Ini
               </h1>
               <p className="text-lg md:text-xl leading-relaxed">
                  "Kamu tidak sendirian. Kami di sini untuk mendengarkan."{" "}
                  <br />
                  Bersama MindBloom, mari tumbuh dan pulih bersama.
               </p>
            </div>

            {/* Form Registrasi */}
            <form
               onSubmit={handleSubmit}
               className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center"
            >
               <h2 className="text-3xl font-bold mb-8 text-center text-[#6F72B2]">
                  Registrasi
               </h2>
               <div className="w-full max-w-md mx-auto space-y-5">
                  <input
                     type="text"
                     placeholder="Nama Lengkap"
                     value={fullName}
                     onChange={(e) => setFullName(e.target.value)}
                     className="w-full px-4 py-3 border border-[#C0C9EE] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#898AC4]"
                     required
                  />
                  <input
                     type="email"
                     placeholder="Email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="w-full px-4 py-3 border border-[#C0C9EE] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#898AC4]"
                     required
                  />
                  <div className="relative">
                     <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Kata sandi"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-[#C0C9EE] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#898AC4] pr-10"
                        required
                     />
                     <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                     >
                        👁️
                     </button>
                  </div>
                  <div className="relative">
                     <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Konfirmasi kata sandi"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-[#C0C9EE] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#898AC4] pr-10"
                        required
                     />
                     <button
                        type="button"
                        onClick={() =>
                           setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                     >
                        👁️
                     </button>
                  </div>

                  {successMessage && (
                     <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg">
                        {successMessage}
                     </div>
                  )}
                  {errorMessage && (
                     <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg">
                        {errorMessage}
                     </div>
                  )}

                  <button
                     type="submit"
                     className="w-full bg-[#A2AADB] hover:bg-[#898AC4] text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105"
                  >
                     Daftar
                  </button>
                  <p className="text-center text-sm mt-4 text-gray-600">
                     Sudah punya akun?{" "}
                     <a
                        href="/autentikasi/login"
                        className="text-[#6F72B2] font-medium hover:underline"
                     >
                        Masuk di sini
                     </a>
                  </p>
               </div>
            </form>
         </div>
      </div>
   );
};

export default Regis;
