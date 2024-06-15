import express from 'express';
import { getChatMessages, sendMessage, getUserChats, createChat } from '../controllers/chatController.js';
import multer from 'multer';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/:chatId', getChatMessages);
router.post('/', createChat); // Route to create a new chat
router.post('/send', upload.single('img'), sendMessage);
router.get('/user/:userId', getUserChats);

export default router;