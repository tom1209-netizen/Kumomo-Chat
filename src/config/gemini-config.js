import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API);

const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export default model;
