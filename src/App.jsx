import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from '@/components/ScrollToTop';
import MainLayout from '@/layouts/MainLayout';
import HomePage from '@/pages/HomePage';
import TripsPage from '@/pages/TripsPage';
import TripsSpacePage from '@/pages/TripsSpacePage';
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
          <Route path='trips' element={<TripsPage />} />
          <Route path='trips/:token' element={<TripsSpacePage />} />
          <Route path='workbench' element={<WorkbenchPage />} />
          <Route path='workbench/:token' element={<WorkbenchSpacePage />} />
        </Route>
        <Route path='pack/*' element={<Navigate to='/trips' replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
