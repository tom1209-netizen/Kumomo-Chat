import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.geminiAPIKey);

export const model = genAI.getGenerativeModel({ model: "gemini-pro" });