import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from '@/components/ScrollToTop';
import MainLayout from '@/layouts/MainLayout';
import HomePage from '@/pages/HomePage';
import WorkshopPage from '@/pages/WorkshopPage';
import WishListPage from '@/pages/WishListPage';
import MaslowPage from '@/pages/MaslowPage';
import PackPage from '@/pages/PackPage';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path='workshop' element={<WorkshopPage />} />
          <Route path='wish-list' element={<WishListPage />} />
          <Route path='maslow' element={<MaslowPage />} />
          <Route path='pack' element={<PackPage />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
