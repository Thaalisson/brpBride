import React from 'react';
import { FaInstagram } from 'react-icons/fa';

const Footer = ({ translations }) => {
  return (
    <footer className="mt-auto border-t border-white/10 py-8 text-center text-xs text-slate-400">
      <p className="flex items-center justify-center gap-2">
        <span>{translations.footerCredit}</span>
        <a
          href="https://www.instagram.com/devThalisson"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-white transition hover:text-[var(--accent)]"
        >
          @devThalisson
          <FaInstagram />
        </a>
      </p>
      <p className="mt-2 text-[0.7rem] uppercase tracking-[0.3em] text-slate-500">
        {translations.footerRights}
      </p>
    </footer>
  );
};

export default Footer;
