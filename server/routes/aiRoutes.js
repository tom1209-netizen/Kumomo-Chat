import express from 'express';
import { translateAudio, translateImage, translateText } from '../controllers/aiController.js';


const router = express.Router();

router.post('/translate-audio', translateAudio);
router.post('/translate-text', translateText);
router.post('/translate-image', translateImage)

export default router;