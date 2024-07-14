// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
         <h1 className="header-title">BRP PRIDE</h1>
      </div>
      <nav className="header-nav">
        <Link to="/">Home</Link>
        <Link to="/prize">Premiação</Link>
      </nav>
    </header>
  );
};

export default Header;
