// WhiteNoiseCard.jsx
import React, { useRef, useEffect } from "react";

const WhiteNoiseCard = ({
   id, // Tambahkan prop 'id' untuk mengidentifikasi kartu secara unik
   namawhitenoise,
   fotowhitenoise,
   fileaudio,
   isPlaying, // Prop isPlaying sekarang dikontrol dari luar
   onTogglePlayPause, // Callback untuk memberitahu komponen induk
}) => {
   const audioRef = useRef(null);

   
   useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;

      if (isPlaying) {
         audio.play().catch((error) => {
            console.error("Error playing audio:", error);
            alert(
               "Gagal memutar audio. Pastikan browser mengizinkan autoplay atau coba lagi."
            );
  
            if (onTogglePlayPause) onTogglePlayPause(id, false);
         });
      } else {
         audio.pause();
      }
   }, [isPlaying, id, onTogglePlayPause]);

   return (
      <div className="relative bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-xl p-6 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl group overflow-hidden">
         {/* Efek hiasan gradient blur di belakang */}
         <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-300 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-all duration-500"></div>
         <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-200 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-all duration-500"></div>

         {/* Gambar / Thumbnail */}
         <div className="w-full h-44 bg-gradient-to-tr from-gray-200 to-gray-300 rounded-xl overflow-hidden mb-4 shadow-md relative z-10">
            {fotowhitenoise ? (
               <img
                  src={fotowhitenoise}
                  alt={namawhitenoise}
                  className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
               />
            ) : (
               <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg
                     className="w-16 h-16"
                     fill="currentColor"
                     viewBox="0 0 20 20"
                  >
                     <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-4 2 2 4-4 4 4v2zm-6-6L8 9l-4 4h12l-3-3-2-2z"
                        clipRule="evenodd"
                     />
                  </svg>
               </div>
            )}
         </div>

         {/* Judul */}
         <h3 className="text-xl font-bold text-gray-900 mb-3 z-10 line-clamp-2">
            {namawhitenoise}
         </h3>

         {/* Tombol Play / Pause */}
         <button
            onClick={() => onTogglePlayPause(id, !isPlaying)}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white p-4 rounded-full shadow-lg z-10 transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-opacity-50"
         >
            {isPlaying ? (
               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                     fillRule="evenodd"
                     d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                     clipRule="evenodd"
                  />
               </svg>
            ) : (
               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                     fillRule="evenodd"
                     d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.021A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                     clipRule="evenodd"
                  />
               </svg>
            )}
         </button>

         {/* Audio */}
         <audio
            ref={audioRef}
            src={fileaudio}
            preload="auto"
            className="hidden"
         />
      </div>
   );
};

export default WhiteNoiseCard;
