import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

//prevents scroll position saving
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
