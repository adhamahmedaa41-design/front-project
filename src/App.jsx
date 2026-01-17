import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';
import Login from './pages/login/login';
import Register from './pages/register/register';
import VerifyOtp from './pages/verifyotp/verifyOtp';
import ForgotPassword from './pages/forgot-password/forgot-password';
import ResetPassword from './pages/resetPassword/resetPassword';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './store/slices/userSlice';
import api from './api/api';

function App() {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.user);

  // DEBUG: Log current URL
  console.log('📍 Current URL:', window.location.href);
  console.log('📍 Current Pathname:', window.location.pathname);

  useEffect(() => {
    console.log('🔍 App useEffect running, isLoggedIn:', isLoggedIn);
    
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      console.log('🔄 Token validation started, token exists:', !!token);
      
      if (!token) {
        console.log('❌ No token found → user is guest');
        dispatch(clearUser());
        return;
      }

      console.log('✅ Found token → validating...');
      try {
        const response = await api.get('/api/auth/me');
        const userData = response.data.user || response.data;
        console.groupCollapsed('✅ Auth restored successfully');
        console.log('User data:', userData);
        console.groupEnd();
        dispatch(setUser(userData));
      } catch (error) {
        console.groupCollapsed('❌ Token validation failed');
        if (error.response) {
          console.log('Status:', error.response.status);
          console.log('Message:', error.response.data?.message || 'No message');
        }
        console.groupEnd();

        localStorage.removeItem('token');
        dispatch(clearUser());
      }
    };

    validateToken();
  }, [dispatch]);

  return (
    <div className="App">
      <Navbar />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }}
      />

      <div className="content-container">
        <Routes>
          {/* PUBLIC ROUTES - Always accessible */}
          
          {/* Reset password route - MUST be near the top */}
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          {/* Other public routes */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Auth routes - redirect if already logged in */}
          <Route 
            path="/login" 
            element={!isLoggedIn ? <Login /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/register" 
            element={!isLoggedIn ? <Register /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/verify-otp" 
            element={!isLoggedIn ? <VerifyOtp /> : <Navigate to="/" replace />} 
          />

          {/* Home page */}
          <Route path="/" element={<h1>Welcome to Home Page</h1>} />

          {/* Catch-all 404 - MUST be last */}
          <Route path="*" element={
            <div className="container mt-5">
              <h2>404 - Page Not Found</h2>
              <p>DEBUG: No route matched for: {window.location.pathname}</p>
              <p>Full URL: {window.location.href}</p>
              <button onClick={() => window.location.href = '/'}>
                Go to Home
              </button>
            </div>
          } />
        </Routes>
      </div>
    </div>
  );
}

export default App;