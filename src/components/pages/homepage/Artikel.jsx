// Artikel.jsx
import React from 'react';

// Tambahkan 'link' sebagai prop
const Artikel = ({ judul, sumber, foto, link }) => {
  return (
    // Bungkus seluruh div artikel dengan tag <a>
    // Tambahkan target="_blank" dan rel="noopener noreferrer" untuk membuka link di tab baru
    // dan untuk alasan keamanan (mencegah tabnabbing)
    <a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="block no-underline" // Agar tautan tidak memiliki garis bawah default
    >
      <div className="flex items-center bg-gray-200 rounded-lg shadow-md mb-4 p-4 pr-6
                      hover:bg-gray-300 transition-colors duration-200 cursor-pointer"> {/* Efek hover */}
        {/* Bagian Kiri: Placeholder Foto */}
        <div className="w-24 h-20 bg-gray-400 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
          {foto ? (
            <img src={foto} alt="Foto Artikel" className="w-full h-full object-cover rounded-lg" />
          ) : (
            <svg
              className="w-10 h-10 text-gray-600"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-4 2 2 4-4 4 4v2zm-6-6L8 9l-4 4h12l-3-3-2-2z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>

        {/* Bagian Tengah: Judul Artikel */}
        <div className="flex-grow">
          <h3 className="text-xl font-semibold text-gray-800">{judul}</h3>
        </div>

        {/* Bagian Kanan: Sumber Artikel */}
        <div className="ml-auto text-sm text-gray-600">
          {sumber}
        </div>
      </div>
    </a>
  );
};

export default Artikel;