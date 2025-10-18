// Fix: Changed React import from namespace import to default import to fix JSX type errors.
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../components/Card';
import { CareerPathName, User, UserTestResult } from '../types';
import { ADVISERS } from '../constants';

const InfoPill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="inline-block bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300 text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-full">
        {children}
    </span>
);

const TestResultModal: React.FC<{ result: UserTestResult; onClose: () => void }> = ({ result, onClose }) => {
    const { fullResult } = result;
    if (!fullResult) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 z-10 flex justify-between items-center">
                    <h3 className="text-2xl font-bold">Test Result Details</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <p className="text-sm text-gray-500">Student</p>
                        <p className="font-semibold">{result.userName}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Recommended Career</p>
                        <p className="text-xl font-bold text-primary-600 dark:text-primary-400">{fullResult.recommendedCareer}</p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-2">Reasoning</h4>
                        <p className="italic text-gray-600 dark:text-gray-300">"{fullResult.reasoning}"</p>
                    </div>
                     <div>
                        <h4 className="font-bold mb-2">Key Skills</h4>
                        <div className="flex flex-wrap">{fullResult.skills.map(skill => <InfoPill key={skill}>{skill}</InfoPill>)}</div>
                    </div>
                     <div>
                        <h4 className="font-bold mb-2">Potential Job Roles</h4>
                        <div className="flex flex-wrap">{fullResult.jobRoles.map(role => <InfoPill key={role}>{role}</InfoPill>)}</div>
                    </div>
                     <div>
                        <h4 className="font-bold mb-2">Recommended Books</h4>
                        <ul className="list-disc list-inside">
                            {fullResult.relevantBooks.map(book => <li key={book}>{book}</li>)}
                        </ul>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Date Taken</p>
                        <p className="font-semibold">{new Date(result.dateTaken).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


export const AdminDashboard = () => {
    const [users, setUsers] = React.useState<User[]>([]);
    const [testResults, setTestResults] = React.useState<UserTestResult[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [activeTab, setActiveTab] = React.useState('overview');
    const [selectedResult, setSelectedResult] = React.useState<UserTestResult | null>(null);

    React.useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [usersRes, resultsRes] = await Promise.all([
                    fetch('/api/users'),
                    fetch('/api/test-results')
                ]);

                if (!usersRes.ok || !resultsRes.ok) {
                    throw new Error('Failed to fetch data');
                }

                const usersData = await usersRes.json();
                const resultsData = await resultsRes.json();
                
                setUsers(usersData);
                setTestResults(resultsData);

            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleFollowUpChange = async (userId: number, status: string) => {
        // Optimistically update UI
        setUsers(users.map(u => u.id === userId ? { ...u, followUpStatus: status as User['followUpStatus'] } : u));
        try {
            await fetch(`/api/user-follow-up`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, status })
            });
        } catch (error) {
            console.error("Failed to update status", error);
            // Revert on error
            // Note: A more robust solution would re-fetch the data.
        }
    };

    const trendData = React.useMemo(() => {
        const counts = testResults.reduce((acc, result) => {
            acc[result.recommendedCareer] = (acc[result.recommendedCareer] || 0) + 1;
            return acc;
        }, {} as Record<CareerPathName, number>);

        return Object.entries(counts).map(([name, count]) => ({ name, count }));
    }, [testResults]);
    
    const TabButton: React.FC<{tabName: string; label: string}> = ({tabName, label}) => (
        <button onClick={() => setActiveTab(tabName)} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === tabName ? 'bg-primary-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
            {label}
        </button>
    )

    if (isLoading) {
        return <div className="text-center p-8">Loading dashboard data...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">Error: {error}</div>;
    }

  return (
    <div className="space-y-8">
      {selectedResult && <TestResultModal result={selectedResult} onClose={() => setSelectedResult(null)} />}
      <h1 className="text-4xl font-extrabold">Admin Dashboard</h1>

      <div className="flex space-x-2 border-b dark:border-gray-700">
        <TabButton tabName="overview" label="Overview" />
        <TabButton tabName="users" label="Student Management" />
        <TabButton tabName="results" label="Test Results" />
        <TabButton tabName="advisers" label="Advisers" />
      </div>

      <div id="tab-content">
        {activeTab === 'overview' && (
            <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Career Trend Report</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Distribution of recommended careers from student test results.
                </p>
                <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <BarChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-20} textAnchor="end" height={80} interval={0} />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#006400" name="Number of Recommendations" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        )}
        
        {activeTab === 'users' && (
            <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Student Management</h2>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Level</th>
                            <th scope="col" className="px-6 py-3">Follow-up Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.name}</td>
                            <td className="px-6 py-4">{user.email}</td>
                            <td className="px-6 py-4">{user.level}</td>
                            <td className="px-6 py-4">
                                <select 
                                    value={user.followUpStatus || 'none'}
                                    onChange={(e) => handleFollowUpChange(user.id, e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="none">None</option>
                                    <option value="pending">Pending</option>
                                    <option value="contacted">Contacted</option>
                                </select>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        )}

        {activeTab === 'results' && (
             <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">All Test Results</h2>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Student Name</th>
                            <th scope="col" className="px-6 py-3">Recommendation</th>
                            <th scope="col" className="px-6 py-3">Date Taken</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {testResults.map(result => (
                            <tr key={result.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{result.userName}</td>
                            <td className="px-6 py-4">{result.recommendedCareer}</td>
                            <td className="px-6 py-4">{new Date(result.dateTaken).toLocaleDateString()}</td>
                            <td className="px-6 py-4">
                                <button onClick={() => setSelectedResult(result)} className="font-medium text-primary-600 dark:text-primary-500 hover:underline">
                                    View Details
                                </button>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        )}

        {activeTab === 'advisers' && (
            <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Student Advisers</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Adviser Name</th>
                            <th scope="col" className="px-6 py-3">Field of Expertise</th>
                        </tr>
                        </thead>
                        <tbody>
                        {ADVISERS.map(adviser => (
                            <tr key={adviser.name} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{adviser.name}</td>
                                <td className="px-6 py-4">{adviser.field}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        )}
      </div>
    </div>
  );
};