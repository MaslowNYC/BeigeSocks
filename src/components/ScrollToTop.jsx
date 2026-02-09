
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useLayoutEffect } from 'react';

function ScrollToTop() {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return null;
}

export default ScrollToTop;
