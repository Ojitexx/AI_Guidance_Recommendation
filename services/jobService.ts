import { Job } from '../types';

export const fetchJobs = async (query: string): Promise<Job[]> => {
  if (!query.trim()) {
    return [];
  }

  try {
    const response = await fetch('/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch jobs from the server.');
    }

    const jobs: Job[] = await response.json();
    // Gemini sometimes returns fewer jobs than requested, so no need to slice.
    return jobs;
    
  } catch (error) {
    console.error("Error fetching jobs:", error);
    // Re-throw the error to be handled by the calling component
    throw error;
  }
};