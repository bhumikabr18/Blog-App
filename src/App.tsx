import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import CreateBlog from './pages/CreateBlog';
import BlogDetail from './pages/BlogDetail';
import EditBlog from './pages/EditBlog';
import NotFound from './pages/NotFound';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route 
              path="/create" 
              element={
                <ProtectedRoute>
                  <CreateBlog />
                </ProtectedRoute>
              } 
            />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route 
              path="/blog/:id/edit" 
              element={
                <ProtectedRoute>
                  <EditBlog />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;