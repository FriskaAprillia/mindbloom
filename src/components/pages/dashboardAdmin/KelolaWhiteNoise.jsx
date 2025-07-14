import React from "react";

const KelolaWhiteNoise = ({key, whiteNoises, onAddWhiteNoise, onEditWhiteNoise, onDeleteWhiteNoise}) => {
   const handleEdit = (whiteNoiseId) => {
      // Memanggil fungsi onEditWhiteNoise dari props
      if (onEditWhiteNoise) {
         onEditWhiteNoise(whiteNoiseId);
      }
      console.log(`Edit white noise dengan ID: ${whiteNoiseId}`);
   };

   // Fungsi handler untuk tombol Hapus
   const handleDelete = (whiteNoiseId) => {
      // Konfirmasi sebelum menghapus
      if (
         window.confirm(
            `Apakah Anda yakin ingin menghapus audio white noise ini?`
         )
      ) {
         // Memanggil fungsi onDeleteWhiteNoise dari props
         if (onDeleteWhiteNoise) {
            onDeleteWhiteNoise(whiteNoiseId);
         }
         console.log(`Hapus white noise dengan ID: ${whiteNoiseId}`);
      }
   };

   return (
      <div className="container mx-auto p-4 md:p-6 bg-white rounded-lg shadow-md">
         <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Kelola White Noise
         </h2>

         {/* Tombol Tambah White Noise */}
         <div className="mb-6">
            <button
               onClick={onAddWhiteNoise} // Memanggil fungsi onAddWhiteNoise dari props
               className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition duration-200"
            >
               <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth="2"
                     d="M12 4v16m8-8H4"
                  ></path>
               </svg>
               Tambah White Noise
            </button>
         </div>

         {/* Tabel untuk menampilkan daftar audio white noise */}
         <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white">
               {/* Header tabel */}
               <thead className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                  <tr>
                     <th className="py-3 px-6 text-left">Judul</th>
                     <th className="py-3 px-6 text-left">URL</th>
                     <th className="py-3 px-6 text-left">Foto</th>
                     <th className="py-3 px-6 text-center">Aksi</th>
                  </tr>
               </thead>
               {/* Body tabel */}
               <tbody className="text-gray-600 text-sm font-light">
                  {/* Memeriksa apakah ada data white noise */}
                  {whiteNoises && whiteNoises.length > 0 ? (
                     // Melakukan iterasi pada array whiteNoises untuk menampilkan setiap baris
                     whiteNoises.map((noise) => (
                        <tr
                           key={noise.idwhitenoise}
                           className="border-b border-gray-200 hover:bg-gray-100"
                        >
                           <td className="py-3 px-6 text-left whitespace-nowrap">
                              {noise.namawhitenoise}
                           </td>
                           <td className="py-3 px-6 text-left">
                              <a
                                 href={noise.fileaudio}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="text-blue-500 hover:underline"
                              >
                                 {noise.fileaudio}
                              </a>
                           </td>
                           <td className="py-3 px-6 text-left">
                              {/* Menampilkan gambar kecil jika URL foto tersedia */}
                              {noise.fotowhitenoise ? (
                                 <img
                                    src={noise.fotowhitenoise}
                                    alt={noise.namawhitenoise}
                                    className="w-12 h-12 object-cover rounded-md"
                                    onError={(e) => {
                                       e.target.onerror = null;
                                       e.target.src =
                                          "https://placehold.co/48x48/CCCCCC/FFFFFF?text=No+Image"; // Placeholder if image fails
                                    }}
                                 />
                              ) : (
                                 <span className="text-gray-500">No Image</span>
                              )}
                           </td>
                           <td className="py-3 px-6 text-center flex justify-center space-x-2">
                              <button
                                 onClick={() => handleEdit(noise.idwhitenoise)}
                                 className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full transition duration-200 text-xs"
                              >
                                 Edit
                              </button>
                              <button
                                 onClick={() => handleDelete(noise.idwhitenoise)}
                                 className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-200 text-xs"
                              >
                                 Hapus
                              </button>
                           </td>
                        </tr>
                     ))
                  ) : (
                     // Menampilkan pesan jika tidak ada data white noise
                     <tr>
                        <td
                           colSpan="4"
                           className="py-4 text-center text-gray-500"
                        >
                           Tidak ada data audio White Noise yang tersedia.
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
   );
};

export default KelolaWhiteNoise;
