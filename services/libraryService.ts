import { Book, CareerPathName } from '../types';

const API_URL = 'https://www.googleapis.com/books/v1/volumes';

// A map to get better search terms for Google Books API.
// Using specific terms and quoted phrases improves search quality over long subject names.
const categorySearchTerms: Partial<Record<CareerPathName, string>> = {
    [CareerPathName.AI]: '"Artificial Intelligence" OR "Data Science" OR "Machine Learning"',
    [CareerPathName.CYBERSECURITY]: 'Cybersecurity OR "Information Security" OR "Ethical Hacking"',
    [CareerPathName.NETWORKING]: '"Computer Networking" OR "Network Administration" OR "Cisco"',
    [CareerPathName.WEB_DEV]: '"Web Development" OR "Full-Stack Development" OR JavaScript OR React',
    [CareerPathName.CLOUD]: '"Cloud Computing" OR AWS OR Azure OR "Google Cloud"',
    [CareerPathName.SOFTWARE_ENG]: '"Software Engineering" OR "Software Design" OR "Clean Code"',
};


export const searchBooks = async (query: string, category: CareerPathName | 'All'): Promise<Book[]> => {
    let finalQuery: string;

    if (category !== 'All') {
        // If a category is selected, use a more specific query for it.
        const categoryTerm = categorySearchTerms[category] || `"${category}"`;
        
        // If the user's query is the default "Computer Science" or empty, just search by category.
        // Otherwise, combine the category search with the user's specific query.
        const isDefaultQuery = query.trim().toLowerCase() === 'computer science' || query.trim() === '';
        finalQuery = isDefaultQuery ? categoryTerm : `${categoryTerm} AND ${query}`;
    } else {
        // For 'All' category, just use the user's search query.
        finalQuery = query;
    }
    
    if (!finalQuery.trim()) return [];

    try {
        // Increased maxResults to 40 to provide more resources
        const response = await fetch(`${API_URL}?q=${encodeURIComponent(finalQuery)}&maxResults=40`);
        if (!response.ok) {
            throw new Error('Failed to fetch books from Google Books API');
        }
        const data = await response.json();
        
        if (!data.items) return [];

        const books: Book[] = data.items.map((item: any) => ({
            id: item.id,
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors || ['Unknown Author'],
            coverUrl: item.volumeInfo.imageLinks?.thumbnail.replace('http://', 'https://'), // Ensure HTTPS
            description: item.volumeInfo.description,
            infoLink: item.volumeInfo.infoLink,
        }));
        
        return books;
    } catch (error) {
        console.error("Error searching books:", error);
        throw error;
    }
};