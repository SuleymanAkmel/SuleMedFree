import { GoogleGenAI, Type } from "@google/genai";
import { Question, MedicalCategory, MedicalSubject, NoteSection, Flashcard } from "../types";

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === 'undefined' || apiKey.length < 10) {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateNotes = async (system: MedicalCategory, subject: MedicalSubject): Promise<NoteSection[]> => {
  try {
    const ai = getAI();
    const prompt = `Act as a senior medical consultant. Provide 3 high-yield clinical notes for: ${system} - ${subject}.
    Include clinical correlates and 2 mnemonics per topic.
    visualSearchKeyword: A simple 2-word medical term for an image search.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              mnemonics: { type: Type.ARRAY, items: { type: Type.STRING } },
              clinicalCorrelate: { type: Type.STRING },
              imageDescription: { type: Type.STRING },
              visualSearchKeyword: { type: Type.STRING }
            },
            required: ["title", "content", "mnemonics", "clinicalCorrelate", "imageDescription", "visualSearchKeyword"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (err: any) {
    console.error("Gemini Error:", err);
    if (err.message?.includes("403") || err.message?.includes("permission")) throw new Error("PERMISSION_DENIED");
    throw err;
  }
};

export const generateFlashcards = async (system: MedicalCategory, subject: MedicalSubject): Promise<Flashcard[]> => {
  try {
    const ai = getAI();
    const prompt = `Create 8 active-recall flashcards for ${system} - ${subject}. Focus on high-yield clinical signs and pathophysiology.`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              front: { type: Type.STRING },
              back: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["front", "back", "explanation"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (err: any) {
    if (err.message?.includes("403") || err.message?.includes("permission")) throw new Error("PERMISSION_DENIED");
    throw err;
  }
};

export const generateQuestions = async (system: MedicalCategory, subject: MedicalSubject, count: number = 5): Promise<Question[]> => {
  try {
    const ai = getAI();
    const prompt = `Generate ${count} USMLE-style MCQs for ${system} - ${subject}. Use clinical vignettes. focus on next best step.`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
              mnemonic: { type: Type.STRING },
              videoLink: { type: Type.STRING },
              visualPrompt: { type: Type.STRING }
            },
            required: ["id", "question", "options", "correctAnswer", "explanation", "mnemonic", "videoLink", "visualPrompt"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]").map((q: any) => ({ ...q, category: system, subject }));
  } catch (err: any) {
    if (err.message?.includes("403") || err.message?.includes("permission")) throw new Error("PERMISSION_DENIED");
    throw err;
  }
};