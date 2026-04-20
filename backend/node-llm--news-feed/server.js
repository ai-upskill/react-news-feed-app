require('dotenv').config();
const express = require('express');
const cors = require('cors');
const openAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const aiClient = new openAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.get('/', (req, res) => {
    res.send({
        message: 'Ok'
    })
})
app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        const response  = await aiClient.chat.completions.create({
            model: 'gpt-4.1',
            messages: [{role: 'user', content: message}]
        });

        res.json({
            reply: response.choices[0].message.content
        });
        
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});
process.on('uncaughtException', (err) => {
  console.error('There was an uncaught error', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
app.listen(5000, () => {
    try {
        console.log('Server running on 5000')
    } catch (error) {
        console.log(error)
    }
});