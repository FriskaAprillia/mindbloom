import React from "react";

const ModalKonfirmasi = ({ user, onClose, onConfirm, isDeleting, deleteSuccess }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow text-center w-[300px]">
        {deleteSuccess ? (
          <div className="text-green-600 font-semibold">Pengguna berhasil dihapus ✅</div>
        ) : (
          <>
            <p>Yakin ingin menghapus <b>{user.namapengguna}</b>?</p>
            <div className="flex justify-center gap-3 mt-4">
              <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">
                Batal
              </button>
              <button
                onClick={() => onConfirm(user.idpengguna)}
                className="px-3 py-1 bg-red-500 text-white rounded flex items-center gap-2"
                disabled={isDeleting}
              >
                {isDeleting && (
                  <span className="loader w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {isDeleting ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ModalKonfirmasi;
