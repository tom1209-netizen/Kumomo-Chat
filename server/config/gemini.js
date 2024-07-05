import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

const gemini = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

export default gemini;
