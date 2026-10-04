import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#FFFBF3] shadow-sm border-b border-[#E2D7C3]">
      <div className="sweatband h-3" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <nav className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-[#2A2420] text-xl font-extrabold tracking-tight hover:opacity-80 transition-opacity"
          >
            <img src="/sock.svg" alt="" className="h-7 w-7" />
            BeigeSocks
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
