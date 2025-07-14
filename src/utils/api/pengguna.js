export const fetchUsers = async () => {
   const response = await fetch("/api/kelola-pengguna/get-all.json");
   if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
   }
   const data = await response.json();
   return data.pengguna;
};

// userHandlers.js

// userHandlers.js

export const deleteUser = async ({
   userId,
   setListPengguna,
}) => {
   try {

      const response = await fetch(
         `/api/kelola-pengguna/delete/${userId}.json`,
         {
            method: "DELETE",
         }
      );

      if (!response.ok) {
         throw new Error("Gagal menghapus pengguna.");
      }

      setListPengguna((prev) => prev.filter((u) => u.idpengguna !== userId));
      alert("✅ Pengguna berhasil dihapus!");

   } catch (error) {
      console.error("Error saat menghapus pengguna:", error.message);
      alert("❌ Gagal menghapus pengguna.");
   }
};
