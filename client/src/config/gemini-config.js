import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyCceYcD0zysLQJaCVek2PnvtE7IR2XcuSk');

const gemini = genAI.getGenerativeModel({ model: 'gemini-pro' });

export default gemini;
