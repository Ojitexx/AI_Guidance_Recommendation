import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-16">
      <section 
        className="relative bg-cover bg-center rounded-lg overflow-hidden py-24 md:py-40 text-white text-center shadow-2xl"
        style={{ backgroundImage: "linear-gradient(rgba(0, 100, 0, 0.6), rgba(0, 0, 0, 0.7)), url('https://i.ibb.co/k2HfzDpm/unblurimageai-download-2.png')" }}
      >
        <div className="relative z-10 container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-md">Find Your Future in Computer Science</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 drop-shadow-sm">
            An AI-powered platform for students of the Department of Computer Science, Federal Polytechnic Bida, to discover the perfect career path.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              to={currentUser ? "/career-test" : "/login"}
              className="w-full sm:w-auto inline-block bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 duration-300"
            >
              Take Full Test
            </Link>
             <Link 
              to="/quick-test"
              className="w-full sm:w-auto inline-block bg-gray-200 hover:bg-gray-300 text-primary-700 font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 duration-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
            >
              Try a Quick Test
            </Link>
          </div>
            {!currentUser && (
              <p className="mt-4 text-sm text-gray-200">
                <Link to="/login" className="underline hover:text-white">Login</Link> to save your results and get a full analysis.
              </p>
            )}
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">How It Works</h2>
        <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 mb-8">
          Our platform simplifies your career search in three easy steps.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="text-primary-500 mb-4">
               <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">1. Take the Test</h3>
            <p className="text-gray-600 dark:text-gray-400">Answer questions designed to understand your personality, interests, and skills. Choose between a quick sample or a full test.</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
             <div className="text-primary-500 mb-4">
               <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">2. Get AI Analysis</h3>
            <p className="text-gray-600 dark:text-gray-400">Our AI engine analyzes your results and matches you with the most suitable CS career paths.</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="text-primary-500 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">3. Explore Your Future</h3>
            <p className="text-gray-600 dark:text-gray-400">Receive a detailed report, save your progress, and explore curated resources and job opportunities.</p>
          </div>
        </div>
      </section>
    </div>
  );
};