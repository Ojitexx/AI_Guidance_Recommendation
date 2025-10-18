import { GoogleGenAI, Type } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Initialize AI client, can be null if API_KEY is not set
const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

// Simplified schema: AI only generates the core data. We construct the URLs.
const jobSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "A unique identifier string for the job." },
        title: { type: Type.STRING, description: "A realistic job title." },
        company: { type: Type.STRING, description: "A generic company descriptor like 'Various Tech Companies' or 'Leading Financial Firms'." },
        description: { type: Type.STRING, description: "A brief, 2-3 sentence summary of the role's responsibilities." },
        location: { type: Type.STRING, description: "The job location, which should always be 'Remote'."},
        searchQuery: { type: Type.STRING, description: "A concise search query string for this job title, including 'remote'. e.g., 'Junior DevOps Engineer remote'." }
    },
    required: ["id", "title", "company", "description", "location", "searchQuery"],
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
        // Return an error so the user knows something is wrong.
        return res.status(500).json({ error: 'AI service is not configured on the server. Please add API_KEY to environment variables.' });
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
            5.  Create a simple but effective 'searchQuery' string for finding this job on job boards (e.g., "entry level data analyst remote").

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
        // The AI returns a list of jobs with a `searchQuery` property.
        const aiGeneratedJobs = JSON.parse(jsonString) as any[];

        // We now process these jobs to add the full, platform-specific URLs.
        const jobsWithUrls = aiGeneratedJobs.map((job: any) => {
            const encodedQuery = encodeURIComponent(job.searchQuery);
            // Fiverr works better with just the title, which is more specific for gigs
            const fiverrQuery = encodeURIComponent(job.title);

            return {
                id: job.id,
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