import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Landing from './pages/Landing';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Logout from './Component/Logout';
import DashBoard from './pages/DashBoard'
import AddBook from './pages/AddBook';
import BorrowBook from './pages/BorrowBook'
import ReturnBook from './pages/ReturnBook'
import Home from './pages/Home';
import Books from './pages/Books'
import EditBook from './pages/EditBook';
import MyBooks from './pages/MyBooks';
import SearchResult from './Component/SearchResult';
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/landing" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/addBook" element={<AddBook />} />
        <Route path="/editBook/:bookId" element={<EditBook />} />
        <Route path="/borrowBook/:bookId" element={<BorrowBook />} />
        <Route path="/myBooks" element={<MyBooks />} />
        <Route path="/returnBook/:bookId" element={<ReturnBook/>} />
        <Route path="/search" element={<SearchResult />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App