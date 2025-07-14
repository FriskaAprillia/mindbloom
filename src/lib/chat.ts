// src/utils/chat.ts

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  type Content,
} from "@google/generative-ai";

// --- Get API Key ---
const GEMINI_API_KEY = import.meta.env.PUBLIC_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("❌ Gemini API key is missing from the environment variables!");
}

// Initialize the Gemini model
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

// Message structure
type Role = "user" | "model";

interface MessagePart {
  text: string;
}

interface ChatMessage {
  role: Role;
  parts: MessagePart[];
}

/**
 * Sends a message to the Gemini chatbot and returns the response.
 * @param userMessage - The user's input message.
 * @param chatHistory - Previous conversation context in Gemini format.
 * @returns AI-generated response as plain text.
 */
export async function sendMessageToChatbot(
  userMessage: string,
  chatHistory: ChatMessage[] = []
): Promise<string> {
  try {
    const conversation: Content[] = [
      ...chatHistory,
      { role: "user", parts: [{ text: userMessage }] },
    ];

    const result = await geminiModel.generateContent({
      contents: conversation,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 200,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    const responseText = result.response.text();
    return responseText ?? "Sorry, I didn't get a response from the AI.";
  } catch (error) {
    console.error("❌ Failed to send message to chatbot:", error);
    return "An error occurred while processing your request. Please try again.";
  }
}
