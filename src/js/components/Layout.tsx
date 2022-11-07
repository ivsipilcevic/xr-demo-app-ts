import React, { memo, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Nav from './Nav';
import '../../css/layout.css';

function Layout() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <main
      className='main-wrapper'
      style={{
        height: '100vh',
        margin: '0 auto',
      }}
    >
      <div className='component-wrapper'>
        <Nav />
        <Outlet />
      </div>
    </main>
  );
}

export default memo(Layout);
