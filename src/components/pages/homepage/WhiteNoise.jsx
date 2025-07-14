// WhiteNoise.jsx (Sebelumnya mungkin bernama WhiteNoiseList.jsx)
import React, { useState, useEffect } from 'react';
import WhiteNoiseCard from '../../WhiteNoiseCard';
import { fetchWhiteNoise } from '../../../utils/api/whiteNoise';

const WhiteNoise = () => {
  const [dataWhiteNoise, setDataWhiteNoise] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State baru untuk melacak ID audio yang sedang diputar
  const [playingAudioId, setPlayingAudioId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchWhiteNoise();
        setDataWhiteNoise(data);
      } catch (err) {
        setError(err.message || 'Gagal memuat data White Noise');
      } finally {
        setLoading(false);
      } 
    };
    fetchData();
  }, []);

  // Fungsi untuk menangani toggle play/pause dari WhiteNoiseCard
  const handleTogglePlayPause = (id, shouldPlay) => {
    if (shouldPlay) {
      // Jika kartu ini akan diputar
      if (playingAudioId && playingAudioId !== id) {
        // Jika ada audio lain yang sedang diputar, PAUSE dulu
        setPlayingAudioId(null);
        // Memberikan sedikit waktu untuk re-render sebelum memutar yang baru
        // Ini opsional tapi bisa membantu mencegah masalah race condition
        setTimeout(() => setPlayingAudioId(id), 50);
      } else {
        setPlayingAudioId(id);
      }
    } else {
      // Jika kartu ini akan di-pause
      if (playingAudioId === id) {
        setPlayingAudioId(null);
      }
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-700">
        Memuat daftar White Noise...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error: {error}. Gagal memuat White Noise.
      </div>
    );
  }

  return (
    <div className="p-6"> {/* Kontainer utama untuk halaman White Noise */}
      <h2 className="text-4xl font-bold text-gray-700 mb-6 text-center md:text-left">
        White Noise untuk Relaksasi
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {dataWhiteNoise.length === 0 ? (
          <div className="sm:col-span-2 lg:col-span-3 text-center py-8 text-gray-600">
            Tidak ada suara White Noise yang tersedia.
          </div>
        ) : (
          dataWhiteNoise.map(noise => (
            <WhiteNoiseCard
              key={noise.idwhitenoise}
              id={noise.idwhitenoise} // Meneruskan ID unik ke WhiteNoiseCard
              namawhitenoise={noise.namawhitenoise}
              fotowhitenoise={noise.fotowhitenoise}
              fileaudio={noise.fileaudio}
              isPlaying={playingAudioId === noise.idwhitenoise} // Menentukan apakah kartu ini sedang diputar
              onTogglePlayPause={handleTogglePlayPause} // Meneruskan fungsi callback
            />
          ))
        )}
      </div>
    </div>
  );
};

export default WhiteNoise;