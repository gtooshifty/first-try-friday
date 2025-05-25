require('dotenv').config();
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'loaded' : 'missing');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Route for AI questions
app.post('/ask', async (req, res) => {
  const question = req.body.question;
  const prompt = `
Explain how to perform this trick in 4-5 concise bullet points:

"${question}"
  `;
  try {
    const completion = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages: [
  { role: 'system', content: 'Respond with a numbered markdown list limited to 4-5 points.' },
  { role: 'user', content: question }
],

});

    res.json({ answer: completion.choices[0].message.content });
  } catch (err) {
  console.error('OpenAI error:', err);
  res.status(500).json({ answer: "Oops, something went wrong." });
}
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
