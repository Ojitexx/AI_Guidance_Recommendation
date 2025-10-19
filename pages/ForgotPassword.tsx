// Fix: Changed React import from namespace import to default import to fix JSX type errors.
import React from 'react';
import { Card } from '../components/Card';
import { Alert } from '../components/Alert';
import { Link } from 'react-router-dom';

export const ForgotPassword = () => {
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [token, setToken] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setToken('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An unexpected error occurred.');
      }
      
      setToken(data.token);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-md">
        <Card className="p-8 space-y-6">
          <h1 className="text-2xl font-bold text-center">Forgot Password</h1>
          {!token ? (
            <>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Enter your email and we'll generate a reset token for you.
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium">Your Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
                    placeholder="name@company.com" 
                    required 
                  />
                </div>
                <Alert type="error" message={error} />
                <button type="submit" disabled={isLoading} className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:bg-primary-400">
                    {isLoading ? 'Generating...' : 'Get Reset Token'}
                </button>
              </form>
            </>
          ) : (
            <div className="space-y-4">
                <Alert type="info" message="Use the token below to reset your password. In a real app, this would be emailed." />
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm font-mono break-all text-gray-700 dark:text-gray-300">{token}</p>
                </div>
                <Link to={`/reset-password/${token}`} className="w-full inline-block text-center text-white bg-primary-600 hover:bg-primary-700 font-medium rounded-lg text-sm px-5 py-2.5">
                    Go to Reset Page
                </Link>
            </div>
          )}
           <p className="text-sm font-light text-center text-gray-500 dark:text-gray-400">
                Remember your password? <Link to="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</Link>
            </p>
        </Card>
      </div>
    </div>
  );
};