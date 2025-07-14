

export const fetchArtikel = async () => {
   const response = await fetch("/api/kelola-artikel/get-all.json");
   if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
   }
   const data = await response.json();
   return data.artikel;
};

export const insertArtikel = async (artikel) => {
  const response = await fetch("/api/kelola-artikel/tambah-artikel.json", {
    method: "POST",
    body: JSON.stringify(artikel),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Gagal insert artikel");
  }

  return result.artikel;
};

// lib/api/artikel/editArtikel.js

export const editArtikel = async (idArtikel, updatedData) => {
   try {
      const response = await fetch(`/api/kelola-artikel/edit/${idArtikel}.json`, {
         method: "PUT",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.error || "Gagal mengedit artikel.");
      }

      const result = await response.json();
      return result;
   } catch (error) {
      console.error("❌ Gagal saat memanggil editArtikel:", error.message);
      throw error;
   }
};





export async function deleteArtikelById(articleId) {
  try {
    const response = await fetch(`/api/kelola-artikel/delete/${articleId}.json`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Gagal menghapus artikel.");
    }

    const data = await response.json();
    return data; // Bisa return message atau status dari server
  } catch (err) {
    console.error("Error saat menghapus artikel:", err.message);
    throw err; // Dilempar lagi agar bisa ditangani di komponen induk
  }
}
