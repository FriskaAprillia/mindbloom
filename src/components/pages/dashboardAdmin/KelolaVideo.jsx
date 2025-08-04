import React from "react";

const KelolaVideo = ({ videos, onAddVideo, onEditVideo, onDeleteVideo }) => {
   // Fungsi handler untuk tombol Edit
   const handleEdit = (videoId) => {
      // Memanggil fungsi onEditVideo dari props
      if (onEditVideo) {
         onEditVideo(videoId);
      }
      console.log(`Edit video dengan ID: ${videoId}`);
   };

   // Fungsi handler untuk tombol Hapus
   const handleDelete = (videoId) => {
      if (window.confirm("Apakah Anda yakin ingin menghapus video ini?")) {
         onDeleteVideo?.(videoId);
      }
   };

   return (
      <div className="container mx-auto p-4 md:p-6 bg-white rounded-lg shadow-md">
         <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Kelola Video
         </h2>

         {/* Tombol Tambah Video */}
         <div className="mb-6">
            <button
               onClick={onAddVideo} // Memanggil fungsi onAddVideo dari props
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
               Tambah Video
            </button>
         </div>

         {/* Tabel untuk menampilkan daftar video */}
         <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white">
               {/* Header tabel */}
               <thead className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                  <tr>
                     <th className="py-3 px-6 text-left">Judul</th>
                     <th className="py-3 px-6 text-left">URL</th>
                     <th className="py-3 px-6 text-center">Aksi</th>
                  </tr>
               </thead>
               {/* Body tabel */}
               <tbody className="text-gray-600 text-sm font-light">
                  {/* Memeriksa apakah ada data video */}
                  {videos && videos.length > 0 ? (
                     // Melakukan iterasi pada array videos untuk menampilkan setiap baris
                     videos.map((video) => (
                        <tr
                           key={video.idvideo}
                           className="border-b border-gray-200 hover:bg-gray-100"
                        >
                           <td className="py-3 px-6 text-left whitespace-nowrap">
                              {video.judulvideo}
                           </td>
                           <td className="py-3 px-6 text-left">
                              <a
                                 href={video.linkvideo}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="text-blue-500 hover:underline"
                              >
                                 {video.linkvideo}
                              </a>
                           </td>
                          
                           <td className="py-3 px-6 text-center flex justify-center space-x-2">
                              <button
                                 onClick={() => handleEdit(video.idvideo)}
                                 className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full transition duration-200 text-xs"
                              >
                                 Edit
                              </button>
                              <button
                                 onClick={() => handleDelete(video.idvideo)}
                                 className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-200 text-xs"
                              >
                                 Hapus
                              </button>
                           </td>
                        </tr>
                     ))
                  ) : (
                     <tr>
                        <td
                           colSpan="4"
                           className="py-4 text-center text-gray-500"
                        >
                           Tidak ada data video yang tersedia.
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
   );
};

export default KelolaVideo;