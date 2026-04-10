import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction: "You are the helpful official QuizSphere AI Support Chatbot. QuizSphere is a SaaS platform for educational quizzes. Candidates register to take assigned quizzes, Examiners create quizzes, and Admins oversee permissions and settings. Examiners must request update permission from an Admin to modify a live quiz. Keep answers concise, polite, and helpful.",
});

export const handleChat = async (req, res) => {
  try {
    const { history, message } = req.body;
    
    // Format history for Gemini API expects: { role: "user" | "model", parts: [{text: ""}] }
    const formattedHistory = [];
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        if (!msg.text) continue;
        if (msg.sender === 'user') {
          formattedHistory.push({ role: 'user', parts: [{ text: msg.text }] });
        } else if (msg.sender === 'bot') {
          formattedHistory.push({ role: 'model', parts: [{ text: msg.text }] });
        }
      }
    }

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    res.json({ text: responseText });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ message: "An error occurred while communicating with the AI system." });
  }
};
