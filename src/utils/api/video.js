

export const fetchVideo = async () => {
   const response = await fetch("/api/kelola-video/get-all.json");
   if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
   }
   const data = await response.json();
   return data.video;
};

export const insertVideo = async (video) => {
  const response = await fetch("/api/kelola-video/tambah-video.json", {
    method: "POST",
    body: JSON.stringify(video),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Gagal insert video");
  }

  return result.video;
};

// lib/api/artikel/editArtikel.js

export const editVideo = async (idVideo, updatedData) => {
   try {
      const response = await fetch(`/api/kelola-video/edit/${idVideo}.json`, {
         method: "PUT",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.error || "Gagal mengedit video.");
      }

      const result = await response.json();
      return result;
   } catch (error) {
      console.error("❌ Gagal saat memanggil editVideo:", error.message);
      throw error;
   }
};





export async function deleteVideoById(videoId) {
  try {
    const response = await fetch(`/api/kelola-video/delete/${videoId}.json`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Gagal menghapus video.");
    }

    const data = await response.json();
    return data; // Bisa return message atau status dari server
  } catch (err) {
    console.error("Error saat menghapus video:", err.message);
    throw err; // Dilempar lagi agar bisa ditangani di komponen induk
  }
}
