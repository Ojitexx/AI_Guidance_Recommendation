/// <reference types="react" />
import React, { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { TestResult } from '../types';
import { Card } from '../components/Card';
import { useAuth } from '../context/AuthContext';

const InfoPill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="inline-block bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300 text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-full">
        {children}
    </span>
);

export const TestResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, saveTestResult } = useAuth();
  const { result, isQuickTest } = (location.state as { result: TestResult, isQuickTest: boolean }) || {};

  useEffect(() => {
    if (result && !isQuickTest && currentUser) {
      saveTestResult(result);
    }
  }, [result, isQuickTest, currentUser, saveTestResult]);

  if (!result) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">No result to display</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Please take the test first to see your recommendation.</p>
        <Link to="/" className="text-white bg-primary-600 hover:bg-primary-700 font-medium rounded-lg text-sm px-5 py-2.5">
          Go to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {isQuickTest && (
        <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 dark:bg-yellow-900/50 dark:border-yellow-400 dark:text-yellow-300 rounded-md">
            <h3 className="font-bold">This is a Quick Test Result</h3>
            <p>For a more detailed analysis and to save your results, please <Link to="/register" className="font-bold underline hover:text-yellow-800 dark:hover:text-yellow-200">create an account</Link> and take the full test.</p>
        </div>
      )}
      <Card className="p-8">
        <div className="text-center mb-8">
          <h1 className="text-lg text-gray-500 dark:text-gray-400">Your Recommended Career Path Is:</h1>
          <h2 className="text-4xl font-extrabold text-primary-600 dark:text-primary-400">{result.recommendedCareer}</h2>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-3 border-b-2 border-primary-200 dark:border-primary-800 pb-2">Why this path?</h3>
            <p className="text-gray-700 dark:text-gray-300 italic">{result.reasoning}</p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-3 border-b-2 border-primary-200 dark:border-primary-800 pb-2">Key Skills to Develop</h3>
            <div>
              {result.skills.map(skill => <InfoPill key={skill}>{skill}</InfoPill>)}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-3 border-b-2 border-primary-200 dark:border-primary-800 pb-2">Potential Job Roles</h3>
            <div>
              {result.jobRoles.map(role => <InfoPill key={role}>{role}</InfoPill>)}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-3 border-b-2 border-primary-200 dark:border-primary-800 pb-2">Salary Expectation (Nigeria)</h3>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">{result.salaryRange}</p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-3 border-b-2 border-primary-200 dark:border-primary-800 pb-2">Recommended Reading</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                {result.relevantBooks.map(book => <li key={book}>{book}</li>)}
            </ul>
          </div>
        </div>

        <div className="mt-10 text-center">
            <a
                href="#/career-paths"
                className="inline-block text-white bg-primary-600 hover:bg-primary-700 font-medium rounded-lg text-base px-6 py-3"
            >
                Explore All Career Paths
            </a>
        </div>
      </Card>
    </div>
  );
};
