import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiAPIKey = 'YOUR KEY HERE'
const genAI = new GoogleGenerativeAI(geminiAPIKey);

export const model = genAI.getGenerativeModel({ model: "gemini-pro" });