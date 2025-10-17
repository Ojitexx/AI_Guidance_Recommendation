import { Job } from '../types';

// In a real application, this would come from a secure source.
// This is a mock representation of what an API might return.
const MOCK_API_JOBS: Job[] = [
  {
    id: '1',
    title: 'Graduate Frontend Engineer (Remote)',
    company: 'GitLab',
    link: 'https://about.gitlab.com/jobs/',
    description: 'We are looking for a Junior Frontend Engineer to join our team. You will be working with Vue.js to build a world-class product.',
    posted_date_string: '2 days ago',
    location: 'Global Remote'
  },
  {
    id: '2',
    title: 'Remote Junior Cloud Support Associate',
    company: 'Amazon Web Services (AWS)',
    link: 'https://www.amazon.jobs/en/jobs/2500099/cloud-support-associate',
    description: 'Help customers solve technical issues with our cloud services. This is a great entry-level role into the world of cloud computing.',
    posted_date_string: '1 week ago',
    location: 'Remote, Nigeria'
  },
  {
    id: '3',
    title: 'Entry Level Cybersecurity Analyst (Remote)',
    company: 'CrowdStrike',
    link: 'https://www.crowdstrike.com/careers/',
    description: 'Join our Falcon team to monitor, analyze, and respond to cybersecurity threats for our global clients. Full training provided.',
    posted_date_string: '4 days ago',
    location: 'Remote'
  },
  {
    id: '4',
    title: 'Backend Developer Intern (Python)',
    company: 'Microsoft',
    link: 'https://careers.microsoft.com/us/en/search-results?q=backend%20developer%20intern',
    description: 'Work with our Azure team to develop and scale backend services. Strong knowledge of data structures and algorithms is required.',
    posted_date_string: '5 days ago',
    location: 'Remote'
  },
];

export const fetchJobs = async (query: string): Promise<Job[]> => {
  console.log(`Simulating API search for jobs with query: ${query}`);
  // In a real app, you would fetch from an API like so:
  // const response = await fetch(`https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&num_pages=1`, {
  //   method: 'GET',
  //   headers: {
  //     'X-RapidAPI-Key': 'YOUR_API_KEY',
  //     'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
  //   }
  // });
  // const data = await response.json();
  // return data.data.map(job => ({ ... transform job data to match Job type ... }));

  // Returning realistic mock data to simulate the API response.
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(MOCK_API_JOBS);
    }, 1500); // Simulate 1.5 second network delay
  });
};