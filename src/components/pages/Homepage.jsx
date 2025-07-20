import { useState, useEffect } from "react";
import { getUserLogged, logoutUser } from "../service/getUserLogged";
import { navigate } from "astro:transitions/client";
import { sendMessageToChatbot } from "../../lib/chat";
import DaftarArtikel from "./homepage/DaftarArtikel";
import Edukasi from "./homepage/Edukasi";
import WhiteNoise from "./homepage/WhiteNoise";
import Chatbot from "./homepage/Chatbot";

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

Jawabanmu harus ringkas, hangat, maksimal 4-5 kalimat.
        `.trim(),
    },
  ],
};

const HomePage = () => {
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
    setUser(null);
    navigate("/autentikasi/login");
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    // Tutup sidebar setelah memilih tab di mobile
    setIsSidebarOpen(false);
  };

  const handleSendMessage = async (userMessage) => {
    const newUserMessage = { sender: "user", text: userMessage };
    setMessages((prev) => [...prev, newUserMessage]);

    const updatedHistory = [
      ...chatHistory,
      { role: "user", parts: [{ text: userMessage }] },
    ];
    const systemPrompt = chatHistory[0];
    const historyWithoutSystem = updatedHistory.slice(1);
    const last9 = historyWithoutSystem.slice(-9);
    const slicedHistory = [systemPrompt, ...last9];

    const botReply = await sendMessageToChatbot(userMessage, slicedHistory);
    const newBotMessage = { sender: "bot", text: botReply };
    setMessages((prev) => [...prev, newBotMessage]);

    setChatHistory([
      ...updatedHistory,
      { role: "model", parts: [{ text: botReply }] },
    ]);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const userData = await getUserLogged();
      setUser(userData);

      if (!userData) {
        navigate("/autentikasi/login");
      }
    };

    checkAuth();
  }, []);

  // Fungsi untuk mendapatkan title berdasarkan tab aktif
  const getTabTitle = () => {
    switch (activeTab) {
      case "chatbot":
        return "MindBloom";
      case "artikel":
        return "Artikel";
      case "edukasi":
        return "Edukasi";
      case "White Noise":
        return "White Noise";
      default:
        return "MindBloom";
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen h-[100dvh] bg-gray-100 font-sans overflow-hidden">
      {/* Header Mobile - Fixed position untuk menghindari masalah viewport */}
      <div className="md:hidden fixed top-0 left-0 right-0 p-3 bg-[#A2AADB] text-white flex justify-between items-center shadow-md z-40">
        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none p-2 rounded-md hover:bg-opacity-80 transition-colors"
          aria-label="Toggle Menu"
        >
          {isSidebarOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
        <h1 className="text-lg font-bold text-center flex-1 mx-2 truncate">
          {getTabTitle()}
        </h1>
        <div className="w-10" /> {/* Spacer untuk menyeimbangkan layout */}
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-[#C0C9EE] text-black
                    transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                    md:relative md:translate-x-0 
                    transition-transform duration-300 ease-in-out 
                    z-35 md:z-auto flex flex-col shadow-lg md:shadow-none
                    pt-16 md:pt-0`} // Tambah padding top untuk mobile
      >
        {/* Profil pengguna */}
        <div className="flex items-center p-4 border-b border-gray-300 flex-shrink-0">
          <div className="rounded-full bg-gray-600 h-10 w-10 flex items-center justify-center mr-3 flex-shrink-0">
            <svg
              className="w-6 h-6 text-gray-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <div className="flex-grow min-w-0">
            <div className="font-semibold text-sm truncate">
              {user ? user.namapengguna : "User"}
            </div>
            <div className="text-xs text-gray-700 truncate">
              {user ? user.emailpengguna : "Email"}
            </div>
          </div>
        </div>

        {/* Navigasi */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => handleTabClick("chatbot")}
                className={`flex items-center py-2.5 px-3 w-full text-left rounded-lg transition duration-200 ${
                  activeTab === "chatbot"
                    ? "bg-[#898AC4] text-white"
                    : "hover:bg-[#A2AADB] text-gray-800"
                }`}
              >
                <svg
                  className="w-5 h-5 mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.5 8.5 0 018 8.5z"
                  />
                </svg>
                <span className="font-medium">Chatbot</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTabClick("artikel")}
                className={`flex items-center py-2.5 px-3 w-full text-left rounded-lg transition duration-200 ${
                  activeTab === "artikel"
                    ? "bg-[#898AC4] text-white"
                    : "hover:bg-[#A2AADB] text-gray-800"
                }`}
              >
                <svg
                  className="w-5 h-5 mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <span className="font-medium">Artikel</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTabClick("edukasi")}
                className={`flex items-center py-2.5 px-3 w-full text-left rounded-lg transition duration-200 ${
                  activeTab === "edukasi"
                    ? "bg-[#898AC4] text-white"
                    : "hover:bg-[#A2AADB] text-gray-800"
                }`}
              >
                <svg
                  className="w-5 h-5 mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <span className="font-medium">Edukasi</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTabClick("White Noise")}
                className={`flex items-center py-2.5 px-3 w-full text-left rounded-lg transition duration-200 ${
                  activeTab === "White Noise"
                    ? "bg-[#898AC4] text-white"
                    : "hover:bg-[#A2AADB] text-gray-800"
                }`}
              >
                <svg
                  className="w-5 h-5 mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19V5l12-2v13M9 19a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="font-medium">White Noise</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Tombol logout */}
        <div className="p-4 border-t border-gray-300 flex-shrink-0">
          <button
            className="flex items-center justify-center w-full py-2.5 px-4 bg-red-600 text-white rounded-lg 
                       hover:bg-red-700 transition duration-200 font-medium"
            onClick={handleLogout}
          >
            <svg
              className="w-5 h-5 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Keluar
          </button>
        </div>
      </div>

      {/* Konten utama */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header desktop */}
        <header className="hidden md:flex items-center justify-center p-6 bg-[#A2AADB] shadow-md z-10 flex-shrink-0">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
            {getTabTitle()}
          </h1>
        </header>

        {/* Area konten utama */}
        <main className="flex-1 bg-[#A2AADB] overflow-hidden pt-20 mt-15 md:mt-0 md:pt-0">
          <div className="h-full flex flex-col p-3 md:p-6 lg:p-8">
            <div className="flex-1 overflow-hidden">
              {activeTab === "artikel" && (
                <div className="h-full overflow-y-auto">
                  <DaftarArtikel />
                </div>
              )}
              {activeTab === "chatbot" && (
                <div className="h-full">
                  <Chatbot
                    messages={messages}
                    onSendMessage={handleSendMessage}
                  />
                </div>
              )}
              {activeTab === "edukasi" && (
                <div className="h-full overflow-y-auto">
                  <Edukasi />
                </div>
              )}
              {activeTab === "White Noise" && (
                <div className="h-full overflow-y-auto">
                  <WhiteNoise />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;