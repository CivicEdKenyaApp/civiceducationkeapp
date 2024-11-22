import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Access the API key securely
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { text, task } = req.body;

  try {
    // Customize the prompt based on the task
    let prompt = '';
    if (task === 'summarize') {
      prompt = `Summarize the following text in two sentences:\n\n${text}`;
    } else if (task === 'analyze') {
      prompt = `Analyze the following text:\n\n${text}`;
    }

    const response = await openai.createCompletion({
      model: 'gpt-3.5-turbo', // or 'gpt-4'
      prompt: prompt,
      max_tokens: 200,
    });

    res.status(200).json({ result: response.data.choices[0].text.trim() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data from OpenAI' });
  }
}
