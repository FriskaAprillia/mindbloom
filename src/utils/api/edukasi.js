export const fetchEdukasi = async () => {
   const response = await fetch("/api/kelola-edukasi/get-all.json");
   if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
   }
   const data = await response.json();
   return data.edukasi;
};

export const insertEdukasi = async (edukasi) => {
  const response = await fetch("/api/kelola-edukasi/tambah-edukasi.json", {
    method: "POST",
    body: JSON.stringify(edukasi),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Gagal insert edukasi");
  }

  return result.edukasi;
};

// lib/api/artikel/editArtikel.js

export const updateEdukasi = async (idEdukasi, updatedData) => {
   try {
      const response = await fetch(`/api/kelola-edukasi/edit/${idEdukasi}.json`, {
         method: "PUT",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.error || "Gagal mengedit edukasi.");
      }

      const result = await response.json();
      return result;
   } catch (error) {
      console.error("❌ Gagal saat memanggil editedukasi:", error.message);
      throw error;
   }
};




export async function deleteEdukasiById(edukasiId) {
  try {
    const response = await fetch(`/api/kelola-edukasi/delete/${edukasiId}.json`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Gagal menghapus edukasi.");
    }

    const data = await response.json();
    return data; // Bisa return message atau status dari server
  } catch (err) {
    console.error("Error saat menghapus edukasi:", err.message);
    throw err; // Dilempar lagi agar bisa ditangani di komponen induk
  }
}
