import { User, UserTestResult } from '../types';
import { MOCK_USERS, MOCK_TEST_RESULTS } from '../data/mockData';

const USERS_KEY = 'career_guidance_users';
const TEST_RESULTS_KEY = 'career_guidance_test_results';

// --- Initialization ---
// Check if data exists, if not, initialize with mock data.
const initializeDatabase = () => {
    if (!localStorage.getItem(USERS_KEY)) {
        localStorage.setItem(USERS_KEY, JSON.stringify(MOCK_USERS));
    }
    if (!localStorage.getItem(TEST_RESULTS_KEY)) {
        localStorage.setItem(TEST_RESULTS_KEY, JSON.stringify(MOCK_TEST_RESULTS));
    }
};

// Call initialization logic when the service is loaded.
initializeDatabase();


// --- User Functions ---
export const getUsers = (): User[] => {
    const usersJson = localStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
};

const saveUsers = (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getUserByEmail = (email: string): User | undefined => {
    const users = getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

export const addUser = (newUser: Omit<User, 'id' | 'role'>): User | null => {
    const users = getUsers();
    if (users.some(u => u.email.toLowerCase() === newUser.email.toLowerCase())) {
        return null; // User already exists
    }
    const userWithId: User = {
        ...newUser,
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        role: 'student'
    };
    const updatedUsers = [...users, userWithId];
    saveUsers(updatedUsers);
    return userWithId;
};

// --- Test Result Functions ---
export const getTestResults = (): UserTestResult[] => {
    const resultsJson = localStorage.getItem(TEST_RESULTS_KEY);
    return resultsJson ? JSON.parse(resultsJson) : [];
};

const saveTestResults = (results: UserTestResult[]) => {
    localStorage.setItem(TEST_RESULTS_KEY, JSON.stringify(results));
};

export const addTestResult = (newResult: Omit<UserTestResult, 'id'>): UserTestResult => {
    const results = getTestResults();
    const resultWithId: UserTestResult = {
        ...newResult,
        id: results.length > 0 ? Math.max(...results.map(r => r.id)) + 1 : 1
    };
    const updatedResults = [resultWithId, ...results];
    saveTestResults(updatedResults);
    return resultWithId;
};
