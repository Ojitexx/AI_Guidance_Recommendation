// Fix: Changed React import from namespace import to default import to fix JSX type errors.
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 mt-12 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
          {/* Column 1: Brand & Description */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-block mb-2">
                <div className="flex items-center justify-center md:justify-start">
                    <img src="https://i.ibb.co/bRW2cV6B/R-1-removebg-preview.png" alt="CareerGuidance Logo" className="h-8 mr-2" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">CareerGuidance</span>
                </div>
            </Link>
            <p className="text-sm max-w-xs mx-auto md:mx-0">
              AI-powered career guidance for Computer Science students at Federal Polytechnic Bida.
            </p>
          </div>

          {/* Column 2: Explore Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/career-test" className="hover:text-primary-500 transition-colors">Career Test</Link></li>
              <li><Link to="/library" className="hover:text-primary-500 transition-colors">Library</Link></li>
              <li><Link to="/job-opportunities" className="hover:text-primary-500 transition-colors">Jobs</Link></li>
              <li><Link to="/career-paths" className="hover:text-primary-500 transition-colors">Career Paths</Link></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-primary-500 transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-primary-500 transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <hr className="border-gray-200 dark:border-gray-700" />
        <div className="text-center pt-8">
          <p className="text-sm">
            © {currentYear} CareerGuidance. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};