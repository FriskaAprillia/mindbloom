import React from "react";

const KelolaEdukasi = ({ educations, onAddEducation, onEditEducation, onDeleteEducation }) => {
   const handleEdit = (educationId) => {
      // Memanggil fungsi onEditEducation dari props
      if (onEditEducation) {
         onEditEducation(educationId);
      }
   };

   // Fungsi handler untuk tombol Hapus
   const handleDelete = (educationId) => {
      // Konfirmasi sebelum menghapus
      if (
         window.confirm(`Apakah Anda yakin ingin menghapus materi edukasi ini?`)
      ) {
         // Memanggil fungsi onDeleteEducation dari props
         if (onDeleteEducation) {
            onDeleteEducation(educationId);
         }
      }
   };

   return (
      <div className="container mx-auto p-4 md:p-6 bg-white rounded-lg shadow-md">
         <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Kelola Materi Edukasi
         </h2>

         {/* Tombol Tambah Materi Edukasi */}
         <div className="mb-6">
            <button
               onClick={onAddEducation} // Memanggil fungsi onAddEducation dari props
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
               Tambah Materi Edukasi
            </button>
         </div>

         {/* Tabel untuk menampilkan daftar materi edukasi */}
         <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white">
               {/* Header tabel */}
               <thead className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                  <tr>
                     <th className="py-3 px-6 text-left">Judul</th>
                     <th className="py-3 px-6 text-left">Isi Edukasi</th>
                     <th className="py-3 px-6 text-center">Aksi</th>
                  </tr>
               </thead>
               {/* Body tabel */}
               <tbody className="text-gray-600 text-sm font-light">
                  {/* Memeriksa apakah ada data materi edukasi */}
                  {educations && educations.length > 0 ? (
                     // Melakukan iterasi pada array educations untuk menampilkan setiap baris
                     educations.map((education) => (
                        <tr
                           key={education.idedukasi}
                           className="border-b border-gray-200 hover:bg-gray-100"
                        >
                           <td className="py-3 px-6 text-left whitespace-nowrap">
                              {education.juduledukasi}
                           </td>
                           <td className="py-3 px-6 text-left truncate max-w-xs sm:max-w-md">
                              {" "}
                              {/* truncate untuk isi panjang */}
                              {education.isiedukasi}
                           </td>
                           <td className="py-3 px-6 text-center flex justify-center space-x-2">
                              <button
                                 onClick={() => handleEdit(education.idedukasi)}
                                 className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full transition duration-200 text-xs"
                              >
                                 Edit
                              </button>
                              <button
                                 onClick={() => handleDelete(education.idedukasi)}
                                 className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-200 text-xs"
                              >
                                 Hapus
                              </button>
                           </td>
                        </tr>
                     ))
                  ) : (
                     // Menampilkan pesan jika tidak ada data materi edukasi
                     <tr>
                        <td
                           colSpan="3"
                           className="py-4 text-center text-gray-500"
                        >
                           Tidak ada data materi edukasi yang tersedia.
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
   );
};
export default KelolaEdukasi;
