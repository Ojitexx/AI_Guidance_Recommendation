// Fix: Changed React import from namespace import to default import to fix JSX type errors.
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../components/Card';

export const Register = () => {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [department, setDepartment] = React.useState('Computer Science');
    const [level, setLevel] = React.useState('ND I');
    const [error, setError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();
    
    const inputFieldClass = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setError('');
        setIsLoading(true);

        const result = await register({ name, email, password, department, level });
        
        setIsLoading(false);
        if (result.success) {
            navigate('/login', { state: { message: result.message } });
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="flex items-center justify-center py-12">
            <div className="w-full max-w-md">
                <Card className="p-8 space-y-6">
                    <h1 className="text-2xl font-bold text-center">Create an Account</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium">Full Name</label>
                            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className={inputFieldClass} required />
                        </div>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium">Email</label>
                            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputFieldClass} required />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium">Password</label>
                            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputFieldClass} placeholder="••••••••" required />
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium">Confirm Password</label>
                            <input type="password" id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputFieldClass} placeholder="••••••••" required />
                        </div>
                         <div>
                            <label htmlFor="department" className="block mb-2 text-sm font-medium">Department</label>
                            <input type="text" id="department" value={department} onChange={(e) => setDepartment(e.target.value)} className={inputFieldClass} disabled />
                        </div>
                        <div>
                            <label htmlFor="level" className="block mb-2 text-sm font-medium">Level</label>
                            <select id="level" value={level} onChange={(e) => setLevel(e.target.value)} className={inputFieldClass} required>
                                <option>ND I</option>
                                <option>ND II</option>
                                <option>HND I</option>
                                <option>HND II</option>
                            </select>
                        </div>

                        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                        <button type="submit" disabled={isLoading} className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:bg-primary-400">
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                        
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            Already have an account? <Link to="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</Link>
                        </p>
                    </form>
                </Card>
            </div>
        </div>
    );
};