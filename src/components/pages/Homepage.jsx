// Import React dan hook useState untuk manajemen state
import { useState, useEffect } from "react";
import { getUserLogged, logoutUser } from "../service/getUserLogged";
import { navigate } from "astro:transitions/client";
import { sendMessageToChatbot } from "../../lib/chat";
// Import komponen DaftarArtikel untuk menampilkan daftar artikel
import DaftarArtikel from "./homepage/DaftarArtikel";
import Edukasi from "./homepage/Edukasi";
import WhiteNoise from "./homepage/WhiteNoise";
import Chatbot from "./homepage/Chatbot";

// Mendefinisikan komponen fungsional HomePage
const systemPrompt = {
  role: "model",
  parts: [
    {
      text: `
Kamu adalah MindBloom, asisten konseling virtual yang hangat, sopan, dan empatik.

Tugas utamamu adalah membantu pengguna dalam topik-topik seperti:
- perasaan cemas, stres, kesepian, tidak bersemangat
- kesehatan mental, pengembangan diri, dan dukungan emosional

⚠️ Jangan menjawab pertanyaan yang tidak relevan dengan kesehatan mental. Jika pengguna menanyakan hal di luar topik (misalnya teknologi, sejarah, matematika, dll), balas dengan sopan menggunakan kalimat seperti:

"Topik itu di luar kemampuan saya sebagai konselor kesehatan mental. Namun jika kamu ingin bicara soal perasaan, stres, atau kehidupan pribadi, aku siap mendengarkan."

Jangan memberi informasi teknis atau pengetahuan umum. Fokuskan dirimu pada mendengarkan dan mendukung pengguna secara emosional.

Jawabanmu harus ringkas, hangat, maksimal 4–5 kalimat.
        `.trim(),
    },
  ],
};

