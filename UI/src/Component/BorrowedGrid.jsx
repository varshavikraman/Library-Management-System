import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"; 
import BorrowedCard from './BorrowedCard';

const BorrowedGrid = ({ isHome = true, showReturned = false }) => {
    const [borrows, setBorrows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBorrowedBooks = async () => {
            try {
                const response = await fetch("/api/getBorrowedBooks", {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch borrowed books");
                }

                const data = await response.json();
                
                if (data && Array.isArray(data.borrowDetails)) {
                    const filtered = showReturned 
                        ? data.borrowDetails 
                        : data.borrowDetails.filter(book => !book.bookInfo.actualReturnDate);
                    setBorrows(filtered);
                } else {
                    setBorrows([]);
                }
            } catch (error) {
                console.error("Error:", error);
                setError(error.message);
                setBorrows([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBorrowedBooks();
    }, [showReturned]);

    const handleReturn = (bookId) => {
        navigate(`/returnBook/${bookId}`, { 
            state: { fromBorrowed: true }  
        });
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-green-700 text-center mb-8">
                {isHome ? "My Books" : "Borrowed Books Management"}
            </h1>
        
            {loading ? (
                <div className="text-center py-8">Loading books...</div>
            ) : error ? (
                <div className="text-red-500 text-center py-8">{error}</div>
            ) : borrows.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    {showReturned ? "No returned books found" : "No books currently borrowed"}
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                    {borrows.map((borrowItem) => (
                        <BorrowedCard 
                            key={borrowItem._id} 
                            borrow={borrowItem} 
                            handleReturn={handleReturn} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default BorrowedGrid;