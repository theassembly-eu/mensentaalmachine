import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const PORT = process.env.PORT || 3000; // Use 3000 for backend

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.ALLOW_ORIGINS || 'http://localhost:5173', // Frontend runs on 5173 by default with Vite
  credentials: true
}));

// MongoDB Connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mensentaalmachine';
mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

import path from 'path';
import { fileURLToPath } from 'url';
import history from 'connect-history-api-fallback';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Basic API route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

app.post('/api/simplify', async (req, res) => {
  const { text, language = 'Dutch', targetAudience = 'Algemeen' } = req.body; // Default to Dutch and Algemeen

  if (!text) {
    return res.status(400).json({ error: 'Text is required for simplification.' });
  }

  try {
    const prompt = `You are a helpful assistant that simplifies complex ${language} political texts for a ${targetAudience} audience into clear, active, empathetic, and non-condescending language, like "your uncle at the family party."
    Your output should consist of short sentences and short words, with no more than 3 syllables per word.
    Follow these three steps:
    1. Start with an emotional core message about people.
    2. Name the problem briefly.
    3. Conclude with a clear message.

    Please simplify the following ${language} text and respond in ${language}:

    "${text}"`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    const simplifiedText = completion.choices[0].message.content;
    res.json({ simplifiedText });

  } catch (error) {
    console.error('Error simplifying text:', error);
    res.status(500).json({ error: 'Failed to simplify text.' });
  }
});

// Serve frontend (static)
const frontendPath = path.join(__dirname, '../dist'); // dist is in the project root
app.use(history({ index: '/index.html' }));
app.use(express.static(frontendPath));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on http://0.0.0.0:${PORT}`);
});