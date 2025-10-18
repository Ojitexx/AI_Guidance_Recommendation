// Fix: Changed React import from namespace import to default import to fix JSX type errors.
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/Card';
import { UserTestResult } from '../types';

const ProfileInfo: React.FC<{ label: string; value: string | undefined }> = ({ label, value }) => (
    <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{value}</p>
    </div>
);

const TestHistoryItem: React.FC<{ result: UserTestResult }> = ({ result }) => (
    <li className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div>
            <p className="font-bold text-primary-600 dark:text-primary-400">{result.recommendedCareer}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Taken on: {new Date(result.dateTaken).toLocaleDateString()}</p>
        </div>
    </li>
);

export const Profile = () => {
    const { currentUser, testResults } = useAuth();
    const userResults = testResults.filter(r => r.userId === currentUser?.id);

    if (!currentUser) {
        return <p>Loading profile...</p>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl font-extrabold">My Profile</h1>
            
            <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6 border-b pb-4">Student Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProfileInfo label="Full Name" value={currentUser.name} />
                    <ProfileInfo label="Email Address" value={currentUser.email} />
                    <ProfileInfo label="Department" value={currentUser.department} />
                    <ProfileInfo label="Level" value={currentUser.level} />
                </div>
            </Card>

            <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6 border-b pb-4">Career Test History</h2>
                {userResults.length > 0 ? (
                    <ul className="space-y-4">
                        {userResults.map(result => <TestHistoryItem key={result.id} result={result} />)}
                    </ul>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">You haven't taken any tests yet.</p>
                        <p className="mt-2">Take the full career test to see your history here.</p>
                    </div>
                )}
            </Card>
        </div>
    );
};