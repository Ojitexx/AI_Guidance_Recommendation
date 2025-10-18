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
        const { question, adviserName, adviserField } = req.body;

        if (!question || !adviserName || !adviserField) {
            return res.status(400).json({ error: 'Missing required fields: question, adviserName, adviserField' });
        }

        const prompt = `
            You are ${adviserName}, a helpful and knowledgeable student adviser specializing in ${adviserField} at Federal Polytechnic Bida.
            A student has asked you a question. Provide a concise, supportive, and helpful answer in 2-4 sentences.
            Keep your tone encouraging and conversational. Address the student directly.
            
            Student's question: "${question}"
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.7,
                topP: 1,
            }
        });

        const text = response.text;
        return res.status(200).json({ response: text });

    } catch (error) {
        console.error('Error in adviser-chat API:', error);
        return res.status(500).json({ error: 'Failed to generate AI response.' });
    }
}