export const fetchWhiteNoise = async () => {
   const response = await fetch("/api/white-noise/get-all.json");
   if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
   }
   const data = await response.json();
   return data.white_noise || [];
};

export const insertWhiteNoise = async (whitenoise) => {
  const response = await fetch("/api/white-noise/tambah-wn.json", {
    method: "POST",
    body: JSON.stringify(whitenoise),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Gagal insert whitenoise");
  }

  return result.white_noise;
};

// lib/api/artikel/editArtikel.js

export const updateWhiteNoise = async (idWhitenoise, updatedData) => {
   try {
      const response = await fetch(`/api/white-noise/edit/${idWhitenoise}.json`, {
         method: "PUT",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.error || "Gagal mengedit whitenoise.");
      }

      const result = await response.json();
      return result;
   } catch (error) {
      console.error("❌ Gagal saat memanggil whitenoise:", error.message);
      throw error;
   }
};




export async function deleteWhiteNoiseiById(whitenoiseId) {
  try {
    const response = await fetch(`/api/white-noise/delete/${whitenoiseId}.json`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Gagal menghapus whitenoise.");
    }

    const data = await response.json();
    return data; // Bisa return message atau status dari server
  } catch (err) {
    console.error("Error saat menghapus whitenoise:", err.message);
    throw err; // Dilempar lagi agar bisa ditangani di komponen induk
  }
}
