import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { AuthProvider } from "@/context/AuthContext";
import AuthLayout from "@/layouts/AuthLayout";
import BannerCarousel from "@/components/UI/Carousel/BannerCarousel";
import ProductListPage from "@/features/Products/pages/ProductListPage";
import ProductDetailsPage from "@/features/Products/pages/ProductDetailsPage";
import LoginRegister from "@/features/Auth/pages/AuthPage";
import BuyerProfile from "@/features/Buyer/pages/BuyerProfile"
import SearchResultsPage from "@/features/Search/pages/SearchResultsPage";
import GlobalStyles from "@/styles/GlobalStyles";
import AuthRedirect from "@/components/UI/AuthRedirect";
import ProtectedRoute from "@/components/UI/ProtectedRoute";

const App: React.FC = () => {
  return (
    <GlobalStyles>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Запрещаем доступ к странице авторизации для авторизованных пользователей */}
            <Route
              path="/auth"
              element={
                <AuthRedirect>
                  <AuthLayout>
                    <LoginRegister />
                  </AuthLayout>
                </AuthRedirect>
              }
            />

            {/* Основные маршруты */}
            <Route
              path="/"
              element={
                <MainLayout>
                  <BannerCarousel />
                  <ProductListPage />
                </MainLayout>
              }
            />
            <Route
              path="/products/:id"
              element={
                <MainLayout>
                  <ProductDetailsPage />
                </MainLayout>
              }
            />
            <Route
              path="/search"
              element={
                <MainLayout>
                  <SearchResultsPage />
                </MainLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <BuyerProfile />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            {/* Перенаправляем все некорректные маршруты на главную */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </GlobalStyles>
  );
};

export default App;
