import express from 'express';
import { getChatMessages, sendMessage, getUserChats, createChat } from '../controllers/chatController.js';

import multer from 'multer';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/:chatId', authMiddleware, getChatMessages);
router.post('/', authMiddleware, createChat); 
router.post('/send', authMiddleware, upload.single('file'), sendMessage);
router.get('/user/:userId', authMiddleware, getUserChats);

export default router;