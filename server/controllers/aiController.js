import fetch from 'node-fetch';
import { FormData, File } from 'formdata-node';
import Tesseract from 'tesseract.js';
import gemini from "../config/gemini.js"

export const translateAudio = async (req, res) => {
  const { audioURL, language } = req.body;

  if (!audioURL) {
    return res.status(400).send('No audio URL provided!');
  }

  try {
    // Fetch the audio file from the URL
    const audioResponse = await fetch(audioURL);
    if (!audioResponse.ok) {
      throw new Error('Failed to fetch audio file');
    }
    const audioBuffer = await audioResponse.buffer();

    // Send audio file to OpenAI for transcription
    const formData = new FormData();
    formData.append('file', new File([audioBuffer], 'audio.wav', { type: 'audio/wav' }));
    formData.append('model', 'whisper-1');

    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPEN_AI_API}`,
      },
      body: formData,
    });

    if (!transcriptionResponse.ok) {
      const error = await transcriptionResponse.json();
      throw new Error(error.error.message);
    }

    const transcriptionData = await transcriptionResponse.json();
    const transcribedText = transcriptionData.text;

    // Translate the transcribed text using GPT-4
    const translationMessages = [
      { role: 'system', content: `Translate the following text to ${language}:` },
      { role: 'user', content: transcribedText }
    ];
    
    const translationResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPEN_AI_API}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: translationMessages,
        max_tokens: 1000,
      }),
    });

    if (!translationResponse.ok) {
      const error = await translationResponse.json();
      throw new Error(error.error.message);
    }

    const translationData = await translationResponse.json();
    const translatedText = translationData.choices[0].message.content.trim();

    res.status(200).json({ transcribedText, translatedText });
  } catch (error) {
    console.error('Error transcribing and translating:', error);
    res.status(500).send('Error translating audio.');
  }
};

export const translateText = async (req, res) => {
  const { sentence, language } = req.body;

  if (!sentence || !language) {
    return res.status(400).send('Sentence or language is not specified !');
  }

  const prompt = `Imagine you are an advanced language teacher specialized in deconstructing any given input language into its 
    fundamental grammatical structure, syntax, and vocabulary. Your objective is to analyze sentences or phrases presented to you, identify 
    their grammatical components (such as verbs, nouns, adjectives, etc.), and explain these components and their relationships within the sentence. 
    Furthermore, you are to translate these explanations into ${language}, ensuring they are clear, educational, and accessible to ${language} speakers 
    learning this language. Use simple and engaging language to make the learning process as effective as possible, and provide examples to illustrate 
    your points when necessary. The sentence is ${sentence}.`;

    try {
      const result = await gemini.generateContentStream(prompt);
      let text = '';
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        text += chunkText;
      }

      res.status(200).json({ text });
    } catch (error) {
      res.status(500).send("Error: ", error);
    }
  }

  export const translateImage = async (req, res) => {
    const { imageURL, language } = req.body;
  
    if (!imageURL) {
      return res.status(400).send('No image URL provided!');
    }
  
    try {
      // Fetch the image file from the URL
      const imageResponse = await fetch(imageURL);
      if (!imageResponse.ok) {
        throw new Error('Failed to fetch image file');
      }
      const imageBuffer = await imageResponse.buffer();
  
      // Use Tesseract.js to extract text from the image
      const ocrResult = await Tesseract.recognize(imageBuffer, 'eng');
      const extractedText = ocrResult.data.text.trim();
  
      // Translate the extracted text using GPT-4
      const translationMessages = [
        { role: 'system', content: `Translate the following text to ${language}:` },
        { role: 'user', content: extractedText }
      ];
      
      const translationResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPEN_AI_API}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: translationMessages,
          max_tokens: 1000,
        }),
      });
  
      if (!translationResponse.ok) {
        const error = await translationResponse.json();
        throw new Error(error.error.message);
      }
  
      const translationData = await translationResponse.json();
      const translatedText = translationData.choices[0].message.content.trim();
  
      res.status(200).json({ extractedText, translatedText });
    } catch (error) {
      console.error('Error extracting and translating text:', error);
      res.status(500).send('Error translating image.');
    }
  };