const HomePage = () => {
  // State untuk mengelola visibilitas sidebar di perangkat seluler
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("chatbot");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Halo! Saya MindBloom, chatbot Anda. Bagaimana saya bisa membantu hari ini?",
    },
  ]);
  const [chatHistory, setChatHistory] = useState([
    systemPrompt,
    {
      role: "model",
      parts: [
        {
          text: "Halo! Saya MindBloom, chatbot Anda. Bagaimana saya bisa membantu hari ini?",
        },
      ],
    },
  ]);

  // Fungsi untuk mengubah status sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUserLogged();
      setUser(userData);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null); // clear user state
    navigate("/autentikasi/login");
  };
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    // Tutup sidebar jika di perangkat seluler
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };
  const handleSendMessage = async (userMessage) => {
    // Tampilkan pesan user di UI
    const newUserMessage = { sender: "user", text: userMessage };
    setMessages((prev) => [...prev, newUserMessage]);

    // Tambahkan ke chatHistory (dikirim ke Gemini)
    const updatedHistory = [
      ...chatHistory,
      { role: "user", parts: [{ text: userMessage }] },
    ];
    const systemPrompt = chatHistory[0]; // asumsikan 1 system prompt di awal
    const historyWithoutSystem = updatedHistory.slice(1); // sisanya

    const last9 = historyWithoutSystem.slice(-9); // ambil 9 terakhir
    const slicedHistory = [systemPrompt, ...last9]; // gabungin lagi

    // Kirim semua riwayat ke API
    const botReply = await sendMessageToChatbot(userMessage, slicedHistory);

    // Tambahkan balasan ke UI
    const newBotMessage = { sender: "bot", text: botReply };
    setMessages((prev) => [...prev, newBotMessage]);

    // Update chatHistory juga
    setChatHistory([
      ...updatedHistory,
      { role: "model", parts: [{ text: botReply }] },
    ]);
  };
  useEffect(() => {
    const checkAuth = async () => {
      const userData = await getUserLogged();
      setUser(userData);

      // Kalau user tidak ada, redirect ke login
      if (!userData) {
        navigate("/autentikasi/login");
      }
    };

    checkAuth();
  }, []);

  return (
    // Kontainer utama aplikasi, menggunakan flexbox untuk tata letak
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 font-sans">
      {/* Tombol menu hamburger untuk tampilan seluler */}
      <div className="md:hidden p-4 bg-[#A2AADB] text-white flex justify-between items-center">
        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none"
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
        <h1 className="text-xl font-bold">MindBloom</h1>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-[#C0C9EE] text-black p-6 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-20 md:flex md:flex-col`}
      >
        {/* Bagian profil pengguna di sidebar */}
        <div className="flex items-center mb-8">
          <div className="rounded-full bg-gray-600 h-12 w-12 flex items-center justify-center mr-4">
            <svg
              className="w-8 h-8 text-gray-300"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
            </svg>
          </div>
          <div>
            <div className="font-semibold text-lg">
              {user ? user.namapengguna : "User"}
            </div>
            <div className="text-sm text-black break-all">
              {" "}
              {/* Tambahkan break-all di sini */}
              {user ? user.emailpengguna : "Email"}
            </div>
          </div>
        </div>

        {/* Logo aplikasi di sidebar, terlihat di tampilan desktop */}

        {/* Navigasi sidebar */}
        <nav className="flex-grow">
          <ul>
            <li
              className={`mb-4 rounded-lg transition duration-200 ${
                activeTab === "chatbot"
                  ? "bg-[#898AC4] text-black"
                  : "hover:bg-[#A2AADB] text-black"
              }`}
            >
              <button
                onClick={() => handleTabClick("chatbot")}
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
                    d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.5 8.5 0 018 8.5z"
                  />
                </svg>
                Chatbot
              </button>
            </li>
            <li
              className={`mb-4 rounded-lg transition duration-200 ${
                activeTab === "artikel"
                  ? "bg-[#898AC4] text-black"
                  : "hover:bg-[#A2AADB] text-black"
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
                activeTab === "edukasi"
                  ? "bg-[#898AC4] text-black"
                  : "hover:bg-[#A2AADB] text-black"
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
                activeTab === "White Noise"
                  ? "bg-[#898AC4] text-black"
                  : "hover:bg-[#A2AADB] text-black"
              }`}
            >
              <button
                onClick={() => handleTabClick("White Noise")}
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
                    d="M9 19V5l12-2v13M9 19a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                White Noise
              </button>
            </li>
          </ul>
        </nav>

        {/* Tombol keluar di sidebar */}
        <div className="mt-auto">
          <button
            className="flex items-center justify-center w-full py-2 px-4 bg-red-600 rounded-lg hover:bg-red-700 transition duration-200"
            onClick={handleLogout}
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
      <div className="flex-1 flex  flex-col overflow-hidden">
        {/* Header di konten utama (MindBloom) - hanya terlihat di desktop */}
        <header className="hidden md:flex items-center justify-center p-6 bg-[#A2AADB] shadow-md">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-gray-800">
              {activeTab === "chatbot"
                ? "MindBloom"
                : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
          </div>
          {/* Anda bisa menambahkan elemen header lainnya di sini jika diperlukan */}
        </header>

        {/* Area konten utama */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#A2AADB] p-6 pt-0">
          <div className="container mx-auto h-full flex flex-col">
            {" "}
            {/* <-- Kunci perbaikan di sini */}
            {activeTab === "home" && (
              <>
                <h2 className="text-4xl font-bold text-gray-700 mb-6 text-center md:text-left">
                  Welcome
                </h2>
              </>
            )}
            {activeTab === "artikel" && <DaftarArtikel />}
            {activeTab === "chatbot" && (
              <div className="flex-1 ">
                {" "}
                {/* <-- Dan di sini */}
                <Chatbot
                  messages={messages}
                  onSendMessage={handleSendMessage}
                />
              </div>
            )}
            {activeTab === "edukasi" && <Edukasi />}
            {activeTab === "White Noise" && <WhiteNoise />}
          </div>
        </main>
      </div>
    </div>
  );
};
export default HomePage;
