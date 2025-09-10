import React, { useState } from 'react'; 
import { Link, useNavigate } from "react-router-dom";
import logo from '../assets/image/atheneum-logo.png';

const Navbar = () => {
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();
    
    const handleSearch = () => {
        if (searchValue.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchValue)}`);
        }
    };
  return (
    <div>
        <div className="flex justify-between bg-lime-700 h-20">
            <div className="flex">
                <img src={logo} alt="logo" className="size-12 my-4 mr-4"/>
                <input 
                type="search" 
                placeholder="Search by book Name, Author, BookId" 
                className=" border border-gray-400 rounded px-4 h-8 my-6 w-full md:w-auto bg-white"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                />
                <button 
                type="button" 
                onClick={handleSearch}
                className="bg-green-500 px-4 h-8 my-6">Search</button>
            </div>
            <div className="space-x-6 mr-8 my-6">
                <Link to="/home" className="text-lg font-medium hover:bg-green-50">Home</Link>
                <Link to="/books" className="text-lg font-medium hover:bg-green-50">Books</Link>
                <Link to="/myBooks" className="text-lg font-medium hover:bg-green-50">My Books</Link>
                <Link to="/logout" className="text-lg font-medium hover:bg-green-50">Logout</Link>
             </div>
        </div>
    </div>
  )
}

export default Navbar