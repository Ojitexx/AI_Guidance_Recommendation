/// <reference types="react" />
import React, { useState, useEffect } from 'react';
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
    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 my-3">
        <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
        <span>{job.location}</span>
        <span className="mx-2">|</span>
        <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
        <span>Posted: {job.posted_date_string}</span>
    </div>
    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{job.description}</p>
    <a 
        href={job.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block w-full text-center bg-primary-600 text-white font-bold py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
    >
      Apply Now
    </a>
  </Card>
);

export const JobOpportunities = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const results = await fetchJobs('remote computer science entry level');
        setJobs(results);
      } catch (err) {
        setError('Failed to load job opportunities. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    loadJobs();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-extrabold text-center mb-4">Job Opportunities</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
        Find the latest remote job openings tailored for Computer Science students and graduates.
      </p>

      {isLoading ? (
        <div className="text-center py-16">
          <svg className="animate-spin h-8 w-8 text-primary-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4">Fetching latest job opportunities...</p>
        </div>
      ) : error ? (
        <div className="text-center py-16 text-red-500">{error}</div>
      ) : (
        <div className="space-y-6">
          {jobs.map(job => <JobCard key={job.id} job={job} />)}
        </div>
      )}
    </div>
  );
};
