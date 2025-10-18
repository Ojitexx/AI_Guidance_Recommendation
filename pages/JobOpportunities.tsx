// Fix: Changed React import from namespace import to default import to fix JSX type errors.
import React from 'react';
import { fetchJobs } from '../services/jobService';
import { Job } from '../types';
import { Card } from '../components/Card';

const LinkedInIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);

const UpworkIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16.14.03a8.08 8.08 0 0 0-4.07 1.15 8.35 8.35 0 0 0-2.85 2.89 8.2 8.2 0 0 0-.82 5.23c0 1.9.52 3.81 1.58 5.31s2.5 2.66 4.16 3.1a7.63 7.63 0 0 0 4.79-.58 7.67 7.67 0 0 0 3.32-3.83 8.32 8.32 0 0 0 .1-5.11 7.73 7.73 0 0 0-2.43-4.22 8.08 8.08 0 0 0-4.6-1.89zm.73 1.5c1.44 0 2.87.51 3.94 1.5a6.2 6.2 0 0 1 2 3.42 6.77 6.77 0 0 1-.1 4.14 6.13 6.13 0 0 1-2.67 3.09 6.21 6.21 0 0 1-3.89.47 6.2 6.2 0 0 1-3.39-1.25 6.09 6.09 0 0 1-2.06-3.03.54.54 0 0 1 .49-.72h1.48a.54.54 0 0 1 .53.47 3.69 3.69 0 0 0 1.25 1.84 3.8 3.8 0 0 0 2.11.72c1.07 0 2.14-.38 2.9-.91a2.83 2.83 0 0 0 1.4-2.22c.1-.81-.12-1.63-.51-2.31a3.2 3.2 0 0 0-2.83-1.68h-2.1a.54.54 0 0 1-.54-.54v-1.48a.54.54 0 0 1 .54-.54h1.9c1.61 0 3.23.63 4.38 1.79a.54.54 0 0 1-.04.79l-1.07.96a.54.54 0 0 1-.7-.11 3.84 3.84 0 0 0-2.83-1.35h-1.9a.54.54 0 0 1-.54-.54V4.18a.54.54 0 0 1 .54-.54h2.1a3.67 3.67 0 0 1 2.62 1.1 3.75 3.75 0 0 1 1.08 2.66.54.54 0 0 1-.53.54h-1.48a.54.54 0 0 1-.54-.54A1.21 1.21 0 0 0 16.87 6a1.13 1.13 0 0 0-1.13-1.13h-2.1a.54.54 0 0 1-.54-.54V2.8a.54.54 0 0 1 .54-.54h1.9z" />
    </svg>
);

const FiverrIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
        <path d="M21.12,6.88a1,1,0,0,0-1-1H16V3a1,1,0,0,0-1-1H3A1,1,0,0,0,2,3V15a1,1,0,0,0,1,1H8.62a1,1,0,0,0,1-1V14h1.88a1,1,0,0,0,0-2H9.62V9h4.22l-.16.32a1,1,0,0,0,.16,1.26l.4.4a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42L15.38,9h4.62a1,1,0,0,0,1-1V7h.12A1,1,0,0,0,21.12,6.88ZM4,14V4H14V5.88H9.62a1,1,0,0,0,0,2H14v1H9.62a1,1,0,0,0,0,2H14v1H9.62a1,1,0,0,0-1,1Z" />
    </svg>
);


