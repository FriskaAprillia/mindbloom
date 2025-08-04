import React, { useState, useEffect } from "react";
import VideoCard from "./VideoCard";
import { fetchVideo } from "../../../utils/api/video";

const Video = () => {
   const [dataVideos, setDataVideos] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      const fetchVideosData = async () => {
         try {
            const data = await fetchVideo(); // Memperbaiki pemanggilan fetchVideos
            setDataVideos(data);
         } catch (e) {
            setError(e.message);
         } finally {
            setLoading(false);
         }
      };

      fetchVideosData();
   }, []);

   if (loading) {
      return <div className="text-center py-4">Memuat video...</div>;
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
         {dataVideos.length === 0 ? (
            <div className="text-center py-4 text-gray-600">
               Tidak ada video yang tersedia.
            </div>
         ) : (
            dataVideos.map((video) => (
               <VideoCard
                  key={video.idvideo}
                  judul={video.judulvideo}
                  url={video.linkvideo} 
                  foto={video.fotovideo}
               />
            ))
         )}
      </div>
   );
};

export default Video;