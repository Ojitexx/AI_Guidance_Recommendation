import { GoogleGenAI, Type } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Initialize AI client, can be null if API_KEY is not set
const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

// The AI generates the core job details.
const jobSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A specific, searchable job title based on the user's query." },
        company: { type: Type.STRING, description: "A generic company descriptor like 'Various Tech Companies' or 'Leading Financial Firms'." },
        description: { type: Type.STRING, description: "A brief, 2-3 sentence summary of the role's responsibilities, tailored to the user's query." },
        location: { type: Type.STRING, description: "The job location, which should always be 'Remote'."},
    },
    required: ["title", "company", "description", "location"],
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
            A student is searching for jobs with the query: "${query}".
            Generate a list of 5 representative remote job opportunities that are highly relevant to this specific query.

            For each job, provide:
            - A specific and realistic job title that would be effective for searching on job platforms.
            - A generic company (e.g., "Tech Startup" or "Global E-commerce Platform").
            - A brief 2-sentence description of the role, tailored to the student's query.
            - The location, which must be "Remote".

            Return the response in the specified JSON format. The job title should be the primary field used for creating search links.
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
        
        let jsonString = response.text.trim();

        if (!jsonString) {
            console.warn('Gemini API returned an empty response for jobs query:', query);
            return res.status(500).json({ error: 'The AI service returned an empty response. This can happen with very specific or unusual queries. Please try a different search term.' });
        }

        // Clean the response string to remove markdown code blocks which can be added by the model
        const jsonMatch = jsonString.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
            jsonString = jsonMatch[1];
        }
        
        let aiGeneratedJobs;
        try {
            aiGeneratedJobs = JSON.parse(jsonString);
        } catch (parseError) {
            console.error('Failed to parse Gemini JSON response for jobs. Response was:', jsonString);
            return res.status(500).json({ error: 'The AI service returned data in an unexpected format. We are working on a fix.' });
        }
        
        if (!Array.isArray(aiGeneratedJobs)) {
            console.error('Gemini response for jobs was not an array. Response was:', JSON.stringify(aiGeneratedJobs));
            return res.status(500).json({ error: 'The AI service returned data in an unexpected format. We are working on a fix.' });
        }

        // Process the AI's creative output to add structured data like IDs and URLs.
        const jobsWithUrls = aiGeneratedJobs.map((job: any, index: number) => {
            const safeTitle = job.title || 'Untitled Job';
            const encodedTitle = encodeURIComponent(safeTitle);

            return {
                id: `${safeTitle.replace(/\s/g, '-')}-${index}-${Date.now()}`,
                title: safeTitle,
                company: job.company || 'Unknown Company',
                description: job.description || 'No description available.',
                location: job.location || 'Remote',
                // Use the AI-generated title for all search links for better relevance
                linkedInUrl: `https://www.linkedin.com/jobs/search/?keywords=${encodedTitle}`,
                upworkUrl: `https://www.upwork.com/nx/jobs/search/?q=${encodedTitle}`,
                fiverrUrl: `https://www.fiverr.com/search/gigs?query=${encodedTitle}`
            };
        });

        return res.status(200).json(jobsWithUrls);

    } catch (error) {
        console.error('Error in /api/jobs:', error);
        if (error instanceof Error && error.message.includes('SAFETY')) {
             return res.status(422).json({ error: 'The request was blocked for safety reasons. Please try a different search query.' });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while generating job listings. Please try again.' });
    }
}