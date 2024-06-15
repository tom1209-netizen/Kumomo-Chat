import express from 'express';
import multer from 'multer';
import { registerUser, loginUser, searchUsers, getUserLanguage } from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/register', upload.single('file'), registerUser);
router.post('/login', loginUser);

router.get('/language/:userId', authMiddleware, getUserLanguage);
router.get('/search', authMiddleware, searchUsers);

export default router;