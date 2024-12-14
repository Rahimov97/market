import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import BannerCarousel from "@/components/UI/Carousel/BannerCarousel";
import ProductList from "@/features/Products/pages/ProductList";
import ProductDetails from "@/features/Products/pages/ProductDetails";
import LoginRegister from "@/features/Auth/pages/AuthPage";
import PrivateRoute from "@/utils/PrivateRoute";
import Profile from "@/features/Profile/Profile";
import GlobalStyles from "@/styles/GlobalStyles";

const App: React.FC = () => {
  return (
    <GlobalStyles>
      <Router>
        <Routes>
          <Route path="/auth" element={<LoginRegister />} />
          <Route
            path="*"
            element={
              <MainLayout>
                <Routes>
                  <Route path="/" element={<><BannerCarousel /><ProductList /></>} />
                  <Route path="/products/:id" element={<ProductDetails />} />
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
