import React from 'react'
import { Outlet } from 'react-router'
import { Container, Content } from 'rsuite'
import Navbar from '../pages/unauthorized/navbar/Navbar'
import Footer from '../pages/unauthorized/footer/Footer'

const RootLayout: React.FC = () => {
  return (
    <Container>
      <Content className='root-outlet'>
        <Navbar />
        <Outlet />
        <Footer />
      </Content>
    </Container>
  )
}

export default RootLayout
