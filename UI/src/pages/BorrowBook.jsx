import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../Component/Navbar';

const BorrowBook = () => {
    const [username, setUsername] = useState("");
    const [dateofIssue, setDateofIssue] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { bookId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const now = new Date();
        const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split('T')[0];
        setDateofIssue(today);
        
        const defaultDueDate = new Date(now);
        defaultDueDate.setDate(defaultDueDate.getDate() + 14);
        const formattedDueDate = new Date(defaultDueDate.getTime() - defaultDueDate.getTimezoneOffset() * 60000).toISOString().split('T')[0];
        setDueDate(formattedDueDate);

        const fetchUser = async () => {
            try {
                const res = await fetch('/api/getUser', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (res.ok) {
                    const data = await res.json();
                    setUsername(data.userName || "");
                } else {
                    throw new Error('Failed to fetch user');
                }
            } catch (error) {
                console.error(error);
                setError('Failed to load user data');
            }
        };

        fetchUser();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const issueDateObj = new Date(dateofIssue);
            const dueDateObj = new Date(dueDate);

            const formData = {
                BookId: bookId,
                DateofIssue: issueDateObj.toISOString(),
                DateofReturn: dueDateObj.toISOString(),
            };

            const res = await fetch("/api/issueBook", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.msg || "Error Borrowing Book");
            }

            setMessage("Book Borrowed successfully!");
            setTimeout(() => {
                navigate('/home');
            }, 2000);

        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-green-50">
            <Navbar/>
            <div className="container mx-auto py-12 px-4">
                <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-green-600 text-center mb-6">Borrow Book</h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        value={username || ""}
                                        readOnly
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="bookId" className="block text-sm font-medium text-gray-700 mb-1">
                                        Book ID
                                    </label>
                                    <input
                                        type="text"
                                        id="bookId"
                                        value={bookId || ""}
                                        readOnly
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 mb-1">
                                        Date of Issue
                                    </label>
                                    <input
                                        type="date"
                                        id="issueDate"
                                        value={dateofIssue || ""}
                                        readOnly
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                                        Due Date
                                    </label>
                                    <input
                                        type="date"
                                        id="dueDate"
                                        value={dueDate || ""}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>

                            {message && <div className="p-3 bg-green-100 text-green-700 rounded-lg text-center">{message}</div>}
                            {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-center">{error}</div>}

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-200"
                                >
                                    Borrow Book
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BorrowBook;