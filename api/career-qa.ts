import { GoogleGenAI } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    if (!ai) {
        return res.status(500).json({ error: 'AI service is not configured.' });
    }

    try {
        const { question, careerContext } = req.body;

        if (!question || !careerContext) {
            return res.status(400).json({ error: 'Missing required fields: question, careerContext' });
        }

        const prompt = `
            Act as a helpful and encouraging AI career counselor.
            A student was just recommended the career path of "${careerContext}".
            They have a follow-up question. Please provide a clear, concise, and helpful answer based on their recommended career.
            
            Student's question: "${question}"
        `;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
             config: {
                temperature: 0.6,
            }
        });

        const text = response.text;
        return res.status(200).json({ response: text });

    } catch (error) {
        console.error('Error in career-qa API:', error);
        return res.status(500).json({ error: 'Failed to generate AI response.' });
    }
}