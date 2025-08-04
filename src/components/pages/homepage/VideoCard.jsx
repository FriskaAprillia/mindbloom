import React from 'react';

const VideoCard = ({ judul, url, foto }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block no-underline"
    >
      <div className="flex items-center bg-gray-200 rounded-lg shadow-md mb-4 p-4 pr-6
                      hover:bg-gray-300 transition-colors duration-200 cursor-pointer">
        {/* Bagian Kiri: Thumbnail Video */}
        <div className="w-24 h-20 bg-gray-400 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 overflow-hidden">
          {foto ? (
            <img src={foto} alt="Thumbnail Video" className="w-full h-full object-cover rounded-lg" />
          ) : (
            <svg
              className="w-10 h-10 text-gray-600"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm14 2H4v4l4.586-4.586A2 2 0 0112 8h2v-2z" />
            </svg>
          )}
        </div>

        {/* Bagian Tengah: Judul Video */}
        <div className="flex-grow">
          <h3 className="text-xl font-semibold text-gray-800">{judul}</h3>
        </div>

        {/* Bagian Kanan: Sumber Video */}
        <div className="ml-auto text-sm text-gray-600">
          {/* Perbaikan: Gunakan try...catch untuk menangani URL yang tidak valid */}
          {(() => {
            try {
              return new URL(url).hostname.replace("www.", "").split(".")[0];
            } catch (e) {
              return "Sumber tidak valid";
            }
          })()}
        </div>
      </div>
    </a>
  );
};

export default VideoCard;