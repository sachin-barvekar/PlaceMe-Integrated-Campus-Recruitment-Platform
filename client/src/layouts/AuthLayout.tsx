// src/layouts/AuthLayout.jsx

import React, { useState, useEffect } from 'react';
import { Container, Content } from 'rsuite';
import { Outlet } from 'react-router-dom';
import { Header, Footer, SideNav } from '../shared';
import Navbar from '../pages/unauthorized/component/navbar/Navbar';

const AuthLayout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Container className="layout">
      <Header onMenuClick={() => setDrawerOpen(true)} isMobile={isMobile} />
      <Container>
        <SideNav
          isMobile={isMobile}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
        <Content className="content">
          {/* ✅ Navbar shown below Header (optional position) */}
         <Navbar />

          <Outlet />
        </Content>
      </Container>
      <Footer />
    </Container>
  );
};

export default AuthLayout;
