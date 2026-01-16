// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';     // ← This import must be correct

// Your page components
import Login from './pages/login/login';     // ← remove .jsx
import Register from './pages/register/register';
import { Toaster } from 'react-hot-toast';

// You can create a simple Home later
// import Home from './pages/Home/Home';

function App() {
  return (
    <div className="App">
      {/* Navbar should be here – outside Routes – so it shows on every page */}
      <Navbar />
      <Toaster position='top-right'/>

      <div className="content-container">   {/* optional wrapper */}
        <Routes>
          <Route path="/" element={<h1>Welcome to Home Page</h1>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<verifyOtp />} />
          
          {/* 404 fallback */}
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;