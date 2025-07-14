import React from "react";

const KelolaPengguna = ({ users, onRequestDelete }) => {
   const handleDelete = (userId) => {
      if (window.confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
         onRequestDelete?.(userId);
      }
   };

   return (
      <div className="container mx-auto p-4 md:p-6 bg-white rounded-lg shadow-md">
         <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Kelola Pengguna
         </h2>

         {/* Tabel untuk menampilkan data pengguna */}
         <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white">
               {/* Header tabel */}
               <thead className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                  <tr>
                     <th className="py-3 px-6 text-left">Nama Pengguna</th>
                     <th className="py-3 px-6 text-left">Email</th>
                     <th className="py-3 px-6 text-left">Role</th>
                     <th className="py-3 px-6 text-center">Aksi</th>
                  </tr>
               </thead>
               {/* Body tabel */}
               <tbody className="text-gray-600 text-sm font-light">
                  {/* Memeriksa apakah ada data pengguna */}
                  {users && users.length > 0 ? (
                     // Melakukan iterasi pada array users untuk menampilkan setiap baris
                     users.map((user) => (
                        <tr
                           key={user.idpengguna}
                           className="border-b border-gray-200 hover:bg-gray-100"
                        >
                           <td className="py-3 px-6 text-left whitespace-nowrap">
                              {user.namapengguna}
                           </td>
                           <td className="py-3 px-6 text-left">
                              {user.emailpengguna}
                           </td>
                           <td className="py-3 px-6 text-left">{user.role}</td>
                           <td className="py-3 px-6 text-center">
                              <button
                                 onClick={() => handleDelete(user.idpengguna)}
                                 className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-200 text-xs"
                              >
                                 Hapus
                              </button>
                           </td>
                        </tr>
                     ))
                  ) : (
                     // Menampilkan pesan jika tidak ada data pengguna
                     <tr>
                        <td
                           colSpan="4"
                           className="py-4 text-center text-gray-500"
                        >
                           Tidak ada data pengguna yang tersedia.
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
   );
};

export default KelolaPengguna;
