import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
  const location = useLocation();

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-logo">Cost Optimizer Admin</div>
        <div className="navbar-links">
          <Link
            to="/customers"
            className={location.pathname === '/customers' ? 'active' : ''}
          >
            Customer List
          </Link>
          <Link
            to="/customers/new"
            className={location.pathname === '/customers/new' ? 'active' : ''}
          >
            Subscribe New
          </Link>
        </div>
      </nav>
      <div style={{ padding: '2rem' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
