import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BannerCarousel from './components/BannerCarousel';
import ProductList from './pages/ProductList';
import SearchResults from './pages/SearchResults';
import AdminPanel from './pages/AdminPanel';
import LoginRegister from './features/Auth/LoginRegister';
import Profile from './features/Profile/Profile';
import PrivateRoute from './components/PrivateRoute';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Маршруты без Navbar */}
        <Route path="/auth" element={<LoginRegister />} />

        {/* Все остальные маршруты с Navbar */}
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <BannerCarousel />
                      <ProductList />
                    </>
                  }
                />
                <Route path="/search" element={<SearchResults />} />
                <Route
                  path="/admin"
                  element={
                    <PrivateRoute>
                      <AdminPanel />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
