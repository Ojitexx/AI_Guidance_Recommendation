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

const mockJobs = [
    {
      id: 'mock-job-1',
      title: 'Junior Frontend Developer (React)',
      company: 'Innovate Solutions Inc.',
      description: 'Join our team to build and maintain modern, responsive web applications using React. You will collaborate with designers and backend developers to create seamless user experiences.',
      location: 'Remote',
      linkedInUrl: 'https://www.linkedin.com/jobs/search/?keywords=Junior%20Frontend%20Developer',
      upworkUrl: 'https://www.upwork.com/nx/jobs/search/?q=Junior%20Frontend%20Developer',
      fiverrUrl: 'https://www.fiverr.com/search/gigs?query=Junior%20Frontend%20Developer'
    },
    {
      id: 'mock-job-2',
      title: 'Entry Level Software Engineer',
      company: 'Tech Giants Co.',
      description: 'We are looking for a recent graduate to join our software engineering team. You will work on various projects, from backend services to internal tools, using Python and Go.',
      location: 'Remote',
      linkedInUrl: 'https://www.linkedin.com/jobs/search/?keywords=Entry%20Level%20Software%20Engineer',
      upworkUrl: 'https://www.upwork.com/nx/jobs/search/?q=Entry%20Level%20Software%20Engineer',
      fiverrUrl: 'https://www.fiverr.com/search/gigs?query=Entry%20Level%20Software%20Engineer'
    },
    {
      id: 'mock-job-3',
      title: 'Cybersecurity Analyst Intern',
      company: 'SecureNet',
      description: 'An exciting opportunity for a student or recent graduate to gain hands-on experience in cybersecurity. You will assist in monitoring security alerts, performing vulnerability assessments, and responding to incidents.',
      location: 'Remote',
      linkedInUrl: 'https://www.linkedin.com/jobs/search/?keywords=Cybersecurity%20Analyst%20Intern',
      upworkUrl: 'https://www.upwork.com/nx/jobs/search/?q=Cybersecurity%20Analyst%20Intern',
      fiverrUrl: 'https://www.fiverr.com/search/gigs?query=Cybersecurity%20Analyst%20Intern'
    },
    {
      id: 'mock-job-4',
      title: 'Cloud Support Associate',
      company: 'CloudWorks',
      description: 'Provide technical support to customers using our cloud platform. Troubleshoot issues related to AWS, Azure, and GCP services. Excellent communication skills are a must.',
      location: 'Remote',
      linkedInUrl: 'https://www.linkedin.com/jobs/search/?keywords=Cloud%20Support%20Associate',
      upworkUrl: 'https://www.upwork.com/nx/jobs/search/?q=Cloud%20Support%20Associate',
      fiverrUrl: 'https://www.fiverr.com/search/gigs?query=Cloud%20Support%20Associate'
    },
    {
      id: 'mock-job-5',
      title: 'Junior Data Analyst',
      company: 'Data Insights LLC',
      description: 'Work with our data science team to analyze large datasets, generate reports, and create visualizations. Basic knowledge of SQL and Python is required.',
      location: 'Remote',
      linkedInUrl: 'https://www.linkedin.com/jobs/search/?keywords=Junior%20Data%20Analyst',
      upworkUrl: 'https://www.upwork.com/nx/jobs/search/?q=Junior%20Data%20Analyst',
      fiverrUrl: 'https://www.fiverr.com/search/gigs?query=Junior%20Data%20Analyst'
    }
  ];

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
    
    if (!ai) {
        console.warn("API key not configured. Returning mock job data.");
        res.setHeader('X-Is-Mock', 'true');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        return res.status(200).json(mockJobs);
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