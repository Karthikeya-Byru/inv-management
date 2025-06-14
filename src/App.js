import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import SaleList from './components/SaleList';
import AddSale from './components/AddSale';
import Dashboard from './components/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import EditProduct from './components/EditProduct';
import AddProduct from './components/AddProduct';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/edit-product/:id" element={<EditProduct />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/sales" element={<SaleList />} />
        <Route path="/add-sale" element={<AddSale />} />
        {/* <Route path="/edit-sale/:id" element={<EditSale />} /> */}
      </Routes>
    </Router>
  );
}

export default App;