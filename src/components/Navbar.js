import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/logo-1.jpg';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav style={{ background: '#222', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={logo} alt="Logo" style={{ height: '30px', marginRight: '20px' }} />
        <Link to="/" style={{ color: 'white', marginRight: '15px' }}>Dashboard</Link>
        <Link to="/products" style={{ color: 'white', marginRight: '15px' }}>Products</Link>
        <Link to="/sales" style={{ color: 'white', marginRight: '15px' }}>Sales</Link>
        <Link to="/add-sale" style={{ color: 'white' }}>Add Sale</Link>
      </div>
      <button onClick={handleLogout} style={{ background: '#555', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px' }}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;