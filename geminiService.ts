import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generatePracticeSentence(level: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a simple practice sentence in Kannada for a beginner learning the topic: ${level}. 
    Provide the response in JSON format with the following structure:
    {
      "kannada": "sentence in Kannada script",
      "transliteration": "pronunciation in English",
      "english": "English translation",
      "explanation": "brief grammatical tip"
    }`,
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function speakText(text: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say clearly in Kannada: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const audioSrc = `data:audio/wav;base64,${base64Audio}`;
      const audio = new Audio(audioSrc);
      await audio.play();
    }
  } catch (error) {
    console.error("TTS Error:", error);
  }
}
