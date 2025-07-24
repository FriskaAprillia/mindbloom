// src/utils/api/whiteNoise.js
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
    // Log pesan error yang lebih detail dari API jika respons tidak OK
    console.error("API response not OK during white noise insert:", result);
    throw new Error(result.message || "Gagal insert whitenoise");
  }

  // Tambahkan pemeriksaan defensif di sini
  // Pastikan 'result' adalah objek dan memiliki properti 'white_noise' yang terdefinisi
  if (!result || typeof result !== 'object' || !result.white_noise) {
    console.error("API returned unexpected data structure for white noise insert:", result);
    throw new Error("Gagal mendapatkan data white noise dari respons API. Struktur data tidak sesuai.");
  }

  return result.white_noise; // Pastikan ini mengembalikan objek yang valid
};

export const fetchWhiteNoise = async () => {
   const response = await fetch("/api/white-noise/get-all.json");
   if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
   }
   const data = await response.json();
   return data.white_noise || [];
};


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