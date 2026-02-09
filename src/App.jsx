
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from '@/components/ScrollToTop';
import MainLayout from '@/layouts/MainLayout';
import HomePage from '@/pages/HomePage';
import WorkshopPage from '@/pages/WorkshopPage';
import BuildsPage from '@/pages/BuildsPage';
import ToolsPage from '@/pages/ToolsPage';
import WishListPage from '@/pages/WishListPage';
import LabPage from '@/pages/LabPage';
import ZeldaZonePage from '@/pages/ZeldaZonePage';
import MaslowPage from '@/pages/MaslowPage';
import CoffeeCounterPage from '@/pages/CoffeeCounterPage';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path='workshop' element={<WorkshopPage />} />
          <Route path='builds' element={<BuildsPage />} />
          <Route path='tools' element={<ToolsPage />} />
          <Route path='wish-list' element={<WishListPage />} />
          <Route path='lab' element={<LabPage />} />
          <Route path='zelda-zone' element={<ZeldaZonePage />} />
          <Route path='maslow' element={<MaslowPage />} />
          <Route path='coffee-counter' element={<CoffeeCounterPage />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
