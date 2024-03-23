import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI('AIzaSyCceYcD0zysLQJaCVek2PnvtE7IR2XcuSk');

export const model = genAI.getGenerativeModel({ model: "gemini-pro" });