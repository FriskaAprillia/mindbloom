// Edukasi.jsx
import React, { useState, useEffect } from 'react';
import EdukasiCard from '../../EdukasiCard'; // Pastikan path ini benar

const Edukasi = () => {
  const [dataEdukasi, setDataEdukasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEdukasi = async () => {
      try {
    
        const response = await fetch('api/ui/edukasi/get-all.json'); // Contoh URL API edukasi
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const rawData = await response.json();


        if (rawData && Array.isArray(rawData.edukasi)) {
          setDataEdukasi(rawData.edukasi);
        } else {
          console.warn("API response 'data' property is not an array:", rawData);
          setDataEdukasi([]);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEdukasi();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full text-lg text-gray-700">
        Memuat edukasi...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error: {error}. Gagal memuat data edukasi.
      </div>
    );
  }

  return (
    <div className="p-6"> {/* Kontainer utama untuk halaman edukasi */}
      <div className="max-w-4xl mx-auto"> {/* Batasi lebar konten agar lebih mudah dibaca */}
        {dataEdukasi.length === 0 ? (
          <div className="text-center py-8 text-gray-600">Tidak ada materi edukasi yang tersedia.</div>
        ) : (
          dataEdukasi.map(edukasi => (
            <EdukasiCard
              key={edukasi.idedukasi}
              juduledukasi={edukasi.juduledukasi}
              isiedukasi={edukasi.isiedukasi}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Edukasi;