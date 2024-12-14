import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout"; // Новый макет для страницы авторизации
import BannerCarousel from "@/components/UI/Carousel/BannerCarousel";
import ProductListPage from "@/features/Products/pages/ProductListPage";
import ProductDetailsPage from "@/features/Products/pages/ProductDetailsPage";
import LoginRegister from "@/features/Auth/pages/AuthPage";
import PrivateRoute from "@/utils/PrivateRoute";
import Profile from "@/features/Profile/Profile";
import SearchResultsPage from "@/features/Search/pages/SearchResultsPage";
import GlobalStyles from "@/styles/GlobalStyles";

const App: React.FC = () => {
  return (
    <GlobalStyles>
      <Router>
        <Routes>
          {/* Страница авторизации без футера и хедера */}
          <Route
            path="/auth"
            element={
              <AuthLayout>
                <LoginRegister />
              </AuthLayout>
            }
          />

          {/* Остальные страницы с основным макетом */}
          <Route
            path="*"
            element={
              <MainLayout>
                <Routes>
                  <Route path="/" element={<><BannerCarousel /><ProductListPage /></>} />
                  <Route path="/products/:id" element={<ProductDetailsPage />} />
                  <Route path="/search" element={<SearchResultsPage />} />
                  <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                </Routes>
              </MainLayout>
            }
          />
        </Routes>
      </Router>
    </GlobalStyles>
  );
};

export default App;
