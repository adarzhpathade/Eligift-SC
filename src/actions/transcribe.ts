"use server";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export async function transcribeAudio(base64Audio: string): Promise<{ success: boolean; text?: string; error?: string }> {
  try {
    const response = await ai.models.generateContent({
      model: process.env.AI_MODEL || "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: "audio/webm",
                data: base64Audio,
              },
            },
            {
              text: "Transcribe this audio to text. Return ONLY the transcribed text, nothing else. If the audio is in Hindi, transcribe it in Hindi script. If it is in English, transcribe in English. If no speech is detected, return an empty string.",
            },
          ],
        },
      ],
      config: {
        temperature: 0,
      },
    });

    const text = response.text?.trim() || "";
    return { success: true, text };
  } catch (error: any) {
    console.error("Transcription error:", error);
    return { success: false, error: error?.message || "Transcription failed" };
  }
}
