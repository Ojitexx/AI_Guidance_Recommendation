// Fix: Changed React import from namespace import to default import to fix JSX type errors.
import React from 'react';
import { fetchJobs } from '../services/jobService';
import { Job } from '../types';
import { Card } from '../components/Card';

const JobCard: React.FC<{ job: Job }> = ({ job }) => (
  <Card className="p-6">
    <div className="flex justify-between items-start gap-4">
        <div>
            <h3 className="text-xl font-bold text-primary-600 dark:text-primary-400">{job.title}</h3>
            <p className="text-md font-semibold text-gray-700 dark:text-gray-300">{job.company}</p>
        </div>
    </div>
    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 my-3 flex-wrap">
        <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
        <span>{job.location}</span>
    </div>
    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{job.description}</p>
    <a 
        href={job.searchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-full text-center bg-primary-600 text-white font-bold py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
    >
      Find Similar Jobs
      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
    </a>
  </Card>
);


export const JobOpportunities = () => {
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('remote computer science entry level');

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchTerm) {
      setJobs([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const results = await fetchJobs(searchTerm);
      setJobs(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load jobs.');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-extrabold text-center mb-4">Live Job Search</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
        Find relevant remote job openings. Enter a search term to get representative job roles that link to live search results.
      </p>

      <form onSubmit={handleSearch} className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md sticky top-[75px] z-40 flex gap-4">
        <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="e.g., entry level cybersecurity remote"
            className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-primary-500 focus:border-primary-500"
            aria-label="Job search"
        />
        <button type="submit" disabled={isLoading} className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 disabled:bg-primary-400">
            {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>
      
      {!isLoading && !error && jobs.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-800 dark:bg-blue-900/30 dark:border-blue-400 dark:text-blue-200 rounded-md" role="alert">
            <p className="font-bold">Please Note:</p>
            <p className="text-sm">These are AI-generated examples based on your search. Click the button on each card to find live job listings on major platforms.</p>
          </div>
      )}

      {isLoading ? (
        <div className="text-center py-16">
          <svg className="animate-spin h-8 w-8 text-primary-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4">Our AI is searching for representative job roles...</p>
        </div>
      ) : error ? (
        <div className="text-center py-16 text-red-500">{error}</div>
      ) : jobs.length > 0 ? (
        <div className="space-y-6">
          {jobs.map(job => <JobCard key={job.id} job={job} />)}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold">No jobs found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">No representative jobs could be generated. Try a different query, like 'entry level data analyst'.</p>
        </div>
      )}
    </div>
  );
};