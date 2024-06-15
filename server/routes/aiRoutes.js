import express from 'express';
import { translateAudio, translateText } from '../controllers/aiController.js';


const router = express.Router();

router.post('/translate-audio', translateAudio);
router.post('/translate-text', translateText);

export default router;