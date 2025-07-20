import React, { useState } from "react";
import loginUser from "../service/supabaseLogin";
import { navigate } from "astro:transitions/client";
import { cekRoleUser } from "./../service/cekRole";

export const Login = () => {
  // Anda tidak menggunakan variabel warna ini secara langsung di JSX setelah mengganti dengan Tailwind classes,
  // jadi Anda bisa menghapusnya jika tidak ada penggunaan lain.
  // const primaryColor = "#d4bfd3";
  // const secondaryColor = "#EDDAEC";
  // const lightPurpleColor = "#E9C6FA";
  // const lightestPinkColor = "#FDE2E2";
  // const textColor = "#4a4a4a";
  // const lightTextColor = "#6b6b6b";
  // const buttonDarkColor = "#333333";

  // State untuk form input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State untuk menampilkan/menyembunyikan password
  const [showPassword, setShowPassword] = useState(false);

  // State untuk pesan login (sukses/gagal)
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Handle submit form
  const handleLogin = async (event) => {
    event.preventDefault();
    setSuccessMessage(null); // Clear previous messages
    setErrorMessage(null);

    try {
      const data = await loginUser(email, password);
      console.log(data);
      setSuccessMessage(data.message || "Login berhasil!");
      cekRoleUser(navigate);
      // navigate("/mindbloom-home")
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error during login:", error);
      if (error.message === "Invalid login credentials") {
        setErrorMessage("Email atau kata sandi salah");
      } else if (error.message === "Failed to fetch") {
        setErrorMessage("Tidak ada koneksi internet");
      } else {
        setErrorMessage(error.message || "Login gagal. Silakan coba lagi.");
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 md:p-8 lg:p-12" // Tambah padding responsif
      style={{
        background: "linear-gradient(to bottom right, #FFF2E0, #C0C9EE)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div className="flex flex-col md:flex-row w-full max-w-sm md:max-w-4xl lg:max-w-6xl // Sesuaikan max-w berdasarkan breakpoint
      bg-white bg-opacity-90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
        {/* Bagian Kiri: Welcome Message */}
        <div
          className="w-full md:w-1/2 flex flex-col justify-center items-center text-center p-8 md:p-12 lg:p-16 // Sesuaikan padding
          py-12 md:py-0 // Tambahkan padding vertikal untuk mobile, hapus di md
          "
          style={{ backgroundColor: "#898AC4", color: "white" }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight"> {/* Ukuran teks responsif */}
            Senang bertemu kembali!
          </h1>
          <p className="text-base sm:text-lg md:text-xl leading-relaxed mt-2"> {/* Ukuran teks responsif */}
            Mari lanjutkan perjalananmu bersama MindBloom. Kami siap
            mendengarkan, kapan pun kamu butuh.
          </p>
        </div>

        {/* Form Login */}
        <form
          onSubmit={handleLogin}
          className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 // Sesuaikan padding
          flex flex-col justify-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-[#6F72B2]"> {/* Ukuran teks responsif */}
            Masuk
          </h2>
          <div className="w-full max-w-sm mx-auto space-y-4 sm:space-y-5"> {/* Sesuaikan max-w dan spasi */}
            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 sm:py-3 border border-[#C0C9EE] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#898AC4] text-base" // Ukuran padding dan teks responsif
              required
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 sm:py-3 border border-[#C0C9EE] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#898AC4] pr-10 text-base" // Ukuran padding dan teks responsif
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M4.293 6.707A1 1 0 015.707 5.293L10 9.586l4.293-4.293a1 1 0 111.414 1.414L11.414 11l4.293 4.293a1 1 0 01-1.414 1.414L10 12.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 11 4.293 6.707z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 3C5.523 3 1.733 5.943.458 10c1.275 4.057 5.065 7 9.542 7s8.267-2.943 9.542-7C18.267 5.943 14.477 3 10 3zM10 15a5 5 0 110-10 5 5 0 010 10z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Alert */}
            {successMessage && (
              <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg text-sm"> {/* Ukuran teks responsif */}
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg text-sm"> {/* Ukuran teks responsif */}
                {errorMessage}
              </div>
            )}

            {/* Button Login */}
            <button
              type="submit"
              className="w-full bg-[#A2AADB] hover:bg-[#898AC4] text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 text-lg" // Ukuran teks responsif
            >
              Masuk
            </button>

            {/* Lupa Password */}
            <p className="text-right text-xs sm:text-sm mt-2"> {/* Ukuran teks responsif */}
              <a
                href="/autentikasi/lupa-password"
                className="text-[#6F72B2] font-medium hover:underline"
              >
                Lupa password?
              </a>
            </p>

            {/* Register */}
            <p className="text-center text-xs sm:text-sm mt-4 text-gray-600"> {/* Ukuran teks responsif */}
              Belum punya akun?{" "}
              <a
                href="/autentikasi/regis"
                className="text-[#6F72B2] font-medium hover:underline"
              >
                Daftar di sini
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};