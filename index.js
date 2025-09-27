import express from 'express';
import cors from 'cors';
import 'dotenv/config'; 
import { GoogleGenAI } from "@google/genai";


if (!process.env.GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY not found. Please create a .env file.");
    process.exit(1);
}
const ai = new GoogleGenAI({});
const model = "gemini-2.5-flash"; 

const app = express();
const port = 3000;

app.use(cors({
    origin: 'http://localhost:8080' 
}));
app.use(express.json()); 

app.post('/api/chat', async (req, res) => {
    try {
        const { message, context } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Missing 'message' in request body." });
        }

        const fullPrompt = `You are a helpful and knowledgeable Educational Assistant. Your current topic context is: "${context}". Please provide a helpful, concise, and educational response to the student's message: "${message}"`;

        const response = await ai.models.generateContent({
            model: model,
            contents: fullPrompt,
            config: {
                systemInstruction: "You are a friendly, concise, and highly effective educational assistant. Respond with an emphasis on clarity and learning. Do not repeat the context."
            }
        });

        res.json({ reply: response.text });

    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ error: "Failed to communicate with the Gemini API." });
    }
});

app.listen(port, () => {
    console.log(`✅ Backend server listening at http://localhost:${port}`);
    console.log("⚠️ Remember to serve your QUIZ4(0).html file using an HTTP server (e.g., VS Code Live Server or 'http-server') on a different port, such as 8080.");
});
