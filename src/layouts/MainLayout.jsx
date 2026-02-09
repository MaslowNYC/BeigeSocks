
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function MainLayout() {
  return (
    <div className="surface-base min-h-screen flex flex-col">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;
