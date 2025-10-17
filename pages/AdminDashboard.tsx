
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MOCK_USERS, MOCK_TEST_RESULTS } from '../data/mockData';
import { Card } from '../components/Card';
import { CareerPathName } from '../types';

export const AdminDashboard = () => {
    const trendData = useMemo(() => {
        const counts = MOCK_TEST_RESULTS.reduce((acc, result) => {
            acc[result.recommendedCareer] = (acc[result.recommendedCareer] || 0) + 1;
            return acc;
        }, {} as Record<CareerPathName, number>);

        return Object.entries(counts).map(([name, count]) => ({ name, count }));
    }, []);

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
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Level</th>
                <th scope="col" className="px-6 py-3">Role</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_USERS.map(user => (
                <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.level}</td>
                  <td className="px-6 py-4">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
