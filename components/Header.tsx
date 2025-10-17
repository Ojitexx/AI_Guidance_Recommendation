/// <reference types="react" />
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../hooks/useDarkMode';

const NavItem: React.FC<{ to: string; children: React.ReactNode; onClick?: () => void }> = ({ to, children, onClick }) => (
    <li>
        <NavLink 
            to={to} 
            onClick={onClick}
            className={({ isActive }) => 
                `block py-2 px-3 rounded transition-colors duration-200 ${
                    isActive 
                    ? 'text-white bg-primary-600 md:bg-transparent md:text-primary-500 md:dark:text-primary-400' 
                    : 'text-gray-700 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary-600 dark:text-gray-300 md:dark:hover:text-primary-500 dark:hover:bg-gray-700 dark:hover:text-white'
                }`
            }
        >
            {children}
        </NavLink>
    </li>
);

export const Header = () => {
    const { currentUser, logout } = useAuth();
    const [theme, toggleTheme] = useDarkMode();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [profileRef]);

    return (
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 shadow-md">
            <nav className="container mx-auto px-4 lg:px-6 py-2.5">
                <div className="flex flex-wrap justify-between items-center">
                    <Link to="/" className="flex items-center">
                        <img src="https://i.ibb.co/bRW2cV6B/R-1-removebg-preview.png" alt="CareerGuidance Logo" className="h-10 mr-2" />
                        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">CareerGuidance</span>
                    </Link>
                    <div className="flex items-center md:order-2 space-x-2">
                        <button onClick={toggleTheme} className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none">
                            {theme === 'dark' ? 
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg> : 
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 5.05a1 1 0 010-1.414l.707-.707a1 1 0 111.414 1.414l-.707.707a1 1 0 01-1.414 0zM3 11a1 1 0 100-2H2a1 1 0 100 2h1z"></path></svg>
                            }
                        </button>
                        {currentUser ? (
                            <div className="relative" ref={profileRef}>
                                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 font-medium">
                                    <span>Welcome, {currentUser.name.split(' ')[0]}</span>
                                    <svg className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </button>
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                                        <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">My Profile</Link>
                                        <button onClick={() => { logout(); setIsProfileOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center space-x-2">
                                <Link to="/login" className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Login</Link>
                                <Link to="/register" className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none dark:focus:ring-primary-800">Sign Up</Link>
                            </div>
                        )}
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} type="button" className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="mobile-menu" aria-expanded={isMenuOpen}>
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                        </button>
                    </div>
                    <div className={`${isMenuOpen ? 'block' : 'hidden'} justify-between items-center w-full md:flex md:w-auto md:order-1`} id="mobile-menu">
                        <ul className="flex flex-col mt-4 font-medium md:flex-row md:space-x-8 md:mt-0">
                            <NavItem to="/">Home</NavItem>
                            <NavItem to="/career-test">Career Test</NavItem>
                            <NavItem to="/library">Library</NavItem>
                            <NavItem to="/job-opportunities">Jobs</NavItem>
                            <NavItem to="/career-paths">Career Paths</NavItem>
                            <NavItem to="/about">About Us</NavItem>
                            <NavItem to="/contact">Contact</NavItem>
                            {currentUser?.role === 'admin' && <NavItem to="/admin">Admin</NavItem>}
                            {!currentUser && (
                                <div className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center space-x-2">
                                    <Link to="/login" className="w-full text-center text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Login</Link>
                                    <Link to="/register" className="w-full text-center text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none dark:focus:ring-primary-800">Sign Up</Link>
                                </div>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};
