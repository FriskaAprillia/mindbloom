// src/pages/api/youtube/get-title.json.ts

import type { APIRoute } from "astro";

export const prerender = false;

const YOUTUBE_API_KEY = import.meta.env.YOUTUBE_API_KEY; // Ambil API key dari environment variable
const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/videos";

export const GET: APIRoute = async ({ url }) => {
  const videoUrl = url.searchParams.get("url");

  if (!videoUrl) {
    return new Response(
      JSON.stringify({ error: "URL video wajib disertakan." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const extractYoutubeId = (link: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = link.match(regex);
    return match ? match[1] : null;
  };

  const videoId = extractYoutubeId(videoUrl);

  if (!videoId) {
    return new Response(
      JSON.stringify({ error: "URL video tidak valid." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const apiResponse = await fetch(
      `${YOUTUBE_API_URL}?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );
    const data = await apiResponse.json();

    if (!apiResponse.ok) {
        console.error("YouTube API Error:", data);
        return new Response(
            JSON.stringify({ error: data.error.message || "Gagal mengambil data dari YouTube." }),
            { status: apiResponse.status, headers: { "Content-Type": "application/json" } }
        );
    }
    
    if (data.items && data.items.length > 0) {
      const title = data.items[0].snippet.title;
      return new Response(
        JSON.stringify({ title }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else {
      return new Response(
        JSON.stringify({ error: "Video tidak ditemukan atau data tidak valid." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

  } catch (error) {
    console.error("Error fetching YouTube title:", error);
    return new Response(
      JSON.stringify({ error: "Terjadi kesalahan server saat mengambil judul video." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};