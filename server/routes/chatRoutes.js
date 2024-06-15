import express from 'express';
import { getChatMessages, sendMessage, getUserChats, createChat } from '../controllers/chatController.js';
import multer from 'multer';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/:chatId', getChatMessages);
router.post('/', createChat); 
router.post('/send', upload.single('file'), sendMessage);
router.get('/user/:userId', getUserChats);

export default router;