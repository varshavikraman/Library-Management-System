import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Component/Navbar';
import DashBar from '../Component/DashBar';

const AddBook = () => {
    const navigate = useNavigate();
    const [bookImage, setBookImage] = useState(null);
    const [bookTitle, setBookTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [description, setDescription] = useState("");
    const [publisher, setPublisher] = useState("");
    const [bookID, setBookID] = useState("");
    const [yearOfPublication, setYearOfPublication] = useState("");
    const [noOfCopies, setNoOfCopies] = useState("");
    
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBookImage(file);
        }
    };
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("bookImage", bookImage);  
            formData.append("BookTitle", bookTitle);
            formData.append("Author", author);  
            formData.append("Description", description);
            formData.append("Publisher", publisher);
            formData.append("BookId", bookID);
            formData.append("YearOfPublication", yearOfPublication);
            formData.append("NumberOfCopies", noOfCopies);
          
            const res = await fetch("/api/addBook", {
                method: "POST",
                credentials: "include",
                body: formData,  
            });
      
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.msg || "Error adding book");  
            }
      
            alert("Book added successfully!");
            navigate('/dashboard');
      
        } catch (err) {
            console.error(err);
            alert("Something went wrong: " + err.message);
        }
    };

    return (
        <div className="min-h-screen bg-lime-100">
            <Navbar />
            <div className="flex">
                <DashBar />
                <div className="flex-1 p-8">
                    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="p-8">
                            <h2 className="text-3xl font-bold text-green-700 text-center mb-8">Add New Book</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Book Image Field - Full Width */}
                                <div className="col-span-full">
                                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                                        Book Image
                                    </label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            <div className="flex text-sm text-gray-600">
                                                <label
                                                    htmlFor="image"
                                                    className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none"
                                                >
                                                    <span>Upload a Image file</span>
                                                    <input
                                                        id="image"
                                                        name="image"
                                                        type="file"
                                                        className="sr-only"
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                    />
                                                </label>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                PNG, JPG, GIF up to 10MB
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                            Book Title
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            value={bookTitle}
                                            onChange={(e) => setBookTitle(e.target.value)}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                                            Author
                                        </label>
                                        <input
                                            type="text"
                                            id="author"
                                            value={author}
                                            onChange={(e) => setAuthor(e.target.value)}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="publisher" className="block text-sm font-medium text-gray-700 mb-1">
                                            Publisher
                                        </label>
                                        <input
                                            type="text"
                                            id="publisher"
                                            value={publisher}
                                            onChange={(e) => setPublisher(e.target.value)}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="bookId" className="block text-sm font-medium text-gray-700 mb-1">
                                            Book ID
                                        </label>
                                        <input
                                            type="text"
                                            id="bookId"
                                            value={bookID}
                                            onChange={(e) => setBookID(e.target.value)}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="publicationYear" className="block text-sm font-medium text-gray-700 mb-1">
                                            Year of Publication
                                        </label>
                                        <input
                                            type="date"
                                            id="publicationYear"
                                            value={yearOfPublication}
                                            onChange={(e) => setYearOfPublication(e.target.value)}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="copies" className="block text-sm font-medium text-gray-700 mb-1">
                                            Number of Copies
                                        </label>
                                        <input
                                            type="number"
                                            id="copies"
                                            min="0"
                                            value={noOfCopies}
                                            onChange={(e) => setNoOfCopies(e.target.value)}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea 
                                        id="description"
                                        rows="4" 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="flex justify-center pt-6">
                                    <button
                                        type="submit"
                                        className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md transition duration-200"
                                    >
                                        Add Book
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

export default AddBook;