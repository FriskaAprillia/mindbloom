import React from "react";
import img from "../../assets/image/bgLanding.png";

const LandingPage = () => {
   const primaryColor = '#8F87F1'; // Warna ungu dari palet (paling atas)
  const secondaryColor = '#C6A7F6'; // Warna ungu kedua dari palet
  const lightPurpleColor = '#E9C6FA'; // Warna ungu muda ketiga dari palet
  const lightestPinkColor = '#FDE2E2'; // Warna merah muda paling bawah dari palet
  const textColor = '#4a4a4a'; // Abu-abu tua untuk teks utama (tetap)
  const lightTextColor = '#6b6b6b'; // Abu-abu lebih muda untuk teks sekunder (tetap)
   return (
      <div
         className="h-screen bg-cover overflow-auto flex flex-col text-center justify-center items-center"
         style={{
            backgroundImage: `url(${img.src})`,
         }}
      >
         <h1 className="text-5xl md:text-6xl  font-extrabold leading-tight mb-6">
            Temukan Ketenangan Batin Anda dengan <br />
            <span style={{ color: textColor }}>MindBloom</span>
         </h1>
         <p
            className="text-lg md:text-xl max-w-2xl mb-10"
            style={{ color: lightTextColor }}
         >
            Chatbot konseling dan dukungan kesehatan mental yang siap
            mendengarkan dan membantu Anda kapan saja, di mana saja.
         </p>

         {/* Action Buttons */}
         <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <a
               className="px-8 py-3 text-white font-semibold rounded-full shadow-lg hover:bg-gray-900 transition duration-300 ease-in-out transform hover:scale-105"
               style={{ backgroundColor: primaryColor }}
               href="/autentikasi/login"
            >
               Masuk Sekarang
            </a>
            <a
               className="px-8 py-3 bg-white text-gray-800 font-semibold rounded-full shadow-lg border border-gray-300 hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105"
               style={{ borderColor: lightTextColor, color: textColor }}
               href="/autentikasi/regis"
            >
               Daftar Akun Baru
            </a>
         </div>
      </div>
   );
};

export default LandingPage;
