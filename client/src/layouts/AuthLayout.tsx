import React from 'react'
import { Container, Content } from 'rsuite'
import { Outlet } from 'react-router'
import { Header, Footer, SideNav } from '../shared'

const AuthLayout: React.FC = () => {
  return (
    <Container className="layout">
      <Header />
      <Container>
        <SideNav />
        <Content className="content">
          <Outlet />
        </Content>
      </Container>
      <Footer />
    </Container>
  )
}

export default AuthLayout
