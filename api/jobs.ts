import { GoogleGenAI, Type } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Initialize AI client, can be null if API_KEY is not set
const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

const jobSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "A unique identifier string for the job." },
        title: { type: Type.STRING, description: "A realistic job title." },
        company: { type: Type.STRING, description: "A generic company descriptor like 'Various Tech Companies' or 'Leading Financial Firms'." },
        searchUrl: { type: Type.STRING, description: "A well-formed, URL-encoded search link to a major job board (like LinkedIn or Google Jobs) for this specific job title and location. E.g., https://www.linkedin.com/jobs/search/?keywords=Junior%20DevOps%20Engineer%20remote"},
        description: { type: Type.STRING, description: "A brief, 2-3 sentence summary of the role's responsibilities." },
        location: { type: Type.STRING, description: "The job location, which should always be 'Remote'."},
    },
    required: ["id", "title", "company", "searchUrl", "description", "location"],
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
    
    // Handle case where API key is not configured
    if (!ai) {
        console.error("API key not configured. Returning empty job list.");
        return res.status(200).json([]);
    }

    try {
        const { query } = req.body;
        if (!query || typeof query !== 'string') {
            return res.status(400).json({ error: 'A search query string is required.' });
        }

        const prompt = `
            You are a helpful job search assistant for computer science students.
            Based on the following search query, generate a list of 5 representative remote job opportunities: "${query}".

            For each opportunity:
            1.  Create a realistic and specific job title.
            2.  Provide a generic company description (e.g., "A Fast-Growing SaaS Company").
            3.  Write a brief, 2-3 sentence summary of what the role entails.
            4.  The location must be "Remote".
            5.  Most importantly, create a URL-encoded search link for a major job platform like LinkedIn Jobs (preferred) or Google Jobs to find live jobs matching that specific title. The link should search for the title and include the keyword "remote".

            Example searchUrl for "Junior DevOps Engineer": https://www.linkedin.com/jobs/search/?keywords=Junior%20DevOps%20Engineer%20remote

            Return the response ONLY in the specified JSON format.
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