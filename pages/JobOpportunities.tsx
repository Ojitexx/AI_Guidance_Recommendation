// Fix: Changed React import from namespace import to default import to fix JSX type errors.
import React from 'react';
import { fetchJobs } from '../services/jobService';
import { Job } from '../types';
import { Card } from '../components/Card';
import { Alert } from '../components/Alert';

const JobCard: React.FC<{ job: Job }> = ({ job }) => (
  <Card className="p-6 h-full flex flex-col">
    <div className="flex-grow">
      <h3 className="text-xl font-bold text-primary-600 dark:text-primary-400">{job.title}</h3>
      <p className="text-md font-semibold text-gray-700 dark:text-gray-300">{job.company}</p>
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 my-3">
        <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
        <span>{job.location}</span>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">{job.description}</p>
    </div>
    <div className="mt-auto grid grid-cols-3 gap-2">
      <a href={job.linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-center bg-blue-600 text-white text-sm font-bold py-2 px-2 rounded-md hover:bg-blue-700 transition-colors">LinkedIn</a>
      <a href={job.upworkUrl} target="_blank" rel="noopener noreferrer" className="text-center bg-green-500 text-white text-sm font-bold py-2 px-2 rounded-md hover:bg-green-600 transition-colors">Upwork</a>
      <a href={job.fiverrUrl} target="_blank" rel="noopener noreferrer" className="text-center bg-gray-700 text-white text-sm font-bold py-2 px-2 rounded-md hover:bg-gray-800 transition-colors">Fiverr</a>
    </div>
  </Card>
);

const JobCardSkeleton: React.FC = () => (
    <Card className="p-6 h-full flex flex-col animate-pulse">
      <div className="flex-grow">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="space-y-2 mb-6">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
      <div className="mt-auto grid grid-cols-3 gap-2">
          <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </Card>
);


const FeaturedJobsCategory: React.FC<{
    categoryName: string;
    jobs: Job[];
    isLoading: boolean;
    error: string | null;
}> = ({ categoryName, jobs, isLoading, error }) => {
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
                <div className="text-center p-4 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p>An unexpected error occurred while generating job listings. Please try again.</p>
                </div>
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

interface CategoryJobData {
    jobs: Job[];
    isLoading: boolean;
    error: string | null;
}

export const JobOpportunities = () => {
  const [customJobs, setCustomJobs] = React.useState<Job[]>([]);
  const [isCustomLoading, setIsCustomLoading] = React.useState(false);
  const [customError, setCustomError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [featuredJobs, setFeaturedJobs] = React.useState<Record<string, CategoryJobData>>({});

  const featuredCategories = React.useMemo(() => [
    { name: "Software Engineering", query: "remote entry level software engineer" },
    { name: "Cybersecurity", query: "remote junior cybersecurity analyst" },
    { name: "AI & Data Science", query: "remote entry level data scientist jobs" },
    { name: "Web Development", query: "remote junior frontend developer" },
  ], []);

  React.useEffect(() => {
    const loadAllFeaturedJobs = async () => {
        // Set initial loading state for all categories
        const initialLoadingState = featuredCategories.reduce((acc, cat) => {
            acc[cat.name] = { jobs: [], isLoading: true, error: null };
            return acc;
        }, {} as Record<string, CategoryJobData>);
        setFeaturedJobs(initialLoadingState);

        // Fetch sequentially to avoid rate limiting
        for (const category of featuredCategories) {
            try {
                const results = await fetchJobs(category.query);
                setFeaturedJobs(prev => ({
                    ...prev,
                    [category.name]: { jobs: results.slice(0, 3), isLoading: false, error: null }
                }));
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred while generating job listings. Please try again.';
                setFeaturedJobs(prev => ({
                    ...prev,
                    [category.name]: { jobs: [], isLoading: false, error: errorMessage }
                }));
            }
        }
    };
    loadAllFeaturedJobs();
  }, [featuredCategories]);

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
        {featuredCategories.map(cat => {
            const categoryData = featuredJobs[cat.name] || { isLoading: true, error: null, jobs: [] };
            return (
                <FeaturedJobsCategory 
                    key={cat.name} 
                    categoryName={cat.name} 
                    jobs={categoryData.jobs}
                    isLoading={categoryData.isLoading}
                    error={categoryData.error}
                />
            );
        })}
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
            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-800 dark:bg-blue-900/30 dark:border-blue-400 dark:text-blue-200" role="alert">
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