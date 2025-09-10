import React from 'react'

const BorrowedCard = ({ borrow, handleReturn }) => {
    if (!borrow || !borrow.bookInfo) {
        return <p className="text-red-500">Error: Book information not available.</p>;
    }

    const { bookId, bookInfo } = borrow;
    
    const isReturned = bookInfo.actualReturnDate;
    const statusStyle = isReturned ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800";
    
    return (
        <div className={`w-full max-w-2xl ${isReturned ? 'bg-gray-50' : 'bg-green-50'} shadow-lg rounded-lg p-4`}>
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-lime-600">{bookInfo.bookTitle}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${statusStyle}`}>
                    {isReturned ? 'Returned' : 'Borrowed'}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                    <p><span className='font-semibold text-green-600'>Book ID:</span> {bookId}</p>
                    <p><span className='font-semibold text-green-600'>Author:</span> {bookInfo.author}</p>
                </div>
                
                <div>
                    <p><span className='font-semibold text-green-600'>Issued Date:</span> {bookInfo.borrowDate}</p>
                    <p><span className='font-semibold text-green-600'>Due Date:</span> {bookInfo.dueDate}</p>
                    {isReturned && (
                        <p><span className='font-semibold text-blue-600'>Returned On:</span> {bookInfo.actualReturnDate}</p>
                    )}
                </div>
            </div>

            {!isReturned && (
                <div className="flex justify-end mt-4">
                    <button 
                        className="py-2 px-4 rounded text-white bg-green-600 font-medium hover:bg-green-700 transition-all"
                        onClick={() => handleReturn(bookId)}
                    >
                        Return Book
                    </button>
                </div>
            )}
        </div>
    )
}

export default BorrowedCard;