const JobCard: React.FC<{ job: Job }> = ({ job }) => (
  <Card className="p-6 h-full flex flex-col">
    <div className="flex-grow">
        <h3 className="text-xl font-bold text-primary-600 dark:text-primary-400">{job.title}</h3>
        <p className="text-md font-semibold text-gray-700 dark:text-gray-300">{job.company}</p>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 my-3 flex-wrap">
            <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
            <span>{job.location}</span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">{job.description}</p>
    </div>
    
    <div className="grid grid-cols-1 gap-3 mt-auto">
        <a 
            href={job.linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-center bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          <LinkedInIcon />
          View & Apply on LinkedIn
        </a>
        <a 
            href={job.upworkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-center bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-sm"
        >
          <UpworkIcon />
          Find Projects on Upwork
        </a>
        <a 
            href={job.fiverrUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-center bg-gray-800 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-900 transition-colors dark:bg-gray-600 dark:hover:bg-gray-500 text-sm"
        >
          <FiverrIcon />
          Find Gigs on Fiverr
        </a>
    </div>
  </Card>
);

const JobCardSkeleton: React.FC = () => (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md animate-pulse">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
        <div className="space-y-3 mt-6">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
    </div>
);

const FeaturedJobsCategory: React.FC<{ categoryName: string; searchQuery: string }> = ({ categoryName, searchQuery }) => {
    const [jobs, setJobs] = React.useState<Job[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const loadJobs = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const results = await fetchJobs(searchQuery);
                setJobs(results.slice(0, 3)); // Show top 3 results for featured
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load jobs.');
            } finally {
                setIsLoading(false);
            }
        };
        loadJobs();
    }, [searchQuery]);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 border-b-2 border-primary-200 dark:border-primary-800 pb-2">{categoryName}</h2>
            {isLoading ? (
                <div className="grid md:grid-cols-3 gap-6">
                    <JobCardSkeleton />
                    <JobCardSkeleton />
                    <JobCardSkeleton />
                </div>
            ) : error ? (
                <div className="text-center py-8 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">{error}</div>
            ) : jobs.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map(job => <JobCard key={job.id} job={job} />)}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    No representative jobs could be generated for this category.
                </div>
            )}
        </div>
    );
};

export const JobOpportunities = () => {
  const [customJobs, setCustomJobs] = React.useState<Job[]>([]);
  const [isCustomLoading, setIsCustomLoading] = React.useState(false);
  const [customError, setCustomError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');

  const featuredCategories = [
    { name: "Software Engineering", query: "remote entry level software engineer" },
    { name: "Cybersecurity", query: "remote junior cybersecurity analyst" },
    { name: "AI & Data Science", query: "remote entry level data scientist jobs" },
    { name: "Web Development", query: "remote junior frontend developer" },
  ];

  const handleCustomSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) {
      setCustomJobs([]);
      return;
    }
    setIsCustomLoading(true);
    setCustomError(null);
    try {
      const results = await fetchJobs(searchTerm);
      setCustomJobs(results);
    } catch (err) {
      setCustomError(err instanceof Error ? err.message : 'Failed to load jobs.');
    } finally {
      setIsCustomLoading(false);
    }
  };

  return (
    <div className="space-y-16">
      <h1 className="text-4xl font-extrabold text-center">Find Your Next Opportunity</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 -mt-12 max-w-2xl mx-auto">
        Explore representative job roles in top career fields, or use our custom search to find live openings on major platforms.
      </p>

      <section className="space-y-12">
        <h2 className="text-3xl font-bold text-center">Featured Career Opportunities</h2>
        {featuredCategories.map(cat => (
          <FeaturedJobsCategory key={cat.name} categoryName={cat.name} searchQuery={cat.query} />
        ))}
      </section>

      <section>
        <div className="text-center">
            <h2 className="text-3xl font-bold">Custom Job Search</h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mt-2 mb-8 max-w-2xl mx-auto">
                Looking for something specific? Enter any role, skill, or keyword to generate targeted job links.
            </p>
        </div>
        <form onSubmit={handleCustomSearch} className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md sticky top-[75px] z-40 flex gap-4">
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g., entry level cloud engineer remote"
                className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-primary-500 focus:border-primary-500"
                aria-label="Custom job search"
            />
            <button type="submit" disabled={isCustomLoading} className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 disabled:bg-primary-400">
                {isCustomLoading ? 'Searching...' : 'Search'}
            </button>
        </form>
        
        {!isCustomLoading && !customError && customJobs.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-800 dark:bg-blue-900/30 dark:border-blue-400 dark:text-blue-200 rounded-md" role="alert">
                <p className="font-bold">Please Note:</p>
                <p className="text-sm">These are AI-generated examples. Click the buttons on each card to find live job listings and projects on LinkedIn, Upwork, and Fiverr.</p>
            </div>
        )}

        {isCustomLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <JobCardSkeleton />
                <JobCardSkeleton />
                <JobCardSkeleton />
            </div>
        ) : customError ? (
            <div className="text-center py-16 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">{customError}</div>
        ) : customJobs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customJobs.map(job => <JobCard key={job.id} job={job} />)}
            </div>
        ) : (
            <div className="text-center py-16 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p>Enter a search term above to find jobs.</p>
            </div>
        )}
      </section>
    </div>
  );
};