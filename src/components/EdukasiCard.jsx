// EdukasiCard.jsx
import React, { useState } from 'react';

const EdukasiCard = ({ juduledukasi, isiedukasi }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden border border-gray-200">
      {/* Bagian Header yang bisa diklik (Judul Edukasi) */}
      <button
        className="w-full text-left p-5 flex justify-between items-center bg-gray-100 hover:bg-gray-200 transition-colors duration-200 focus:outline-none"
        onClick={toggleExpand}
        aria-expanded={isExpanded}
      >
        <h3 className="text-xl font-semibold text-gray-800 mr-4">
          {juduledukasi}
        </h3>
        {/* Ikon panah untuk menunjukkan status expand/collapse */}
        <svg
          className={`w-6 h-6 text-gray-600 transform transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : 'rotate-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      {/* Bagian Isi Edukasi (Hanya ditampilkan jika expanded) */}
      {isExpanded && (
        <div className="p-5 border-t border-gray-200">
          {/*
            Jika isi edukasi adalah teks biasa dengan baris baru, gunakan whitespace-pre-wrap
            Jika isi edukasi mengandung HTML (rich text), Anda mungkin perlu menggunakan:
            <div dangerouslySetInnerHTML={{ __html: isiedukasi }} className="prose max-w-none" />
            (Pastikan Anda telah menginstal @tailwindcss/typography plugin jika menggunakan 'prose')
          */}
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {isiedukasi}
          </p>
        </div>
      )}
    </div>
  );
};

export default EdukasiCard;