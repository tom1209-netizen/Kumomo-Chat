import express from 'express';
import multer from 'multer';
import { registerUser, loginUser, searchUsers, getUserLanguage } from '../controllers/userController.js';

const router = express.Router();

// Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/register', upload.single('file'), registerUser);
router.post('/login', loginUser);
router.get('/search', searchUsers);
router.get('/user/:userId/language', getUserLanguage)

export default router;