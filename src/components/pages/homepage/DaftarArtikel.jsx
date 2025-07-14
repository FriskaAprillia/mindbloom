import React, { useState, useEffect } from "react";
import Artikel from "./Artikel"; // Pastikan path ini benar

const DaftarArtikelUtama = ({ onselectArtikel }) => {
   const [dataArtikel, setDataArtikel] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      const fetchArticles = async () => {
         try {
            // Ganti dengan URL API Anda yang sebenarnya
            const response = await fetch("api/ui/artikel/get-all.json");
            if (!response.ok) {
               throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setDataArtikel(data.artikel);
         } catch (e) {
            setError(e.message);
         } finally {
            setLoading(false);
         }
      };

      fetchArticles();
   }, []);

   if (loading) {
      return <div className="text-center py-4">Memuat artikel...</div>;
   }

   if (error) {
      return (
         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
            Error: {error}
         </div>
      );
   }

   return (
      <div className="space-y-4">
         {dataArtikel.length === 0 ? (
            <div className="text-center py-4 text-gray-600">
               Tidak ada artikel yang tersedia.
            </div>
         ) : (
            dataArtikel.map((artikel) => (
               <Artikel
                  key={artikel.idartikel || artikel.id} // Sesuaikan dengan nama field ID di API Anda
                  judul={artikel.judulartikel || artikel.judul} // Sesuaikan dengan nama field judul
                  sumber={
                     new URL(artikel.linkartikel).hostname
                        .replace("www.", "")
                        .split(".")[0]
                  } // Sesuaikan dengan nama field sumber
                  foto={artikel.fotoartikel || artikel.foto}
                  link={artikel.linkartikel || artikel.link} // Sesuaikan dengan nama field link
               />
            ))
         )}
      </div>
   );
};

export default DaftarArtikelUtama;
