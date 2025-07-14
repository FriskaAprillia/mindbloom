// src/components/ModalInsertKonten.jsx (Pastikan path ke komponen ini benar)

import React, { useState, useEffect } from "react";

import { v4 as uuidv4 } from "uuid"; // Import uuid untuk nama file unik
import { supabaseClient } from "../lib/supabaseClient";

// Komponen Input generik untuk teks
const Input = (
   { label, value, onChange, type = "text", required = false, name } // Tambahkan 'name' di sini
) => (
   <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
         {label}
         {required && <span className="text-red-500">*</span>}
      </label>
      <input
         type={type}
         name={name} // Teruskan prop 'name' ke elemen input HTML
         className="shadow border rounded-lg w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
         value={value}
         onChange={onChange}
         required={required}
      />
   </div>
);

const Textarea = (
   { label, value, onChange, required = false, name } // Tambahkan 'name' di sini
) => (
   <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
         {label}
         {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
         rows={4}
         name={name} // Teruskan prop 'name' ke elemen textarea HTML
         className="shadow border rounded-lg w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      link: "", // Untuk artikel
      foto: "", // URL foto
      audio: "", // URL audio
      isi: "", // Untuk edukasi
   });

   const [audioFile, setAudioFile] = useState(null); // Objek File untuk audio
   const [photoFile, setPhotoFile] = useState(null); // Objek File untuk foto

   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false); // Status loading saat submit

   // Efek untuk mengisi form saat modal dibuka atau editData berubah
   useEffect(() => {
      if (isOpen) {
         if (editData) {
            // Mode Edit: Isi form dengan data yang ada
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
            }
            // Reset file input saat mode edit (tidak otomatis terisi dari URL)
            setAudioFile(null);
            setPhotoFile(null);
         } else {
            // Mode Tambah Baru: Kosongkan form
            setFormData({ judul: "", link: "", foto: "", audio: "", isi: "" });
            setAudioFile(null);
            setPhotoFile(null);
         }
         setError(""); // Reset error saat modal dibuka
      }
   }, [isOpen, editData, tipeKonten]);

   // Handler untuk input teks/URL
   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
   };

   // Handler untuk input file audio
   const handleAudioFileChange = (e) => {
      const file = e.target.files[0];
      setAudioFile(file);
      // Kosongkan URL audio di formData saat file baru dipilih
      // Ini penting agar logika upload tahu ada file baru yang harus diunggah
      if (file) {
         setFormData((prev) => ({ ...prev, audio: "" }));
      }
   };

   // Handler untuk input file foto
   const handlePhotoFileChange = (e) => {
      const file = e.target.files[0];
      setPhotoFile(file);
      // Kosongkan URL foto di formData saat file baru dipilih
      if (file) {
         setFormData((prev) => ({ ...prev, foto: "" }));
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      let finalAudioUrl = formData.audio; // Default: pakai URL yang sudah ada
      let finalPhotoUrl = formData.foto; // Default: pakai URL yang sudah ada

      try {
         // 1. Validasi Awal & Penanganan Unggahan File
         if (!formData.judul) {
            throw new Error("Judul wajib diisi.");
         }

         if (tipeKonten === "artikel") {
            if (!formData.link) {
               throw new Error("Link Artikel wajib diisi.");
            }
            // Unggah foto artikel jika ada file baru dan tidak ada URL foto yang sudah ada
            if (!formData.foto && !photoFile && !editData) {
               // Jika tambah baru dan tidak ada foto
               throw new Error("Foto Artikel wajib diisi (file atau URL).");
            }
            if (photoFile) {
               // Jika ada file foto baru untuk diunggah (baik tambah/edit)
               const photoFileName = `artikel-images/${uuidv4()}-${
                  photoFile.name
               }`;
               const { data: uploadData, error: uploadError } =
                  await supabaseClient.storage
                     .from("content-images") // Ganti dengan nama bucket Anda untuk gambar artikel
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
            // Validasi & Unggah untuk White Noise
            if (!formData.audio && !audioFile && !editData) {
               // Jika tambah baru dan tidak ada audio
               throw new Error("File Audio wajib diisi.");
            }
            if (!formData.foto && !photoFile && !editData) {
               // Jika tambah baru dan tidak ada foto
               throw new Error("Foto White Noise wajib diisi.");
            }

            // Unggah file audio jika ada yang baru
            if (audioFile) {
               const audioFileName = `white-noise-audios/${uuidv4()}-${
                  audioFile.name
               }`;
               const { data: uploadData, error: uploadError } =
                  await supabaseClient.storage
                     .from("white-noise-audios") // Nama bucket audio Anda
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

            // Unggah file foto jika ada yang baru
            if (photoFile) {
               const photoFileName = `white-noise-images/${uuidv4()}-${
                  photoFile.name
               }`;
               const { data: uploadData, error: uploadError } =
                  await supabaseClient.storage
                     .from("white-noise-images") // Nama bucket foto white noise Anda
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
         }

         // 2. Siapkan Data untuk onInsert (Database)
         const idField = {
            artikel: "idartikel",
            "white-noise": "idwhitenoise",
            edukasi: "idedukasi",
         }[tipeKonten];

         const dataToSend = {
            ...(editData ? { [idField]: editData[idField] } : {}), // Hanya sertakan ID jika sedang edit
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
         };

         await onInsert(dataToSend); // Panggil callback untuk menyimpan ke database
         onClose(); // Tutup modal setelah berhasil
      } catch (err) {
         console.error("Error saat submit:", err);
         setError(
            `Gagal menyimpan data: ${
               err.message || "Terjadi kesalahan yang tidak diketahui."
            }`
         );
      } finally {
         setLoading(false); // Selesai loading
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
               {/* Input Judul - Pastikan 'name="judul"' ada di sini */}
               <Input
                  label="Judul"
                  name="judul"
                  value={formData.judul}
                  onChange={handleInputChange}
                  required
               />

               {tipeKonten === "artikel" && (
                  <>
                     <Input
                        label="Link Artikel"
                        name="link"
                        value={formData.link}
                        onChange={handleInputChange}
                        required
                     />
                     {/* Input Tipe File untuk Foto Artikel */}
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
                           required={!editData || !formData.foto} // Wajib jika baru atau belum ada foto
                        />
                        {photoFile && (
                           <p className="text-gray-500 text-xs mt-1">
                              File dipilih: {photoFile.name}
                           </p>
                        )}
                        {/* Tampilkan URL foto yang sudah ada jika mode edit dan belum ada file baru dipilih */}
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
                     {/* Input Tipe File untuk Audio */}
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
                           required={!editData || !formData.audio} // Wajib jika baru atau belum ada audio
                        />
                        {audioFile && (
                           <p className="text-gray-500 text-xs mt-1">
                              File dipilih: {audioFile.name}
                           </p>
                        )}
                        {/* Tampilkan URL audio yang sudah ada jika mode edit dan belum ada file baru dipilih */}
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

                     {/* Input Tipe File untuk Foto White Noise */}
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
                           required={!editData || !formData.foto} // Wajib jika baru atau belum ada foto
                        />
                        {photoFile && (
                           <p className="text-gray-500 text-xs mt-1">
                              File dipilih: {photoFile.name}
                           </p>
                        )}
                        {/* Tampilkan URL foto yang sudah ada jika mode edit dan belum ada file baru dipilih */}
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
