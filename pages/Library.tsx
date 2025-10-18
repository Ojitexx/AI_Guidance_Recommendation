// Fix: Changed React import from namespace import to default import to fix JSX type errors.
import React from 'react';
import { searchBooks } from '../services/libraryService';
import { Card } from '../components/Card';
import { Book as BookType, CareerPathName } from '../types';
import { useDebounce } from '../hooks/useDebounce';

const BookCard: React.FC<{ book: BookType }> = ({ book }) => (
  <Card className="flex flex-col h-full">
    <img 
      src={book.coverUrl || `https://via.placeholder.com/300x400.png?text=No+Cover`} 
      alt={book.title} 
      className="w-full h-64 object-cover" 
    />
    <div className="p-4 flex flex-col flex-grow">
      <h3 className="text-lg font-bold mb-1 line-clamp-2">{book.title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">by {book.authors.join(', ')}</p>
      <p className="text-gray-700 dark:text-gray-300 text-sm flex-grow line-clamp-3">{book.description || "No description available."}</p>
      <a 
        href={book.infoLink} 
        target="_blank" 
        rel="noopener noreferrer"
        className="mt-4 w-full text-center bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition-colors"
      >
        View Resource
      </a>
    </div>
  </Card>
);

export const Library = () => {
  const [books, setBooks] = React.useState<BookType[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('Computer Science');
  const [selectedCategory, setSelectedCategory] = React.useState<CareerPathName | 'All'>('All');
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const categories = ['All', ...Object.values(CareerPathName)];

  React.useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const results = await searchBooks(debouncedSearchTerm, selectedCategory);
        setBooks(results);
      } catch (err) {
        setError('Failed to fetch books. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBooks();
  }, [debouncedSearchTerm, selectedCategory]);

  return (
    <div>
      <h1 className="text-4xl font-extrabold text-center mb-4">Digital Library</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
        Explore a curated collection of books and resources for every Computer Science career path.
      </p>

      <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md sticky top-[75px] z-40">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by title or topic..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full md:flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-primary-500 focus:border-primary-500"
          />
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value as CareerPathName | 'All')}
            className="w-full md:w-auto p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-primary-500 focus:border-primary-500"
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>
      
      {isLoading ? (
         <div className="text-center py-16">
            <svg className="animate-spin h-8 w-8 text-primary-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4">Searching for resources...</p>
         </div>
      ) : error ? (
         <div className="text-center py-16 text-red-500">{error}</div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {books.map(book => <BookCard key={book.id} book={book} />)}
        </div>
      ) : (
        <div className="text-center py-16">
            <h3 className="text-xl font-semibold">No books found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};