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
        description: { type: Type.STRING, description: "A brief, 2-3 sentence summary of the role's responsibilities." },
        location: { type: Type.STRING, description: "The job location, which should always be 'Remote'."},
        linkedInUrl: { type: Type.STRING, description: "A URL-encoded LinkedIn search link for this title. e.g., https://www.linkedin.com/jobs/search/?keywords=Junior%20DevOps%20Engineer%20remote"},
        upworkUrl: { type: Type.STRING, description: "A URL-encoded Upwork search link for this title. e.g., https://www.upwork.com/nx/jobs/search/?q=Junior%20DevOps%20Engineer" },
        fiverrUrl: { type: Type.STRING, description: "A URL-encoded Fiverr search link for this title. e.g., https://www.fiverr.com/search/gigs?query=DevOps%20Engineer" },
    },
    required: ["id", "title", "company", "description", "location", "linkedInUrl", "upworkUrl", "fiverrUrl"],
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
            5.  Generate three distinct, URL-encoded search links for the job title:
                - linkedInUrl: A LinkedIn Jobs search link for the title including "remote". Example for "Junior DevOps Engineer": https://www.linkedin.com/jobs/search/?keywords=Junior%20DevOps%20Engineer%20remote
                - upworkUrl: An Upwork Jobs search link for the title. Example for "Junior DevOps Engineer": https://www.upwork.com/nx/jobs/search/?q=Junior%20DevOps%20Engineer
                - fiverrUrl: A Fiverr Gigs search link for the title. Example for "DevOps Engineer": https://www.fiverr.com/search/gigs?query=DevOps%20Engineer

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