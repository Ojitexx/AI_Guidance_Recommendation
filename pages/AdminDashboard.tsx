// FIX: Re-added React types reference directive to resolve JSX intrinsic elements errors.
/// <reference types="react" />
import React, { useMemo, useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../components/Card';
import { CareerPathName, User, UserTestResult } from '../types';

export const AdminDashboard = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [testResults, setTestResults] = useState<UserTestResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
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

    const trendData = useMemo(() => {
        const counts = testResults.reduce((acc, result) => {
            acc[result.recommendedCareer] = (acc[result.recommendedCareer] || 0) + 1;
            return acc;
        }, {} as Record<CareerPathName, number>);

        return Object.entries(counts).map(([name, count]) => ({ name, count }));
    }, [testResults]);

    if (isLoading) {
        return <div className="text-center p-8">Loading dashboard data...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">Error: {error}</div>;
    }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-extrabold">Admin Dashboard</h1>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Career Trend Report</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
            This chart shows the distribution of recommended careers from student test results.
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
      
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
              </tr>
            </thead>
          </table>
        </div>
      </Card>
    </div>
  );
};