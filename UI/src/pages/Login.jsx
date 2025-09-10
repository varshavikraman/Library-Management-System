import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bgImage from '../assets/image/Book Background Images.jpg';
import logo from '../assets/image/atheneum-logo.png';

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          UserName: userName,
          Password: password, 
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.msg || 'Log-in failed');
      }

      const data = await response.json();
      console.log("Log-in successful:", data);
      
      if (data.userRole === 'Admin') {
      navigate('/dashboard');
      } else {
        navigate('/home');
      }
      
    } catch (err) {
      setError(err.message || 'Log-in failed: Please try again!');
    }
  };
  return (
    <div 
      className="h-screen w-screen bg-cover bg-center" 
      style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >

      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex flex-col md:flex-row items-center space-x-4 text-center">
        <img src={logo} alt="logo" className="w-16 h-16 md:w-20 md:h-20" />
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-green-800">ATHENAEUM</h1>
      </div>

      <div className="flex flex-col lg:flex-row justify-center items-center h-full px-5 md:px-10 lg:px-20 space-y-10 lg:space-y-0 lg:space-x-16">

        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <p className="text-2xl md:text-3xl font-mono font-medium">Unveil a Realm of Wisdom</p>
          <p className="text-lg md:text-xl my-3">Step into a world where knowledge gleams, A digital haven spun from dreams with books and treasures at your command. Just a click away.</p>
          <p className="text-lg md:text-xl my-3">Explore the pages that whisper and sing, A wellspring of wonder, where ideas take wing.</p>
          <p className="text-lg md:text-xl my-3">
            In our <b className="font-mono text-2xl md:text-3xl text-green-950">ATHENAEUM</b>, unlock the secrets, let inspiration flow, and your curiosity grow.
          </p>
        </div>

        <div className="w-full lg:w-1/2 max-w-lg bg-white rounded-2xl shadow-lg shadow-green-500 p-8">
          <h2 className="text-lime-500 text-2xl md:text-3xl font-medium text-center">Login</h2>
          {error && <p className="text-red-500 text-center">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="pt-4">
              <label className="block">Username:</label>
              <input 
                type="text"
                value={userName} 
                onChange={(e) => setUserName(e.target.value)} 
                required 
                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="pt-4">
              <label className="block">Password:</label>
              <input 
                type="password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="pt-4 flex flex-col md:flex-row justify-between items-center">
              <button 
                className="w-full md:w-36 h-12 text-green-200 bg-green-800 font-medium rounded-lg hover:bg-lime-600 hover:text-white transition"
              >
                Login
              </button>
              <a href="forgot_password" className="text-green-700 hover:text-emerald-500 mt-4 md:mt-0">Forgot Password?</a>
            </div>

            <div className="pt-4 text-center">
              <p>Don't have an account? <Link to="/signup" className="text-green-700 hover:text-emerald-500">Sign Up</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
