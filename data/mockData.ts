import { User, CareerPathName, UserTestResult } from '../types';

export const MOCK_USERS: User[] = [
  { id: 1, name: 'John Doe', email: 'student@test.com', password: 'password123', department: 'Computer Science', level: 'HND II', role: 'student' },
  { id: 2, name: 'Admin User', email: 'admin@test.com', password: 'adminpass', department: 'Admin', level: 'Staff', role: 'admin' },
];

export const MOCK_TEST_RESULTS: UserTestResult[] = [
    { id: 1, userId: 1, recommendedCareer: CareerPathName.WEB_DEV, dateTaken: "2024-06-10" },
    { id: 2, userId: 1, recommendedCareer: CareerPathName.AI, dateTaken: "2024-06-12" },
    { id: 3, userId: 1, recommendedCareer: CareerPathName.CYBERSECURITY, dateTaken: "2024-06-15" },
    { id: 4, userId: 1, recommendedCareer: CareerPathName.WEB_DEV, dateTaken: "2024-06-18" },
    { id: 5, userId: 1, recommendedCareer: CareerPathName.CLOUD, dateTaken: "2024-06-20" },
    { id: 6, userId: 1, recommendedCareer: CareerPathName.AI, dateTaken: "2024-06-22" },
];