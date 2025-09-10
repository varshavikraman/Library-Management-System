import React from 'react'
import Navbar from '../Component/Navbar'
import BorrowedGrid from '../Component/BorrowedGrid'

const MyBooks = () => {
  return (
    <div className="min-h-screen bg-green-50 flex flex-col">
      <Navbar/>
      <div className="flex-1 p-4 md:p-8">
        <BorrowedGrid/>
      </div>
    </div>
  )
}

export default MyBooks