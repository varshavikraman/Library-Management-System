import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BookCard from './BookCard';
import Navbar from './Navbar';

const SearchResult = () => {
    const [bookList, setBookList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query') || '';

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                setError(null);
                
                if (!query.trim()) {
                    setBookList([]);
                    return;
                }

                const response = await fetch(`/api/searchbook?searchValue=${encodeURIComponent(query)}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                setBookList(data);
            } catch (error) {
                console.error('Error fetching books:', error);
                setError('Failed to fetch books. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [query]);

    return (
        <div>
            <Navbar/>
            <h1 className="text-green-500 text-2xl sm:text-3xl font-semibold text-center mb-6">
                Search Results {query && `for "${query}"`}
            </h1>

            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mx-5 my-10">
                    {bookList.length > 0 ? (
                        bookList.map((book) => (
                            <BookCard
                                key={book.bookId}
                                book={book} 
                                showBorrowButton={true}
                                showEditButton={false}
                                showDeleteButton={false}
                            />
                        ))
                    ) : (
                        <p className="text-center text-gray-500">
                            {query ? "No books found matching your search." : "Please enter a search query."}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchResult;