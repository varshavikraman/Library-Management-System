import React, { useState } from "react";
import { Link } from "react-router-dom";

const BookCard = ({ book, showBorrowButton = true, showEditButton = true, showDeleteButton = true, onDelete }) => {
  
    if (!book) {
        return <p className="text-red-500">Error: No Book data available.</p>;
    }
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleDelete = async () => {
        setLoading(true);
        setMessage("Deleting book data...");

        try {
            const res = await fetch("/api/deleteBook", {
                method: "DELETE",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({  BookId: book.bookId  })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.msg || "Failed to delete the book");
            }

            setMessage("Book deleted successfully!");
            alert("Book deleted successfully!");

            if (onDelete) onDelete(book.bookId);
        } catch (error) {
            console.error("Delete Error:", error);
            setMessage("Failed to delete book. Please try again.");
            alert("Failed to delete book. Please try again.");
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="flex flex-col bg-lime-100 border rounded-2xl shadow-2xl shadow-green-500">
     
     <img 
        src={`/api/getBookImage?bookTitle=${encodeURIComponent(book.bookTitle)}`} 
        alt={book.bookTitle} 
        className="w-full h-48 object-cover rounded rounded-t-2xl" 
      />

<div className="p-5">
        <h2 className="text-2xl font-bold text-green-700 mb-2">{book.bookTitle}</h2>
        <p className="text-xl font-medium mb-2">by {book.author}</p>
        <p className="text-lg font-medium mb-2">
          <span className="text-green-700 font-medium">Book ID: </span>{book.bookId}
        </p>
        <p className="text-base mb-4">
          {book.description}
      </p>
      
     <div className="flex space-x-3 my-5 px-5">
        {showBorrowButton && (
        <Link
          to={`/borrowBook/${encodeURIComponent(book.bookId)}`}
          className="w-28 h-10 flex items-center justify-center text-green-200 bg-green-800 font-medium rounded-lg hover:bg-emerald-600 hover:text-white transition-all"
        >
          Borrow Book
        </Link>
        )}

        {showDeleteButton && (
        <button
          onClick={handleDelete} 
          className="w-28 h-10 flex items-center justify-center text-red-200 bg-red-600 font-medium rounded-lg hover:bg-red-700 hover:text-white transition-all"
        >
          Delete 
        </button>
        )}

        {showEditButton && (
        <Link
          to={`/editBook/${encodeURIComponent(book.bookId)}`}
          className="w-28 h-10 flex items-center justify-center text-yellow-200 bg-yellow-600 font-medium rounded-lg hover:bg-yellow-700 hover:text-white transition-all"
        >
          Edit
        </Link>
        )}
      </div>
     </div>
    </div>
  );
};

export default BookCard;
