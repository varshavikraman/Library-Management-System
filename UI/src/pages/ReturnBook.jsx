import React, { useState, useEffect } from 'react';
import Navbar from '../Component/Navbar';
import { useParams, useNavigate } from 'react-router-dom';

const ReturnBook = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    bookId: '',
    bookTitle: '',
    author: '',
    dateOfIssue: '',
    dateOfExpire: '',
    returnOn: new Date().toISOString().split('T')[0],
    fine: '0'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  console.log('Book ID from URL:', bookId);

  useEffect(() => {
    const fetchBorrowDetails = async () => {
      try {
        console.log('Starting fetch for bookId:', bookId);
        
        const response = await fetch('/api/getBorrowedBooks', {
          method: 'GET',
          credentials: 'include'
        });
        
        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
        
        const data = await response.json();
        console.log('API response data:', data);
        
        const bookRecord = data.borrowDetails.find(record => 
          record.bookId.trim().toUpperCase() === bookId.trim().toUpperCase()
        );
        
        if (!bookRecord) {
          throw new Error(`No borrow record found for book ${bookId}`);
        }
  

        if (bookRecord.bookInfo.returnDate) {
          throw new Error(
            `This book was already returned on ${bookRecord.bookInfo.returnDate}. ` +
            `Cannot return again.`
          );
        }

        const borrowDate = new Date(bookRecord.bookInfo.borrowDate);
        const expiryDate = new Date(borrowDate);
        expiryDate.setDate(expiryDate.getDate() + 14);
        
        const today = new Date();
        let fine = today > expiryDate ? 
          Math.ceil((today - expiryDate) / (1000 * 60 * 60 * 24 * 7)) * 10 : 
          0;
        
        setFormData({
          username: data.userName,
          bookId: bookRecord.bookId,
          bookTitle: bookRecord.bookInfo.bookTitle,
          author: bookRecord.bookInfo.author,
          dateOfIssue: bookRecord.bookInfo.borrowDate,
          dateOfExpire: expiryDate.toISOString().split('T')[0],
          returnOn: today.toISOString().split('T')[0],
          fine: fine.toString()
        });
        setIsLoading(false);
        
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };
  
    if (bookId) fetchBorrowDetails();
    else {
      setError('No book ID provided');
      setIsLoading(false);
    }
  }, [bookId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/returnBook', {
        method: 'POST',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userName: formData.username,
          bookId: formData.bookId
        })
      });
      
      if (!response.ok) {
        throw new Error(`Return failed: ${response.status}`);
      }
      
      const result = await response.json();
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    }
  };

  const handlePayFine = async () => {
    try {
      
      alert('Payment functionality would be implemented here');
    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment failed');
    }
  };

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-8">Error: {error}</div>;
  if (success) return (
    <div className="text-center py-8 text-green-600">
      Book returned successfully! Redirecting...
    </div>
  );

  return (
    <div className="bg-green-100 min-h-screen">
      <Navbar/>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-green-800 text-white p-6">
            <h2 className="text-2xl font-bold">Return Book</h2>
            <p className="opacity-80">Complete the book return process</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-gray-700">Book Information</h3>
                <p className="mt-2">
                  <span className="font-medium">Title:</span> {formData.bookTitle}
                </p>
                <p>
                  <span className="font-medium">Author:</span> {formData.author}
                </p>
                <p>
                  <span className="font-medium">Book ID:</span> {formData.bookId}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700">User Information</h3>
                <p className="mt-2">
                  <span className="font-medium">Username:</span> {formData.username}
                </p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-700 mb-4">Return Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Issued On</label>
                  <div className="mt-1 p-2 bg-gray-50 rounded">{formData.dateOfIssue}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Due Date</label>
                  <div className="mt-1 p-2 bg-gray-50 rounded">{formData.dateOfExpire}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Returning On</label>
                  <div className="mt-1 p-2 bg-gray-50 rounded">{formData.returnOn}</div>
                </div>
              </div>

              {parseInt(formData.fine) > 0 && (
                <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-yellow-800">Late Return Fine</h4>
                      <p className="text-yellow-600">₹{formData.fine} (₹10 per week late)</p>
                    </div>
                    <button 
                      onClick={handlePayFine}
                      className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                    >
                      Pay Fine
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  Confirm Return
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnBook;