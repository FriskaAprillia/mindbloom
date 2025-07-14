import React, { useState, useEffect } from "react";

const ModalInsertArtikel = ({ isOpen, onClose, onInsert, editData }) => {
   // State untuk setiap input field form
   const [judulartikel, setJudulartikel] = useState("");
   const [linkartikel, setLinkartikel] = useState("");
   const [fotoartikel, setFotoartikel] = useState(""); // Asumsikan ini adalah URL/path foto
   const [error, setError] = useState(""); // State untuk pesan error validasi

   // Jika modal tidak terbuka, jangan render apa-apa
   if (!isOpen) return null;

   // Fungsi untuk menghasilkan ID acak (jika diperlukan)
   const generateRandomId = () => {
      return Math.floor(Math.random() * 10000); // Contoh ID acak, bisa disesuaikan
   };

   // Handler saat form disubmit
   const handleSubmit = (e) => {
      e.preventDefault(); // Mencegah refresh halaman default form

      // Reset pesan error
      setError("");

      // Validasi sederhana: pastikan semua field terisi
      if (!judulartikel || !linkartikel || !fotoartikel) {
         setError("Semua field wajib diisi.");
         return;
      }

      // Buat objek data artikel baru
      const newArticle = {
         idartikel: editData?.idartikel ?? generateRandomId(),
         judulartikel,
         linkartikel,
         fotoartikel,
      };

      // Panggil fungsi onInsert dari props, meneruskan data artikel baru
      // Komponen induk bertanggung jawab untuk memasukkan ini ke Supabase
      onInsert(newArticle);

      // Reset form setelah submit
      setJudulartikel("");
      setLinkartikel("");
      setFotoartikel("");
      onClose(); // Tutup modal setelah submit
   };

   useEffect(() => {
      console.log("🚨 Modal terima editData:", editData);
      if (isOpen && editData) {
         setJudulartikel(editData.judulartikel || "");
         setLinkartikel(editData.linkartikel || "");
         setFotoartikel(editData.fotoartikel || "");
      } else if (isOpen && !editData) {
         setJudulartikel("");
         setLinkartikel("");
         setFotoartikel("");
      }
   }, [isOpen, editData]);

   return (
      // Overlay modal, klik di luar akan menutup modal
      <div
         className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
         onClick={onClose}
      >
         {/* Konten modal */}
         <div
            className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative transform transition-all duration-300 scale-100 opacity-100"
            onClick={(e) => e.stopPropagation()} // Mencegah penutupan modal saat klik di dalam konten modal
         >
            {/* Tombol tutup modal */}
            <button
               onClick={onClose}
               className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-semibold"
            >
               &times;
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
               {editData ? "Edit Artikel" : "Tambah Artikel"}
            </h2>

            {/* Menampilkan pesan error jika ada */}
            {error && (
               <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                  role="alert"
               >
                  <span className="block sm:inline">{error}</span>
               </div>
            )}

            {/* Form untuk input artikel */}
            <form onSubmit={handleSubmit}>
               {/* Field Judul Artikel */}
               <div className="mb-4">
                  <label
                     htmlFor="judulArtikel"
                     className="block text-gray-700 text-sm font-bold mb-2"
                  >
                     Judul Artikel:
                  </label>
                  <input
                     type="text"
                     id="judulartikel"
                     className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                     value={judulartikel}
                     onChange={(e) => setJudulartikel(e.target.value)}
                     placeholder="Masukkan judul artikel"
                     required
                  />
               </div>

               {/* Field Link Artikel */}
               <div className="mb-4">
                  <label
                     htmlFor="linkArtikel"
                     className="block text-gray-700 text-sm font-bold mb-2"
                  >
                     Link Artikel (URL):
                  </label>
                  <input
                     type="url" // Menggunakan type="url" untuk validasi browser dasar
                     id="linkArtikel"
                     className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                     value={linkartikel}
                     onChange={(e) => setLinkartikel(e.target.value)}
                     placeholder="Masukkan URL link artikel"
                     required
                  />
               </div>

               {/* Field Foto Artikel */}
               <div className="mb-6">
                  <label
                     htmlFor="fotoartikel"
                     className="block text-gray-700 text-sm font-bold mb-2"
                  >
                     URL Foto Artikel:
                  </label>
                  <input
                     type="url" // Asumsikan ini adalah URL/path ke gambar
                     id="fotoartikel"
                     className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                     value={fotoartikel}
                     onChange={(e) => setFotoartikel(e.target.value)}
                     placeholder="Masukkan URL foto artikel"
                     required
                  />
               </div>

               {/* Tombol Submit */}
               <div className="flex items-center justify-end">
                  <button
                     type="submit"
                     className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200"
                  >
                     {editData ? "Simpan Perubahan" : "Tambah Artikel"}
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
};

export default ModalInsertArtikel;
