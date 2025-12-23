
import { GoogleGenAI, Type } from "@google/genai";
import { Question, MedicalCategory, MedicalSubject, NoteSection, Flashcard } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateNotes = async (system: MedicalCategory, subject: MedicalSubject): Promise<NoteSection[]> => {
  const prompt = `Act as a senior medical consultant. Provide comprehensive, high-yield clinical notes for the NIME syllabus. 
  SYSTEM: ${system} | SUBJECT: ${subject}. 
  Format as a list of 4 key high-yield topics. Include clinical correlates for oral exams and a descriptive prompt for a medical diagram.`;

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
            imageDescription: { type: Type.STRING }
          },
          required: ["title", "content", "mnemonics", "clinicalCorrelate", "imageDescription"]
        }
      }
    }
  });
  return JSON.parse(response.text);
};

export const generateFlashcards = async (system: MedicalCategory, subject: MedicalSubject): Promise<Flashcard[]> => {
  const prompt = `Generate 10 active recall flashcards for ${system} - ${subject}. Focus on high-yield exam facts, normal vs abnormal values, and classic presentations.`;
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
  const prompt = `Generate ${count} high-quality USMLE-style MCQs for ${system} - ${subject}. 
  Include clinical vignettes. For oral exam prep, ensure the explanation describes the "next best step" and underlying pathophysiology.
  Provide a mnemonic and a YouTube revision link (search query format).`;

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
            visualPrompt: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            category: { type: Type.STRING }
          },
          required: ["id", "question", "options", "correctAnswer", "explanation", "mnemonic", "videoLink", "visualPrompt"]
        }
      }
    }
  });
  return JSON.parse(response.text).map((q: any) => ({ ...q, subject }));
};
