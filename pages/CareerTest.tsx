/// <reference types="react" />
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TEST_QUESTIONS } from '../constants';
import { TestQuestion } from '../types';
import { getCareerRecommendation } from '../services/geminiService';

export const CareerTest: React.FC = () => {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleOptionChange = (questionId: string, answerText: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerText }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(answers).length < TEST_QUESTIONS.length) {
      setError("Please answer all questions before submitting.");
      return;
    }
    setError(null);
    setIsLoading(true);
    
    try {
        const result = await getCareerRecommendation(answers);
        navigate('/test-result', { state: { result, isQuickTest: false } });
    } catch (err) {
        setError("Failed to get recommendation. Please try again later.");
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-2">Full Career Test</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        Answer these questions for a comprehensive analysis of your interests. Your result will be saved to your profile.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        {TEST_QUESTIONS.map((q: TestQuestion, index: number) => (
          <div key={q.id} className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h2 className="text-lg font-semibold mb-4">
              <span className="text-primary-500 mr-2">{index + 1}.</span>{q.question}
            </h2>
            <div className="space-y-3">
              {q.options.map(option => (
                <label key={option.text} className="flex items-center p-3 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors duration-200 has-[:checked]:bg-primary-100 has-[:checked]:border-primary-500 dark:has-[:checked]:bg-primary-900/50 dark:has-[:checked]:border-primary-500">
                  <input
                    type="radio"
                    name={q.id}
                    value={option.text}
                    onChange={() => handleOptionChange(q.id, option.text)}
                    className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    required
                  />
                  <span className="ml-3 text-gray-700 dark:text-gray-300">{option.text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="text-center pt-4">
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full md:w-auto inline-flex items-center justify-center px-12 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : "Get My Recommendation"}
          </button>
        </div>
      </form>
    </div>
  );
};
