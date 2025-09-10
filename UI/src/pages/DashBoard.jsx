import React from 'react';
import Navbar from '../Component/Navbar';
import DashBar from '../Component/DashBar';
import BookGrid from '../Component/BookGrid';

const DashBoard = () => {
  return (
    <div className="h-screen flex flex-col bg-lime-100">

      <div className="fixed top-0 left-0 right-0 z-20"> 
        <Navbar />
      </div>
      
      <div className="flex pt-16 h-full"> 
        
        <div className="fixed left-0 top-16 bottom-0 z-10 w-64"> 
          <DashBar />
        </div>
        
        <div className="flex-1 ml-64 h-full overflow-y-auto"> 
          <div className="p-10">
            <BookGrid 
              isHome={true} 
              showBorrowButton={false} 
              showEditButton={true} 
              showDeleteButton={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;