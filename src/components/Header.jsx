import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ translations }) => {
  return (
    <header className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[conic-gradient(from_140deg,#62d4ff,#f9c74f,#62d4ff)] shadow-glow">
          <div className="h-6 w-6 rounded-lg bg-slate-950" />
        </div>
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.45em] text-slate-400">{translations.heroTag}</p>
          <h1 className="text-2xl font-display text-white md:text-3xl">BRP PRIDE</h1>
        </div>
      </div>
      <nav className="flex items-center gap-6 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
        <Link className="transition hover:text-white" to="/">
          {translations.navHome}
        </Link>
        <Link className="transition hover:text-white" to="/tft">
          {translations.navTft}
        </Link>
        <Link className="transition hover:text-white" to="/prize">
          {translations.navPrize}
        </Link>
      </nav>
    </header>
  );
};

export default Header;
