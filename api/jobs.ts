import { GoogleGenAI, Type } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const jobSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "A unique identifier string for the job." },
        title: { type: Type.STRING },
        company: { type: Type.STRING },
        link: { type: Type.STRING, description: "A plausible, but not necessarily real, URL to an application page."},
        description: { type: Type.STRING },
        posted_date_string: { type: Type.STRING, description: "A human-readable string like '3 days ago' or '1 week ago'."},
        location: { type: Type.STRING, description: "Should always include 'Remote'."},
    },
    required: ["id", "title", "company", "link", "description", "posted_date_string", "location"],
};

const responseSchema = {
    type: Type.ARRAY,
    items: jobSchema
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { query } = req.body;
        if (!query || typeof query !== 'string') {
            return res.status(400).json({ error: 'A search query string is required.' });
        }

        const prompt = `
            Generate a list of 8 realistic, currently available remote job opportunities for a computer science student based on the query: "${query}".
            Ensure all jobs are remote.
            For the 'link' property, create a plausible URL to a careers page or job board.
            For the 'id', create a unique string.
            Return the response in the specified JSON format.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.7
            }
        });
        
        const jsonString = response.text.trim();
        const jobs = JSON.parse(jsonString);

        return res.status(200).json(jobs);

    } catch (error) {
        console.error('Error in /api/jobs:', error);
        return res.status(500).json({ error: 'Failed to generate job listings.' });
    }
}