import './App.css';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

import HomePage from './components/Pages/Home/HomePage';
import Login from './components/Pages/Login/LoginPage';
import Blog from './components/Pages/Blog/BlogPage';
import UserDashboard from './components/Pages/UserDashBoard/UserDashBoard';
import ManageUsers from './components/Pages/ManageUsers/ManageUserPage';
import PageNotFound from './components/Pages/PageNotFound/PageNotFound';
import Navbar from './components/NavBar/NavBarPage';
import AdminDashboard from './components/Pages/AdminDashboard/AdminDashBoardPage';
import AlertsPage from './components/Pages/AdminDashboard/Alerts';
import Footer from './components/Footer/FooterPage';
import ProtectedRoute from './auth/ProtectedRoutes';
import VerifyEmailPage from './auth/EmailVerification';
import ApiLogsPage from './components/Pages/AdminDashboard/ApiLog';
import ManageBlogs from './components/Pages/AdminManageBlog/ManageBlog';
import EditProfile from './components/NavBar/editProfile';
import ForgotPassword from './components/Pages/Login/forgotPassword';


export default function App() {
  const [user, setUser] = useState({
    isAuthenticated: false,
    role: null,
  });

  const [isLoading, setIsLoading] = useState(true); // ✅ New: loading state

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    if (!token) {
      setUser({ isAuthenticated: false, role: null });
      setIsLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;

      if (!decoded.exp || decoded.exp < now) {
        setUser({ isAuthenticated: false, role: null });
        setIsLoading(false);
        return;
      }

      setUser({
        isAuthenticated: true,
        role: decoded.role,
      });

    } catch (e) {
      console.error("Invalid token:", e);
      setUser({ isAuthenticated: false, role: null });
    }

    setIsLoading(false); // ✅ Mark done
  }, [location.pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setUser({ isAuthenticated: false, role: null });
    navigate('/login');
  };

  if (isLoading) {
    return <div>Loading...</div>; // ✅ Don’t render routes until token check is done!
  }

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar user={user} onLogout={handleLogout} />

      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path="/login"
            element={
              user.isAuthenticated
                ? <Navigate to="/" replace />
                : <Login setUser={setUser} />
            }
          />

          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/blog" element={<Blog />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAllowed={user.isAuthenticated && user.role === 'user'}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manage-users"
            element={
              <ProtectedRoute isAllowed={user.isAuthenticated && (user.role === 'admin' || user.role === 'subadmin')}>
                <ManageUsers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute isAllowed={user.isAuthenticated && (user.role === 'admin' || user.role === 'subadmin')}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-dashboard/alerts"
            element={
              <ProtectedRoute isAllowed={user.isAuthenticated && (user.role === 'admin' || user.role === 'subadmin')}>
                <AlertsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-dashboard/logs"
            element={
              <ProtectedRoute isAllowed={user.isAuthenticated && (user.role === 'admin' || user.role === 'subadmin')}>
                <ApiLogsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-manage-blog"
            element={
              <ProtectedRoute isAllowed={user.isAuthenticated && (user.role === 'admin' || user.role === 'subadmin')}>
                <ManageBlogs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute isAllowed={user.isAuthenticated && (user.role === 'admin' || user.role === 'subadmin')}>
                <EditProfile />
              </ProtectedRoute>
            }
          />


          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}
