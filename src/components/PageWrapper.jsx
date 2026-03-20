import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function PageWrapper({ children }) {
  const location          = useLocation();
  const [show, setShow]   = useState(false);
  const [key,  setKey]    = useState(location.pathname);

  useEffect(() => {
    setShow(false);
    const t = setTimeout(() => { setKey(location.pathname); setShow(true); }, 50);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <div
      key={key}
      className={`transition-all duration-250 ${show ? 'animate-slide-up' : 'opacity-0'}`}
      // Respecter prefers-reduced-motion
      style={{ animation: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'none' : undefined }}
    >
      {children}
    </div>
  );
}
