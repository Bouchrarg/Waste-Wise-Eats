import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SpoonacularRecipeDetail from './pages/SpoonacularRecipeDetail';
import ProfilePage from './pages/ProfilePage';
import StorageTipsPage from './pages/StorageTipsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/spoonacular/:id" element={<SpoonacularRecipeDetail />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/tips" element={<StorageTipsPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;