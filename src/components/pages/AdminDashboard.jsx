import React from "react";
import { useState, useEffect } from "react";
import { logoutUser } from "../service/getUserLogged";
import { navigate } from "astro:transitions/client";
import { fetchUsers, deleteUser } from "../../utils/api/pengguna";
import {
  fetchArtikelCount,
  fetchEdukasiCount,
  fetchUserCount,
  fetchWhiteNoiseCount,
} from "../../utils/api/fetchCountContent";
import {
  fetchArtikel,
  insertArtikel,
  editArtikel,
  deleteArtikelById,
} from "../../utils/api/artikel";
import {
  fetchEdukasi,
  insertEdukasi,
  updateEdukasi,
  deleteEdukasiById,
} from "../../utils/api/edukasi";
import {
  fetchWhiteNoise,
  updateWhiteNoise,
  insertWhiteNoise,
  deleteWhiteNoiseiById,
} from "../../utils/api/whiteNoise";
import ModalKonfirmasi from "../Modal";
import ModalInsertArtikel from "../ModalInsertArtikel";
import ModalInsertKonten from "../ModalInsertKonten";

import KelolaPengguna from "./dashboardAdmin/KelolaPengguna";
import KelolaArtikel from "./dashboardAdmin/KelolaArtikel";

import KelolaEdukasi from "./dashboardAdmin/KelolaEdukasi";
import KelolaWhiteNoise from "./dashboardAdmin/KelolaWhiteNoise";

