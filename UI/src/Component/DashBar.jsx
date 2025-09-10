import React from 'react'
import { Link } from "react-router-dom";

const DashBar = () => {
  return (
    <div>
          <div className="min-h-screen  w-64 bg-lime-500 flex flex-col space-y-4 pl-10 pt-10 ">
            <Link to="/dashboard" className="text-lg font-medium hover:bg-green-50 hover:w-24">Dashboard</Link>
            <Link to="/addBook" className="text-lg font-medium hover:bg-green-50 hover:w-24">Add Book</Link>
            <Link to="/logout" className="text-lg font-medium hover:bg-green-50 hover:w-24">Logout</Link>
          </div>
    </div>
  )
}

export default DashBar