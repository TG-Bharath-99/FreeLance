import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import BrowseProjects from './pages/BrowseProjects';
import ProjectDetails from './pages/ProjectDetails';
import ClientDashboard from './pages/ClientDashboard';
import FreelancerDashboard from './pages/FreelancerDashboard';
import PostProject from './pages/PostProject';
import Profile from './pages/Profile';
import MyApplications from './pages/MyApplications';
import ClientApplications from './pages/ClientApplications';
import Chat from './pages/Chat';
import Payment from './pages/Payment';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <Navbar />
        
        {/* Main page content area */}
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/projects" element={<BrowseProjects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />

            {/* Client-Only Protected Routes */}
            <Route
              path="/client-dashboard"
              element={
                <ProtectedRoute>
                  <RoleRoute requiredRole="client">
                    <ClientDashboard />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/post-project"
              element={
                <ProtectedRoute>
                  <RoleRoute requiredRole="client">
                    <PostProject />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/client-applications/:projectId"
              element={
                <ProtectedRoute>
                  <RoleRoute requiredRole="client">
                    <ClientApplications />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/:id"
              element={
                <ProtectedRoute>
                  <RoleRoute requiredRole="client">
                    <Payment />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            {/* Freelancer-Only Protected Routes */}
            <Route
              path="/freelancer-dashboard"
              element={
                <ProtectedRoute>
                  <RoleRoute requiredRole="freelancer">
                    <FreelancerDashboard />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-applications"
              element={
                <ProtectedRoute>
                  <RoleRoute requiredRole="freelancer">
                    <MyApplications />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            {/* Shared Protected Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat/:id"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />

            {/* Fallback redirect to homepage */}
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
