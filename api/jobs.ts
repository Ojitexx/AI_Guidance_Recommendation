import { GoogleGenAI, Type } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Initialize AI client, can be null if API_KEY is not set
const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

// Simplified schema: AI only generates core data, server constructs URLs and IDs.
const jobSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A realistic job title." },
        company: { type: Type.STRING, description: "A generic company descriptor like 'Various Tech Companies' or 'Leading Financial Firms'." },
        description: { type: Type.STRING, description: "A brief, 2-3 sentence summary of the role's responsibilities." },
        location: { type: Type.STRING, description: "The job location, which should always be 'Remote'."},
        searchQuery: { type: Type.STRING, description: "A concise search query string for this job title, including 'remote'. e.g., 'Junior DevOps Engineer remote'." }
    },
    required: ["title", "company", "description", "location", "searchQuery"],
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
    
    if (!ai) {
        console.error("API key not configured. Cannot fetch jobs.");
        return res.status(500).json({ error: 'AI service is not configured on the server. Please add API_KEY to environment variables.' });
    }

    try {
        const { query } = req.body;
        if (!query || typeof query !== 'string') {
            return res.status(400).json({ error: 'A search query string is required.' });
        }

        const prompt = `
            You are a job search assistant for computer science students.
            Generate a list of 5 representative remote job opportunities based on the search query: "${query}".

            For each job, provide:
            - A realistic job title.
            - A generic company (e.g., "Tech Startup" or "Global E-commerce Platform").
            - A brief 2-sentence description of the role.
            - The location must be "Remote".
            - A simple and effective 'searchQuery' string for finding this job (e.g., "remote entry level data analyst").

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
        const aiGeneratedJobs = JSON.parse(jsonString) as any[];

        // Process the AI's creative output to add structured data like IDs and URLs.
        const jobsWithUrls = aiGeneratedJobs.map((job: any, index: number) => {
            const encodedQuery = encodeURIComponent(job.searchQuery);
            const fiverrQuery = encodeURIComponent(job.title);

            return {
                id: `${job.title.replace(/\s/g, '-')}-${index}-${Date.now()}`, // Generate a reliable, unique ID
                title: job.title,
                company: job.company,
                description: job.description,
                location: job.location,
                linkedInUrl: `https://www.linkedin.com/jobs/search/?keywords=${encodedQuery}`,
                upworkUrl: `https://www.upwork.com/nx/jobs/search/?q=${encodedQuery}`,
                fiverrUrl: `https://www.fiverr.com/search/gigs?query=${fiverrQuery}`
            };
        });

        return res.status(200).json(jobsWithUrls);

    } catch (error) {
        console.error('Error in /api/jobs:', error);
        return res.status(500).json({ error: 'Failed to generate job listings.' });
    }
}