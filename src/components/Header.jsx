
import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-[#D4D8D0]">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <Link
            to="/"
            className="text-[#2C3E2E] text-xl font-bold hover:opacity-80 transition-opacity"
          >
            BeigeSocks
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
