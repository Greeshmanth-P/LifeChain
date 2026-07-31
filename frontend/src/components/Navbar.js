import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ padding: '1rem', background: '#eee' }}>
      <Link to="/" style={{ margin: '0 1rem' }}>Home</Link>
      <Link to="/register" style={{ margin: '0 1rem' }}>Register</Link>
      <Link to="/request-help" style={{ margin: '0 1rem' }}>Help Request</Link>
      <Link to="/notifications" style={{ margin: '0 1rem' }}>Notifications</Link>
    </nav>
  );
};

export default Navbar;
