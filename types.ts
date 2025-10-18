export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  department: string;
  level: string;
  role: 'student' | 'admin';
  followUpStatus?: 'none' | 'pending' | 'contacted';
}

export interface Adviser {
  name: string;
  field: string;
}

export enum CareerPathName {
  AI = "Artificial Intelligence & Data Science",
  CYBERSECURITY = "Cybersecurity",
  NETWORKING = "Networking",
  WEB_DEV = "Web Development",
  CLOUD = "Cloud Computing",
  SOFTWARE_ENG = "Software Engineering"
}

export interface Book {
  id: string;
  title: string;
  authors: string[];
  coverUrl?: string;
  description?: string;
  infoLink: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  searchUrl: string;
  description: string;
  location: string;
}

export interface CareerPath {
  name: CareerPathName;
  description: string;
  skills: string[];
  languages: string[];
  advantages: string[];
  futureProspects: string;
  salaryRangeNigeria: string;
  salaryRangeGlobal: string;
}

export interface TestQuestion {
  id: string;
  question: string;
  options: { text: string; value: number }[];
}

export interface TestResult {
  recommendedCareer: CareerPathName;
  skills: string[];
  salaryRange: string;
  jobRoles: string[];
  relevantBooks: string[];
  reasoning: string;
}

export interface UserTestResult {
  id: number;
  userId: number;
  userName?: string;
  recommendedCareer: CareerPathName;
  dateTaken: string;
  fullResult: TestResult;
}