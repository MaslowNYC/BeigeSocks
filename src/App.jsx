import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from '@/components/ScrollToTop';
import MainLayout from '@/layouts/MainLayout';
import HomePage from '@/pages/HomePage';
import PackPage from '@/pages/PackPage';
import PackTripPage from '@/pages/PackTripPage';
import WorkbenchPage from '@/pages/WorkbenchPage';
import WorkbenchSpacePage from '@/pages/WorkbenchSpacePage';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route index element={<HomePage />} />
        <Route element={<MainLayout />}>
          <Route path='pack' element={<PackPage />} />
          <Route path='pack/:token' element={<PackTripPage />} />
          <Route path='workbench' element={<WorkbenchPage />} />
          <Route path='workbench/:token' element={<WorkbenchSpacePage />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
