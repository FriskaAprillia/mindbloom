// src/pages/api/chat.ts (Contoh path untuk Astro APIRoute Anda)

import type { APIRoute } from "astro";

export const prerender = false;

// --- Get API Key ---
const GEMINI_API_KEY = import.meta.env.PUBLIC_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("❌ Gemini API key is missing from the environment variables!");
}

// Endpoint dan Model ID untuk Gemini API
const MODEL_ID = "gemini-2.0-flash-lite"; // Sesuai dengan model yang Anda gunakan sebelumnya
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent`;

// Definisi Tipe untuk Request Body dan Response (Opsional, tetapi disarankan untuk TypeScript)
interface MessagePart {
  text: string;
}

interface ChatMessage {
  role: "user" | "model";
  parts: MessagePart[];
}

interface GeminiRequestBody {
  contents: ChatMessage[];
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
  };
  safetySettings?: Array<{
    category: string;
    threshold: string;
  }>;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason: string;
    safetyRatings: Array<{
      category: string;
      probability: string;
      blocked: boolean; // Tambahan untuk mengecek apakah konten diblokir
    }>;
  }>;
  promptFeedback?: {
    blockReason?: string;
    safetyRatings?: Array<{
      category: string;
      probability: string;
      blocked: boolean;
    }>;
  };
}


export const POST: APIRoute = async ({ request }) => {
  try {
    // Pastikan request body adalah JSON
    if (request.headers.get("content-type") !== "application/json") {
      return new Response(JSON.stringify({ error: "Content-Type must be application/json" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { userMessage, chatHistory } = await request.json();

    if (!userMessage) {
      return new Response(JSON.stringify({ error: "userMessage is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const conversation: ChatMessage[] = [
      ...(chatHistory || []), // Gunakan chatHistory yang diterima atau array kosong jika tidak ada
      { role: "user", parts: [{ text: userMessage }] },
    ];

    // Struktur body sesuai dengan dokumentasi Gemini API
    const requestBody: GeminiRequestBody = {
      contents: conversation,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 200,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE", // Sesuaikan dengan nilai string
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
    };

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY, // API Key dikirim di header
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Gemini API Error:", errorData);
      return new Response(
        JSON.stringify({
          error: `Failed to get response from Gemini API: ${JSON.stringify(errorData)}`,
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data: GeminiResponse = await response.json();

    // Pastikan ada kandidat dan teks dalam respons
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content?.parts?.length > 0) {
      const responseText = data.candidates[0].content.parts[0].text;
      return new Response(JSON.stringify({ response: responseText }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else if (data.promptFeedback?.blockReason) {
        // Tangani kasus di mana prompt diblokir karena safety settings
        console.warn("Prompt blocked by Gemini API:", data.promptFeedback.blockReason);
        return new Response(JSON.stringify({ response: "I'm sorry, I cannot respond to that prompt due to safety guidelines." }), {
            status: 200, // Tetap 200 OK karena API merespons dengan sukses, tetapi konten diblokir
            headers: { "Content-Type": "application/json" },
        });
    } else {
      console.warn("No text found in Gemini API response:", data);
      return new Response(JSON.stringify({ response: "Sorry, I didn't get a clear response from the AI." }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

  } catch (error) {
    console.error("❌ Error in Astro APIRoute:", error);
    return new Response(JSON.stringify({ error: "An internal server error occurred." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};