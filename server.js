import express from 'express';
import cors from 'cors';
import 'dotenv/config'; 
import { GoogleGenAI } from "@google/genai";

// 1. Initialize Gemini Client
// The GoogleGenAI client automatically looks for the GEMINI_API_KEY environment variable.
if (!process.env.GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY not found. Please create a .env file.");
    process.exit(1);
}
const ai = new GoogleGenAI({});
const model = "gemini-2.5-flash"; // A fast and versatile model for chat

const app = express();
const port = 3000;

// 2. Middleware
app.use(cors());
app.use(express.json());

// 3. Chat Endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, context } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Missing 'message' in request body." });
        }

        // 3.1. Construct the prompt with context for better results
        const fullPrompt = `You are a helpful and knowledgeable Educational Assistant. Your current topic context is: "${context}". Please provide a helpful, concise, and educational response to the student's message: "${message}"`;

        // 3.2. Call the Gemini API
        const response = await ai.models.generateContent({
            model: model,
            contents: fullPrompt,
            config: {
                systemInstruction: "You are a friendly, concise, and highly effective educational assistant. Respond with an emphasis on clarity and learning. Do not repeat the context."
            }
        });

        // 3.3. Send the AI's response back to the frontend
        res.json({ reply: response.text });

    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ error: "Failed to communicate with the Gemini API." });
    }
});

// 4. Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server listening at http://0.0.0.0:${PORT}`);
});


