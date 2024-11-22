import express from 'express';
import openai from '../config/openai';

const router = express.Router();

router.post('/summarize', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes civic education content for Kenyan citizens in clear, simple language."
        },
        {
          role: "user",
          content: `Please summarize this text: ${text}`
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    return res.json({ summary: response.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return res.status(500).json({ error: 'Failed to generate summary' });
  }
});

router.post('/analyze', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert in Kenyan legislation who analyzes bills and explains their implications in simple terms."
        },
        {
          role: "user",
          content: `Please analyze this bill and explain its key points and potential impact: ${text}`
        }
      ],
      max_tokens: 500,
      temperature: 0.5,
    });

    return res.json({ analysis: response.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return res.status(500).json({ error: 'Failed to analyze text' });
  }
});

export default router; 