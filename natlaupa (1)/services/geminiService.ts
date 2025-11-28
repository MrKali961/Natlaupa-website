import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

// Initialize client only when needed to adhere to constraints about API Key handling
const getAiClient = (): GoogleGenAI => {
  if (!aiClient) {
    // Ideally this comes from process.env.API_KEY, handled by the environment
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }
  return aiClient;
};

export const generateTravelAdvice = async (userQuery: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userQuery,
      config: {
        systemInstruction: "You are an elite travel concierge for Natlaupa, a luxury hotel booking platform. Your tone is sophisticated, brief, and inspiring. Recommend destinations or hotel types based on the user's mood. Keep responses under 50 words.",
      }
    });
    return response.text || "I apologize, I am currently unable to access the travel archives. Please try again later.";
  } catch (error) {
    console.error("AI Service Error:", error);
    return "Our concierge service is momentarily unavailable.";
  }
};
