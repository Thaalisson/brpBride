// src/components/Footer.js

import React from 'react';
import { FaInstagram } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>Desenvolvido por <a href="https://www.instagram.com/devThalisson" target="_blank" rel="noopener noreferrer">@devThalisson <FaInstagram /></a></p>
      <p>&copy; 2024 Todos os direitos reservados.</p>
    </footer>
  );
};

export default Footer;
