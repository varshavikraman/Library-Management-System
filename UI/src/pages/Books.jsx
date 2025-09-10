import React from 'react'
import Navbar from '../Component/Navbar'
import BookGrid from '../Component/BookGrid'


const Books = () => {
  return (
    <div className="min-h-screen bg-green-50">
      <Navbar/>
      <div className="pb-10">
        <BookGrid isHome={false} showBorrowButton={true} showEditButton = {false} showDeleteButton = {false}/>
      </div>
    </div>
  )
}

export default Books