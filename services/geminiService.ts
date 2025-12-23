
import { GoogleGenAI, Type } from "@google/genai";
import { Question, MedicalCategory, MedicalSubject, NoteSection, Flashcard } from "../types";

// Note: process.env.API_KEY must be set in Vercel Settings -> Environment Variables
const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === 'undefined') {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateNotes = async (system: MedicalCategory, subject: MedicalSubject): Promise<NoteSection[]> => {
  const ai = getAI();
  const prompt = `Act as a world-class medical professor for the NIME program. 
  Provide high-yield clinical notes for: ${system} - ${subject}.
  Focus on oral exam preparation. Explain the 'why' behind mechanisms.
  Include 3 clinical correlates (real-world scenarios).
  Provide a 'visualSearchKeyword' which is a 2-3 word string to find a medical image for this topic.`;

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
  return JSON.parse(response.text);
};

export const generateFlashcards = async (system: MedicalCategory, subject: MedicalSubject): Promise<Flashcard[]> => {
  const ai = getAI();
  const prompt = `Create 10 active-recall flashcards for ${system} - ${subject}. 
  Front: A challenging question or clinical sign. 
  Back: Short, high-yield answer.
  Explanation: The physiological basis for the answer.`;
  
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
  return JSON.parse(response.text);
};

export const generateQuestions = async (system: MedicalCategory, subject: MedicalSubject, count: number = 5): Promise<Question[]> => {
  const ai = getAI();
  const prompt = `Generate ${count} USMLE Step 1 style MCQs for ${system} - ${subject}.
  Each question must be a clinical vignette (patient presentation).
  The explanation must focus on the 'Next Best Step' and 'Mechanism of Action'.
  Provide a mnemonic for the correct answer.
  Include a youtube search query for revision.
  visualPrompt: A description of a classic X-ray, Histology, or Gross Pathology finding for this case.`;

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
  return JSON.parse(response.text).map((q: any) => ({ 
    ...q, 
    category: system, 
    subject,
    difficulty: 'Hard' 
  }));
};
