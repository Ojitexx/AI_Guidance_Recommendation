// Fix: Changed React import from namespace import to default import to fix JSX type errors.
import React from 'react';
import { Card } from '../components/Card';

export const About = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-8">
        <h1 className="text-3xl font-bold text-center mb-6">About the Platform</h1>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            The Career Guidance Platform is a dedicated initiative for the students of the Department of Computer Science at the Federal Polytechnic Bida, Niger State. Our mission is to bridge the gap between academic knowledge and professional success by providing students with the tools and insights needed to navigate the dynamic world of technology careers.
          </p>
          <p>
            Developed as a case study for the institution, this platform leverages the power of Artificial Intelligence to offer personalized career recommendations. By analyzing a student's interests, skills, and personality traits through a carefully designed test, our system suggests suitable career paths within the vast field of Computer Science.
          </p>
          <h2 className="text-2xl font-semibold pt-4">Our Vision</h2>
          <p>
            We envision a future where every Computer Science graduate from Federal Polytechnic Bida is confident and well-informed about their career choices. We aim to empower students to make strategic decisions that align with their passions and the demands of the global tech industry.
          </p>
          <h2 className="text-2xl font-semibold pt-4">Key Features</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>AI-Powered Career Test:</strong> Get personalized recommendations for careers like AI, Cybersecurity, Web Development, and more.</li>
            <li><strong>Digital Library:</strong> Access a curated list of essential books and resources for each career path.</li>
            <li><strong>Job Opportunities:</strong> Find relevant and up-to-date job listings to kickstart your career.</li>
            <li><strong>In-Depth Career Guides:</strong> Explore detailed information about skills, salaries, and future prospects for various tech roles.</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};