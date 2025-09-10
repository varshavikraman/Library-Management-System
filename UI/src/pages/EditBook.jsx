import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../Component/Navbar';
import DashBar from '../Component/DashBar';

const EditBook = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [copies, setCopies] = useState(0);
  const [currentBook, setCurrentBook] = useState(null);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await fetch(`/api/bookDetails/${bookId}`, {
          method: 'GET',
          credentials: "include"
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch book data');
        }
        
        const data = await response.json();
        if (!data) throw new Error("Book not found");
        
        setCurrentBook(data);
        setCopies(data.numberOfCopies);
      } catch (error) {
        toast.error(error.message);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
  }, [bookId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/updateBookCopies', {
        method: 'PATCH',
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          BookId: bookId,
          NumberOfCopies: parseInt(copies, 10)
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.msg || 'Update failed');
      
      alert('Book copies updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-lime-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lime-100">
      <Navbar />
      <div className="flex">
        <DashBar />
        <div className="flex-1 p-8">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Update Book Copies
                </h2>
                <p className="text-lg text-gray-600">
                  For: <span className="text-green-600 font-medium">{currentBook?.bookTitle}</span>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="copies" className="block text-sm font-medium text-gray-700">
                      Current Copies
                    </label>
                    <span className="text-sm text-gray-500">
                      {currentBook?.numberOfCopies} available
                    </span>
                  </div>
                  <input
                    type="number"
                    id="copies"
                    min="0"
                    value={copies}
                    onChange={(e) => setCopies(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 disabled:opacity-70"
                  >
                    {loading ? 'Updating...' : 'Update Copies'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBook;