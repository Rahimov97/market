import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductList from './pages/ProductList';
import GlobalStyles from './styles/GlobalStyles';
import ProductDetails from './pages/ProductDetails';

const App: React.FC = () => {
  return (
    <GlobalStyles>
      <Router>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Routes>
      </Router>
    </GlobalStyles>
  );
};

export default App;
