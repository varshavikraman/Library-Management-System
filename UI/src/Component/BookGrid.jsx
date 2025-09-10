import React, { useState, useEffect } from 'react';
import BookCard from './BookCard';

const BookGrid = ({ isHome = true, showBorrowButton = true, showEditButton = true, showDeleteButton = true }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const bookList = isHome ? books.slice(0, 4) : books;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("/api/getAllBooks");
        const data = await res.json();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleBookDelete = (deletedBookId) => {
    setBooks(books.filter(book => book.bookId !== deletedBookId));
  };

  return (
    <>
      <h1 className="font-serif text-4xl font-bold text-green-800 text-center my-20">
        {isHome ? "New Arrival" : "The Greatest Books of All Time"}
      </h1>

      {loading ? (
        <div className="text-center">Loading books...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mx-5 my-10">
          {bookList.map((book) => (
            <BookCard 
              key={book.bookId} 
              book={book} 
              showBorrowButton={showBorrowButton}
              showEditButton={showEditButton}
              showDeleteButton={showDeleteButton}
              onDelete={handleBookDelete} 
            />
          ))}
        </div>
      )}
    </>
  );
};

export default BookGrid;