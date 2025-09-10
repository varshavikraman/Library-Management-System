import React from 'react';
import { Link } from 'react-router-dom';
import bgImage from "../assets/image/Pasted image.png";
import logo from '../assets/image/atheneum-logo.png';

const Landing = () => {
  return (
    <div 
      className="h-screen w-screen bg-cover bg-center" 
      style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >

      <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
        <img src={logo} alt="logo" className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48" />
      </div>


      <div className="flex flex-col justify-center items-center h-full text-center px-5 md:px-10 lg:px-20">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-mono font-medium my-5">
          Hi, we're <b className="font-mono text-4xl md:text-5xl lg:text-6xl font-bold text-green-950">Athenaeum</b>.
        </h1>
        <p className="text-lg md:text-xl font-medium my-3">The world's largest bookstore community</p>
        <p className="text-lg md:text-xl font-medium my-3">Home to millions of people who love to chase dreams and make memories.</p>
        <p className="text-lg md:text-xl italic my-3">
          "Where curiosity meets wonder: Dive into our collection and Discover New Worlds."
        </p>

       
        <div className="mt-10 space-x-5 md:space-x-10 flex flex-col md:flex-row">
          <button 
            type="button" 
            className="w-40 md:w-48 h-12 text-green-200 bg-green-900 font-medium rounded-full hover:bg-lime-600"
          >
            <Link to="/login">Log In</Link>
          </button>
          <button 
            type="button" 
            className="w-40 md:w-48 h-12 text-green-200 bg-green-900 font-medium rounded-full hover:bg-lime-600 mt-4 md:mt-0"
          >
            <Link to="/signup">Sign Up</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
