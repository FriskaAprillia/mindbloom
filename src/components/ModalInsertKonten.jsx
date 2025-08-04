// src/components/ModalInsertKonten.jsx
import React, { useState, useEffect } from "react";

import { v4 as uuidv4 } from "uuid";
import { supabaseClient } from "../lib/supabaseClient";

// Komponen Input generik untuk teks
const Input = (
   { label, value, onChange, type = "text", required = false, name }
) => (
   <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
         {label}
         {required && <span className="text-red-500">*</span>}
      </label>
      <input
         type={type}
         name={name}
         className="shadow border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
         value={value}
         onChange={onChange}
         required={required}
      />
   </div>
);

const Textarea = (
   { label, value, onChange, required = false, name }
) => (
   <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
         {label}
         {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
         rows={4}
         name={name}
         className="shadow border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
         value={value}
         onChange={onChange}
         required={required}
      />
   </div>
);

const ModalInsertKonten = ({
   isOpen,
   onClose,
   onInsert,
   editData,
   tipeKonten = "artikel",
}) => {
   const [formData, setFormData] = useState({
      judul: "",
      link: "",
      foto: "",
      audio: "",
      isi: "",
   });

   const [audioFile, setAudioFile] = useState(null);
   const [photoFile, setPhotoFile] = useState(null);
   const [youtubeThumbnail, setYoutubeThumbnail] = useState(null);
   const [youtubeTitle, setYoutubeTitle] = useState("");

   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);

   const extractYoutubeId = (url) => {
      const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
      const match = url.match(regex);
      return match ? match[1] : null;
   };

   const generateYoutubeThumbnail = (url) => {
      const videoId = extractYoutubeId(url);
      if (videoId) {
         return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
      return null;
   };

   const extractYoutubeTitle = async (url) => {
       try {
        const response = await fetch(`/api/youtube/get-title.json?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        if (response.ok && data.title) {
          return data.title;
        } else {
          console.error("Gagal mengambil judul dari API:", data.error || "Unknown error");
          return null;
        }
      } catch (error) {
        console.error("Error fetching YouTube title:", error);
        return null;
      }
   };

   useEffect(() => {
      if (isOpen) {
         if (editData) {
            if (tipeKonten === "artikel") {
               setFormData({
                  judul: editData.judulartikel || "",
                  link: editData.linkartikel || "",
                  foto: editData.fotoartikel || "",
                  audio: "",
                  isi: "",
               });
            } else if (tipeKonten === "white-noise") {
               setFormData({
                  judul: editData.namawhitenoise || "",
                  audio: editData.fileaudio || "",
                  foto: editData.fotowhitenoise || "",
                  link: "",
                  isi: "",
               });
            } else if (tipeKonten === "edukasi") {
               setFormData({
                  judul: editData.juduledukasi || "",
                  isi: editData.isiedukasi || "",
                  link: "",
                  foto: "",
                  audio: "",
               });
            } else if (tipeKonten === "video") {
               setFormData({
                  judul: editData.judulvideo || "",
                  link: editData.urlvideo || "",
                  foto: editData.fotovideo || "",
                  audio: "",
                  isi: "",
               });
               setYoutubeThumbnail(editData.fotovideo);
               setYoutubeTitle(editData.judulvideo || "");
            }
            setAudioFile(null);
            setPhotoFile(null);
         } else {
            setFormData({ judul: "", link: "", foto: "", audio: "", isi: "" });
            setAudioFile(null);
            setPhotoFile(null);
            setYoutubeThumbnail(null);
            setYoutubeTitle("");
         }
         setError("");
      }
   }, [isOpen, editData, tipeKonten]);

   const handleInputChange = async (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      
      if (name === "link" && tipeKonten === "video") {
         setYoutubeThumbnail(generateYoutubeThumbnail(value));
         const title = await extractYoutubeTitle(value);
         if (title) {
            setYoutubeTitle(title);
         } else {
            setYoutubeTitle("");
         }
      } else if (name === "judul" && tipeKonten === "video") {
          setYoutubeTitle(value);
      }
   };

   const handleAudioFileChange = (e) => {
      const file = e.target.files[0];
      setAudioFile(file);
      if (file) {
         setFormData((prev) => ({ ...prev, audio: "" }));
      }
   };

   const handlePhotoFileChange = (e) => {
      const file = e.target.files[0];
      setPhotoFile(file);
      if (file) {
         setFormData((prev) => ({ ...prev, foto: "" }));
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      let finalAudioUrl = formData.audio;
      let finalPhotoUrl = formData.foto;

      try {
         if (!formData.judul && !youtubeTitle) {
            throw new Error("Judul wajib diisi.");
         }

         if (tipeKonten === "artikel") {
            if (!formData.link) {
               throw new Error("Link Artikel wajib diisi.");
            }
            if (!formData.foto && !photoFile && !editData) {
               throw new Error("Foto Artikel wajib diisi (file atau URL).");
            }
            if (photoFile) {
               const photoFileName = `artikel-images/${uuidv4()}-${
                  photoFile.name
               }`;
               const { data: uploadData, error: uploadError } =
                  await supabaseClient.storage
                     .from("content-images")
                     .upload(photoFileName, photoFile, {
                        cacheControl: "3600",
                     });
               if (uploadError) throw uploadError;
               const { data: publicUrlData } = supabaseClient.storage
                  .from("content-images")
                  .getPublicUrl(photoFileName);
               if (!publicUrlData || !publicUrlData.publicUrl)
                  throw new Error("Gagal mendapatkan URL publik foto.");
               finalPhotoUrl = publicUrlData.publicUrl;
            }
         } else if (tipeKonten === "white-noise") {
            if (!formData.audio && !audioFile && !editData) {
               throw new Error("File Audio wajib diisi.");
            }
            if (!formData.foto && !photoFile && !editData) {
               throw new Error("Foto White Noise wajib diisi.");
            }

            if (audioFile) {
               const audioFileName = `white-noise-audios/${uuidv4()}-${
                  audioFile.name
               }`;
               const { data: uploadData, error: uploadError } =
                  await supabaseClient.storage
                     .from("white-noise-audios")
                     .upload(audioFileName, audioFile, {
                        cacheControl: "3600",
                     });
               if (uploadError) throw uploadError;
               const { data: publicUrlData } = supabaseClient.storage
                  .from("white-noise-audios")
                  .getPublicUrl(audioFileName);
               if (!publicUrlData || !publicUrlData.publicUrl)
                  throw new Error("Gagal mendapatkan URL publik audio.");
               finalAudioUrl = publicUrlData.publicUrl;
            }

            if (photoFile) {
               const photoFileName = `white-noise-images/${uuidv4()}-${
                  photoFile.name
               }`;
               const { data: uploadData, error: uploadError } =
                  await supabaseClient.storage
                     .from("white-noise-images")
                     .upload(photoFileName, photoFile, {
                        cacheControl: "3600",
                     });
               if (uploadError) throw uploadError;
               const { data: publicUrlData } = supabaseClient.storage
                  .from("white-noise-images")
                  .getPublicUrl(photoFileName);
               if (!publicUrlData || !publicUrlData.publicUrl)
                  throw new Error("Gagal mendapatkan URL publik foto.");
               finalPhotoUrl = publicUrlData.publicUrl;
            }
         } else if (tipeKonten === "edukasi") {
            if (!formData.isi) {
               throw new Error("Isi Edukasi wajib diisi.");
            }
         } else if (tipeKonten === "video") {
            if (!formData.link) {
               throw new Error("URL Video wajib diisi.");
            }
            const generatedThumbnail = generateYoutubeThumbnail(formData.link);
            if (!generatedThumbnail) {
               throw new Error("URL video tidak valid.");
            }
            finalPhotoUrl = generatedThumbnail;
         }

         const idField = {
            artikel: "idartikel",
            "white-noise": "idwhitenoise",
            edukasi: "idedukasi",
            video: "idvideo",
         }[tipeKonten];

         const dataToSend = {
            ...(editData ? { [idField]: editData[idField] } : {}),
            ...(tipeKonten === "artikel" && {
               judulartikel: formData.judul,
               linkartikel: formData.link,
               fotoartikel: finalPhotoUrl,
            }),
            ...(tipeKonten === "white-noise" && {
               namawhitenoise: formData.judul,
               fileaudio: finalAudioUrl,
               fotowhitenoise: finalPhotoUrl,
            }),
            ...(tipeKonten === "edukasi" && {
               juduledukasi: formData.judul,
               isiedukasi: formData.isi,
            }),
            ...(tipeKonten === "video" && {
               judulvideo: youtubeTitle, // Menggunakan judul yang diambil otomatis
               linkvideo: formData.link,
               fotovideo: finalPhotoUrl,
            }),
         };

         await onInsert(dataToSend);
         onClose();
      } catch (err) {
         console.error("Error saat submit:", err);
         setError(
            `Gagal menyimpan data: ${
               err.message || "Terjadi kesalahan yang tidak diketahui."
            }`
         );
      } finally {
         setLoading(false);
      }
   };

   if (!isOpen) return null;

   return (
      <div
         className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
         onClick={onClose}
      >
         <div
            className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative"
            onClick={(e) => e.stopPropagation()}
         >
            <button
               onClick={onClose}
               className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-semibold"
            >
               &times;
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
               {editData
                  ? `Edit ${tipeKonten.replace("-", " ")}`
                  : `Tambah ${tipeKonten.replace("-", " ")}`}
            </h2>

            {error && (
               <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
                  role="alert"
               >
                  <span className="block sm:inline">{error}</span>
               </div>
            )}

            <form onSubmit={handleSubmit}>
               {tipeKonten !== "video" && (
                  <Input
                     label="Judul"
                     name="judul"
                     value={formData.judul}
                     onChange={handleInputChange}
                     required
                  />
               )}

               {tipeKonten === "artikel" && (
                  <>
                     <Input
                        label="Link Artikel"
                        name="link"
                        value={formData.link}
                        onChange={handleInputChange}
                        required
                     />
                     <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                           Foto Artikel{" "}
                           {(!editData || !formData.foto) && (
                              <span className="text-red-500">*</span>
                           )}
                        </label>
                        <input
                           type="file"
                           accept="image/*"
                           className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                           onChange={handlePhotoFileChange}
                           required={!editData || !formData.foto}
                        />
                        {photoFile && (
                           <p className="text-gray-500 text-xs mt-1">
                              File dipilih: {photoFile.name}
                           </p>
                        )}
                        {editData && formData.foto && !photoFile && (
                           <p className="text-gray-500 text-xs mt-1">
                              Foto saat ini:{" "}
                              <a
                                 href={formData.foto}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="text-blue-500 truncate inline-block max-w-[calc(100%-10px)]"
                              >
                                 {formData.foto}
                              </a>
                           </p>
                        )}
                     </div>
                  </>
               )}

               {tipeKonten === "white-noise" && (
                  <>
                     <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                           File Audio{" "}
                           {(!editData || !formData.audio) && (
                              <span className="text-red-500">*</span>
                           )}
                        </label>
                        <input
                           type="file"
                           accept="audio/*"
                           className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                           onChange={handleAudioFileChange}
                           required={!editData || !formData.audio}
                        />
                        {audioFile && (
                           <p className="text-gray-500 text-xs mt-1">
                              File dipilih: {audioFile.name}
                           </p>
                        )}
                        {editData && formData.audio && !audioFile && (
                           <p className="text-gray-500 text-xs mt-1">
                              Audio saat ini:{" "}
                              <a
                                 href={formData.audio}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="text-blue-500 truncate inline-block max-w-[calc(100%-10px)]"
                              >
                                 {formData.audio}
                              </a>
                           </p>
                        )}
                     </div>

                     <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                           Foto White Noise{" "}
                           {(!editData || !formData.foto) && (
                              <span className="text-red-500">*</span>
                           )}
                        </label>
                        <input
                           type="file"
                           accept="image/*"
                           className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                           onChange={handlePhotoFileChange}
                           required={!editData || !formData.foto}
                        />
                        {photoFile && (
                           <p className="text-gray-500 text-xs mt-1">
                              File dipilih: {photoFile.name}
                           </p>
                        )}
                        {editData && formData.foto && !photoFile && (
                           <p className="text-gray-500 text-xs mt-1">
                              Foto saat ini:{" "}
                              <a
                                 href={formData.foto}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="text-blue-500 truncate inline-block max-w-[calc(100%-10px)]"
                              >
                                 {formData.foto}
                              </a>
                           </p>
                        )}
                     </div>
                  </>
               )}

               {tipeKonten === "edukasi" && (
                  <Textarea
                     label="Isi Edukasi"
                     name="isi"
                     value={formData.isi}
                     onChange={handleInputChange}
                     required
                  />
               )}
               
               {tipeKonten === "video" && (
                  <>
                     {youtubeTitle && (
                        <div className="mb-4">
                           <label className="block text-gray-700 text-sm font-bold mb-2">
                              Judul Video (Otomatis):
                           </label>
                           <p className="p-3 bg-gray-100 rounded-lg text-gray-700 font-semibold">
                              {youtubeTitle}
                           </p>
                        </div>
                     )}
                     <Input
                        label="URL Video (YouTube)"
                        name="link"
                        value={formData.link}
                        onChange={handleInputChange}
                        type="url"
                        required
                     />
                     {(youtubeThumbnail || editData?.fotovideo) && (
                        <div className="mb-4">
                           <label className="block text-gray-700 text-sm font-bold mb-2">
                              Pratinjau Thumbnail:
                           </label>
                           <img
                              src={youtubeThumbnail || editData.fotovideo}
                              alt="YouTube Thumbnail"
                              className="w-full h-auto object-cover rounded-lg shadow-md"
                           />
                        </div>
                     )}
                  </>
               )}

               <div className="flex items-center justify-end">
                  <button
                     type="submit"
                     className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                     disabled={loading}
                  >
                     {loading ? (
                        <>
                           <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                           >
                              <circle
                                 className="opacity-25"
                                 cx="12"
                                 cy="12"
                                 r="10"
                                 stroke="currentColor"
                                 strokeWidth="4"
                              ></circle>
                              <path
                                 className="opacity-75"
                                 fill="currentColor"
                                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                           </svg>
                           {editData ? "Menyimpan..." : "Mengunggah..."}
                        </>
                     ) : editData ? (
                        "Simpan Perubahan"
                     ) : (
                        "Tambah"
                     )}
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
};

export default ModalInsertKonten;