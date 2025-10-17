// FIX: Re-added React types reference directive to resolve JSX intrinsic elements errors.
/// <reference types="react" />
import React from 'react';
import { CAREER_PATHS } from '../constants';
import { CareerPath } from '../types';
import { Card } from '../components/Card';

const CareerPathCard: React.FC<{ path: CareerPath }> = ({ path }) => (
  <Card>
    <div className="p-6">
      <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-3">{path.name}</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">{path.description}</p>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold">Key Skills:</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {path.skills.map(skill => (
              <span key={skill} className="bg-gray-200 dark:bg-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">{skill}</span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold">Languages & Tools:</h4>
           <div className="flex flex-wrap gap-2 mt-2">
            {path.languages.map(lang => (
              <span key={lang} className="bg-gray-200 dark:bg-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">{lang}</span>
            ))}
          </div>
        </div>
         <div>
          <h4 className="font-semibold">Future Prospects:</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{path.futureProspects}</p>
        </div>
        <div>
          <h4 className="font-semibold">Salary Range (Nigeria):</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{path.salaryRangeNigeria}</p>
        </div>
        <div>
          <h4 className="font-semibold">Salary Range (Global):</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{path.salaryRangeGlobal}</p>
        </div>
      </div>
    </div>
  </Card>
);


export const CareerPaths = () => {
  return (
    <div>
      <h1 className="text-4xl font-extrabold text-center mb-4">Explore Career Paths</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
        Dive deep into the various specializations within Computer Science to find your perfect fit.
      </p>
      <div className="space-y-8">
        {CAREER_PATHS.map(path => <CareerPathCard key={path.name} path={path} />)}
      </div>
    </div>
  );
};