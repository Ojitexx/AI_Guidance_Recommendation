// Fix: Changed React import from namespace import to default import to fix JSX type errors.
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TestQuestion } from '../types';
import { getCareerRecommendation, generateTestQuestions } from '../services/geminiService';

export const QuickTest: React.FC = () => {
  const [questions, setQuestions] = React.useState<TestQuestion[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = React.useState(true);
  const [questionError, setQuestionError] = React.useState<string | null>(null);

  const [answers, setAnswers] = React.useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchQuestions = async () => {
        try {
            setQuestionError(null);
            setIsLoadingQuestions(true);
            const generatedQuestions = await generateTestQuestions(3);
            setQuestions(generatedQuestions);
        } catch (err) {
            setQuestionError("Failed to load dynamic questions. Using fallback.");
            console.error(err);
        } finally {
            setIsLoadingQuestions(false);
        }
    };
    fetchQuestions();
  }, []);

  const handleOptionChange = (questionId: string, answerText: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerText }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(answers).length < questions.length) {
      setSubmitError("Please answer all questions before submitting.");
      return;
    }
    setSubmitError(null);
    setIsSubmitting(true);
    
    try {
        const result = await getCareerRecommendation(answers);
        navigate('/test-result', { state: { result, isQuickTest: true } });
    } catch (err) {
        setSubmitError("Failed to get recommendation. Please try again later.");
        console.error(err);
    } finally {
        setIsSubmitting(false);
    }
  };

  const renderLoadingSkeleton = () => (
    <div className="space-y-8">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="space-y-3">
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-2">Quick Career Test</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        Answer these few questions for a sample recommendation. Create an account to take the full test and save your results!
      </p>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        {isLoadingQuestions ? renderLoadingSkeleton() : (
          questions.map((q: TestQuestion, index: number) => (
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
          ))
        )}

        {questionError && <p className="text-yellow-500 text-center">{questionError}</p>}
        {submitError && <p className="text-red-500 text-center">{submitError}</p>}

        <div className="text-center pt-4">
          <button 
            type="submit" 
            disabled={isSubmitting || isLoadingQuestions}
            className="w-full md:w-auto inline-flex items-center justify-center px-12 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
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