const AdminDashboard = () => {
  //fetch count
  const [totalArtikelCount, setTotalArtikelCount] = useState(0);
  const [totalWhiteNoiseCount, setTotalWhiteNoiseCount] = useState(0);
  const [totalEdukasiCount, setTotalEdukasiCount] = useState(0);
  const [totalPenggunaCount, setTotalPenggunaCount] = useState(0);
  const [dashboardCountsLoaded, setDashboardCountsLoaded] = useState(false); // Flag untuk melacak pemuatan count
  // State untuk mengelola visibilitas sidebar di perangkat seluler
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isPenggunaLoaded, setIsPenggunaLoaded] = useState(false);
  const [listPengguna, setListPengguna] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [isModalInsertKontenOpen, setIsModalInsertKontenOpen] = useState(false);
  const [dataToEdit, setDataToEdit] = useState(null);

  //artikel
  const [listArtikel, setListArtikel] = useState([]);
  const [isArtikelLoaded, setIsArtikelLoaded] = useState(false);
  const [isModalArtikelOpen, setIsModalArtikelOpen] = useState(false);
  const [editingArtikel, setEditingArtikel] = useState(null);

  //edukasi
  const [listEdukasi, setListEdukasi] = useState([]);
  const [isEdukasiLoaded, setIsEdukasiLoaded] = useState(false);

  //white noise
  const [listWhiteNoise, setListWhiteNoise] = useState([]);

  const [isWhiteNoiseLoaded, setIsWhiteNoiseLoaded] = useState(false);

  const handleOpenArtikelModal = () => setIsModalArtikelOpen(true);
  const handleCloseArtikelModal = () => setIsModalArtikelOpen(false);

  // Fungsi untuk mengubah status sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  const handleLogout = async () => {
    await logoutUser();
    // redirect ke halaman login, misalnya:
    navigate("autentikasi/login");
  };
  useEffect(() => {
    if (editingArtikel !== null) {
      setIsModalArtikelOpen(true);
    }
  }, [editingArtikel]);

  const handleEditArticle = (articleId) => {
    const artikelToEdit = listArtikel.find((a) => a.idartikel === articleId);
    setEditingArtikel(artikelToEdit);
  };
  const handleDeleteKonten = (id) => {
    if (activeTab === "edukasi") {
      deleteEdukasiById(id)
        .then(() => {
          setListEdukasi((prev) =>
            prev.filter((item) => item.idedukasi !== id)
          );
          alert("✅ Konten edukasi berhasil dihapus!");
          setTotalEdukasiCount((prev) => prev - 1);
        })
        .catch((err) => {
          alert("❌ Gagal menghapus konten edukasi.");
        });
    } else if (activeTab === "white-noise") {
      deleteWhiteNoiseiById(id)
        .then(() => {
          setListWhiteNoise((prev) =>
            prev.filter((item) => item.idwhitenoise !== id)
          );
          alert("✅ Konten white noise berhasil dihapus!");
          setTotalWhiteNoiseCount((prev) => prev - 1);
        })
        .catch((err) => {
          alert("❌ Gagal menghapus konten white noise.");
        });
    }
  };

  const handleUpdateArtikel = async (updatedArticle) => {
    try {
      await editArtikel(updatedArticle.idartikel, updatedArticle);
      alert("✅ Artikel berhasil diperbarui!");

      // Update artikel di state
      setListArtikel((prev) =>
        prev.map((item) =>
          item.idartikel === updatedArticle.idartikel ? updatedArticle : item
        )
      );

      setIsModalArtikelOpen(false); // Tutup modal
      setEditingArtikel(null); // Reset
    } catch (err) {
      console.error("Gagal update artikel:", err.message);
    }
  };

  const handleInsertArtikel = async (newArticle) => {
    try {
      // Kirim data ke API untuk disimpan ke Supabase
      const inserted = await insertArtikel(newArticle);

      // Update state lokal
      setListArtikel((prev) => [...prev, inserted]);
      setTotalArtikelCount((prev) => prev + 1);

      // Bisa tambahin notifikasi sukses juga kalau mau
      alert("✅ Artikel berhasil disimpan!");
    } catch (error) {
      alert("❌ Gagal menyimpan artikel.");
    }
  };

  const handleDeleteArticle = async (id) => {
    try {
      await deleteArtikelById(id); // gunakan fungsi yang sudah diekstrak

      alert("✅ Artikel berhasil dihapus!");
      setListArtikel((prev) => prev.filter((a) => a.idartikel !== id));
      setTotalArtikelCount((prev) => prev - 1);
    } catch (err) {
      console.error("Error saat hapus artikel:", err.message);
      alert("❌ Gagal menghapus artikel.");
    }
  };
  // Tombol tambah
  const handleAddKonten = () => {
    setDataToEdit(null); // ini bikin mode jadi "TAMBAH"
    setIsModalInsertKontenOpen(true);
    console.log("🔥 Modal render");
  };

  // Tombol edit
  const handleEditKonten = (id) => {
    setIsModalInsertKontenOpen(true);
    if (activeTab === "edukasi") {
      const kontenToEdit = listEdukasi.find((item) => item.idedukasi === id);
      setDataToEdit(kontenToEdit);
    } else if (activeTab === "white-noise") {
      const kontenToEdit = listWhiteNoise.find(
        (item) => item.idwhitenoise === id
      );
      setDataToEdit(kontenToEdit);
    } else if (activeTab === "artikel") {
      const kontenToEdit = listArtikel.find((item) => item.idartikel === id);
      setDataToEdit(kontenToEdit);
    }
  };
  const handleSubmitKonten = (data) => {
    if (activeTab === "edukasi") {
      if (data?.idedukasi) {
        onEditKonten(data);
      } else {
        onInsertKontenBaru(data);
      }
    } else if (activeTab === "white-noise") {
      if (data?.idwhitenoise) {
        onEditKonten(data);
      } else {
        onInsertKontenBaru(data);
      }
    } else if (activeTab === "artikel") {
      if (data?.idartikel) {
        onEditKonten(data);
      } else {
        onInsertKontenBaru(data);
      }
    }
  };

  // Fungsi simpan insert/update
  const onInsertKontenBaru = async (data) => {
    console.log("🎯 onInsertKonten jalan");

    try {
      if (activeTab === "edukasi") {
        console.log("data", data);
        await insertEdukasi(data);
        setListEdukasi((prev) => [...prev, data]);
        setIsModalInsertKontenOpen(false);
        alert("✅ Konten berhasil ditambahkan!");
        setTotalEdukasiCount((prev) => prev + 1);
      } else if (activeTab === "white-noise") {
        console.log("data", data);

        await insertWhiteNoise(data);
        setListWhiteNoise((prev) => [...prev, data]);
        setIsModalInsertKontenOpen(false);
        alert("✅ Konten berhasil ditambahkan!");
        setTotalWhiteNoiseCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error saat menambahkan konten:", error.message);
      alert("❌ Gagal menambahkan konten.");
    }
  };

  const onEditKonten = async (data) => {
    try {
      if (activeTab === "edukasi") {
        await updateEdukasi(data.idedukasi, data);
        setListEdukasi((prev) =>
          prev.map((item) => (item.idedukasi === data.idedukasi ? data : item))
        );
      } else if (activeTab === "white-noise") {
        await updateWhiteNoise(data.idwhitenoise, data);
        setListWhiteNoise((prev) =>
          prev.map((item) =>
            item.idwhitenoise === data.idwhitenoise ? data : item
          )
        );
      } else if (activeTab === "artikel") {
        await updateArtikel(data.idartikel, data);
        setListArtikel((prev) =>
          prev.map((item) => (item.idartikel === data.idartikel ? data : item))
        );
      }

      setIsModalInsertKontenOpen(false);
      alert("✅ Konten berhasil diperbarui!");
    } catch (error) {
      console.error("Error saat mengedit konten:", error.message);
      alert("❌ Gagal memperbarui konten.");
    }
  };

  const onConfirmDelete = async (userId) => {
    try {
      await deleteUser({ userId, setListPengguna });
      setSelectedUser(null); // Reset selected user after deletion
      alert("✅ Pengguna berhasil dihapus!");
      setTotalPenggunaCount((prev) => prev - 1);
    } catch (error) {
      console.error("Error saat menghapus pengguna:", error.message);
      alert("❌ Gagal menghapus pengguna.");
    }
  };
  useEffect(() => {
    if (dashboardCountsLoaded) return; // Muat hanya sekali

    const loadDashboardCounts = async () => {
      try {
        // Anda perlu membuat fungsi-fungsi ini di file API Supabase yang sesuai
        // yang mengambil 'count' dari tabel.
        const [artikelCount, whiteNoiseCount, edukasiCount, penggunaCount] =
          await Promise.all([
            fetchArtikelCount(),
            fetchWhiteNoiseCount(),
            fetchEdukasiCount(),
            fetchUserCount(),
          ]);

        setTotalArtikelCount(artikelCount);
        setTotalWhiteNoiseCount(whiteNoiseCount);
        setTotalEdukasiCount(edukasiCount);
        setTotalPenggunaCount(penggunaCount);
        setDashboardCountsLoaded(true); // Set flag menjadi true agar tidak dimuat lagi
      } catch (err) {
        console.error("Error loading dashboard counts:", err);
        setError("Gagal memuat data dashboard.");
      }
    };

    loadDashboardCounts();
  }, [dashboardCountsLoaded]); // Dependensi 'dashboardCountsLoaded' memastikan ini hanya berjalan sekali

  useEffect(() => {
    if (activeTab !== "pengguna" || isPenggunaLoaded) return;

    let isMounted = true;

    const loadUsers = async () => {
      try {
        const pengguna = await fetchUsers();
        if (isMounted) {
          setListPengguna(pengguna);
          setIsPenggunaLoaded(true);
        }
      } catch (error) {
        if (isMounted) setError(error.message);
      }
    };

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, [activeTab, isPenggunaLoaded]);

  useEffect(() => {
    if (activeTab !== "artikel" || isArtikelLoaded) return;

    let isMounted = true;
    const loadArtikel = async () => {
      try {
        const artikel = await fetchArtikel(); // bikin fungsi ini di file `artikel.js`
        if (isMounted) {
          setListArtikel(artikel);
          setIsArtikelLoaded(true);
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      }
    };

    loadArtikel();
    return () => {
      isMounted = false;
    };
  }, [activeTab, isArtikelLoaded]);
  useEffect(() => {
    if (activeTab !== "edukasi" || isEdukasiLoaded) return;

    let isMounted = true;
    const loadEdukasi = async () => {
      try {
        const edukasi = await fetchEdukasi(); // bikin fungsi ini di file `edukasi.js`
        if (isMounted) {
          setListEdukasi(edukasi);
          setIsEdukasiLoaded(true);
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      }
    };

    loadEdukasi();
    return () => {
      isMounted = false;
    };
  }, [activeTab, isEdukasiLoaded]);

  useEffect(() => {
    if (activeTab !== "white-noise" || isWhiteNoiseLoaded) return;

    let isMounted = true;
    const loadWhiteNoise = async () => {
      try {
        const whiteNoise = await fetchWhiteNoise();
        console.log("🎧 WhiteNoise data:", whiteNoise);
        if (isMounted) {
          setListWhiteNoise(whiteNoise);
          setIsWhiteNoiseLoaded(true);
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      }
    };

    loadWhiteNoise();
    return () => {
      isMounted = false;
    };
  }, [activeTab, isWhiteNoiseLoaded]);

  return (
    // Kontainer utama aplikasi, menggunakan flexbox untuk tata letak
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 font-sans">
      {/* Tombol menu hamburger untuk tampilan seluler */}
      <div className="md:hidden p-4 bg-gray-800 text-white flex justify-between items-center">
        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none z-50"
        >
          {/* Ikon hamburger atau X tergantung pada status sidebar */}
          {isSidebarOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          )}
        </button>
        <h1 className="text-xl font-bold">Dashboard Admin</h1>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white p-6 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-20 md:flex md:flex-col`}
      >
        {/* Navigasi sidebar */}
        <nav className="flex-grow">
          <ul>
            <li
              className={`mb-4 rounded-lg transition duration-200 ${
                activeTab === "dashboard"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 text-gray-300"
              }`}
            >
              <button
                onClick={() => handleTabClick("dashboard")}
                className="flex items-center py-2 px-4 rounded-lg"
              >
                <svg
                  className="w-6 h-6 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6"
                  ></path>
                </svg>
                Dashboard
              </button>
            </li>
            <li
              className={`mb-4 rounded-lg transition duration-200 ${
                activeTab === "artikel"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 text-gray-300"
              }`}
            >
              <button
                onClick={() => handleTabClick("artikel")}
                className="flex items-center py-2 px-4"
              >
                <svg
                  className="w-6 h-6 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  ></path>
                </svg>
                Artikel
              </button>
            </li>
            <li
              className={`mb-4 rounded-lg transition duration-200 ${
                activeTab === "white-noise"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 text-gray-300"
              }`}
            >
              <button
                onClick={() => handleTabClick("white-noise")}
                className="flex items-center py-2 px-4"
              >
                <svg
                  className="w-6 h-6 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19V6l12-3v13M9 19a3 3 0 11-6 0 3 3 0 016 0zm12-3a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                White Noise
              </button>
            </li>
            <li
              className={`mb-4 rounded-lg transition duration-200 ${
                activeTab === "edukasi"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 text-gray-300"
              }`}
            >
              <button
                onClick={() => handleTabClick("edukasi")}
                className="flex items-center py-2 px-4"
              >
                <svg
                  className="w-6 h-6 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  ></path>
                </svg>
                Edukasi
              </button>
            </li>
            <li
              className={`mb-4 rounded-lg transition duration-200 ${
                activeTab === "pengguna"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 text-gray-300"
              }`}
            >
              <button
                onClick={() => handleTabClick("pengguna")}
                className="flex items-center py-2 px-4"
              >
                <svg
                  className="w-6 h-6 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5.121 17.804A8.966 8.966 0 0112 15c2.21 0 4.216.802 5.879 2.137M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Pengguna
              </button>
            </li>
          </ul>
        </nav>

        {/* Tombol keluar di sidebar */}
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full py-2 px-4 bg-red-600 rounded-lg hover:bg-red-700 transition duration-200"
          >
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              ></path>
            </svg>
            Keluar
          </button>
        </div>
      </div>

      {/* Konten utama */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header di konten utama (Dashboard) */}
        <header className="flex items-center p-6 bg-white shadow-md">
          <h1 className="text-2xl font-bold text-gray-800">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h1>
        </header>

        {/* Area konten utama */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {activeTab === "dashboard" && (
            <div className="container mx-auto">
              {/* Kotak ringkasan data */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Card Total Artikel */}
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
                  <div className="rounded-full bg-blue-200 h-16 w-16 flex items-center justify-center mb-4">
                    <span className="text-2xl">📰</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-700">
                    Total Artikel
                  </div>
                  <div className="text-3xl font-bold text-blue-600">
                    {totalArtikelCount}
                  </div>
                </div>

                {/* Card White Noise */}
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
                  <div className="rounded-full bg-green-200 h-16 w-16 flex items-center justify-center mb-4">
                    <span className="text-2xl">🎵</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-700">
                    White Noise
                  </div>
                  <div className="text-3xl font-bold text-green-600">
                    {totalWhiteNoiseCount}
                  </div>
                </div>

                {/* Card Materi Edukasi */}
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
                  <div className="rounded-full bg-purple-200 h-16 w-16 flex items-center justify-center mb-4">
                    <span className="text-2xl">📚</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-700">
                    Materi Edukasi
                  </div>
                  <div className="text-3xl font-bold text-purple-600">
                    {totalEdukasiCount}
                  </div>
                </div>

                {/* Card Pengguna Terdaftar */}
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
                  <div className="rounded-full bg-red-200 h-16 w-16 flex items-center justify-center mb-4">
                    <span className="text-2xl">👨‍👨‍👧‍👦</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-700">
                    Pengguna Terdaftar
                  </div>
                  <div className="text-3xl font-bold text-red-600">
                    {totalPenggunaCount}
                  </div>
                </div>
              </div>

              {/* Pesan selamat datang */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-700">
                  Selamat datang di halaman admin. Gunakan menu di samping untuk
                  mengelola konten website
                </p>
              </div>
            </div>
          )}
          {activeTab === "artikel" && (
            <KelolaArtikel
              articles={listArtikel}
              onAddArticle={handleOpenArtikelModal}
              onEditArticle={handleEditArticle}
              onDeleteArticle={handleDeleteArticle}
            />
          )}
          {activeTab === "white-noise" && (
            <KelolaWhiteNoise
              key={listWhiteNoise.map((item) => item.id)} // Memastikan komponen me-render ulang saat data berubah
              whiteNoises={listWhiteNoise}
              onAddWhiteNoise={handleAddKonten}
              onEditWhiteNoise={handleEditKonten}
              onDeleteWhiteNoise={handleDeleteKonten}
            />
          )}
          {activeTab === "edukasi" && (
            <KelolaEdukasi
              educations={listEdukasi}
              onAddEducation={handleAddKonten}
              onEditEducation={handleEditKonten}
              onDeleteEducation={handleDeleteKonten}
            />
          )}
          {activeTab === "pengguna" && (
            <KelolaPengguna
              users={listPengguna}
              onRequestDelete={onConfirmDelete} // ✅ Kirimkan fungsinya saja
            />
          )}
          {isModalArtikelOpen && (
            <ModalInsertArtikel
              isOpen={isModalArtikelOpen}
              onClose={() => {
                setIsModalArtikelOpen(false);
                setEditingArtikel(null); // reset setelah tutup modal
              }}
              onInsert={
                editingArtikel ? handleUpdateArtikel : handleInsertArtikel
              }
              editData={editingArtikel}
            />
          )}
          {isModalInsertKontenOpen && (
            <ModalInsertKonten
              isOpen={isModalInsertKontenOpen}
              onClose={() => setIsModalInsertKontenOpen(false)}
              onInsert={handleSubmitKonten}
              editData={dataToEdit}
              tipeKonten={activeTab}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
