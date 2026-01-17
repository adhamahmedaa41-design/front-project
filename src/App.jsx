// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';
import Login from './pages/login/login';
import Register from './pages/register/register';
import VerifyOtp from './pages/verifyotp/verifyOtp.jsx';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './store/slices/userSlice';
import api from './api/api.jsx';

function App() {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.user);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');

      // No token → definitely not logged in
      if (!token) {
        console.log('No token found → user is guest');
        dispatch(clearUser());
        return;
      }

      console.log('Found token → validating...');

      try {
        // Because you already have interceptor that adds Bearer token automatically,
        // you DON'T need to pass headers again (cleaner & less error-prone)
        const response = await api.get('/api/auth/me');

        const userData = response.data.user || response.data;

        console.groupCollapsed('✅ Auth restored successfully');
        console.log('User:', userData);
        console.groupEnd();

        dispatch(setUser(userData));
      } catch (error) {
        console.groupCollapsed('❌ Token validation failed');
        if (error.response) {
          // 401 = unauthorized/invalid/expired token (most common)
          // 404 = route not found (backend problem)
          console.log('Status:', error.response.status);
          console.log('Message:', error.response.data?.message || 'No message');
        } else if (error.request) {
          console.log('No response → network/server down?');
        } else {
          console.error('Unexpected error:', error.message);
        }
        console.groupEnd();

        // Clean invalid/expired token
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
          {/* Public routes - always accessible */}
          <Route path="/" element={<h1>Welcome to Home Page</h1>} />

          {/* Auth routes - only visible when NOT logged in */}
          {!isLoggedIn && (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />
            </>
          )}

          {/* Protected routes - only visible when logged in */}
          {isLoggedIn && (
            <>
              <Route
                path="/profile"
                element={<h1>Profile Page (TODO: create real component)</h1>}
              />
              {/* Add more protected routes here */}
            </>
          )}

          {/* Redirect logged-in users away from auth pages */}
          {isLoggedIn && (
            <>
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/register" element={<Navigate to="/" replace />} />
              <Route path="/verify-otp" element={<Navigate to="/" replace />} />
            </>
          )}

          {/* 404 */}
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;