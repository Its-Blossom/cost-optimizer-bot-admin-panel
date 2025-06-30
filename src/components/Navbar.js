// src/components/Navbar.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await Auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">🧠 Cost Optimizer Admin</div>
      <ul className="nav-links">
        <li>
          <NavLink
            to="/customers"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Customer List
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/customers/new"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Subscribe New
          </NavLink>
        </li>
        <li>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
