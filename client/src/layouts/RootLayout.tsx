import React from 'react'
import { Outlet } from 'react-router'
import { Container, Content } from 'rsuite'

const RootLayout: React.FC = () => {
  return (
    <Container>
      <Content className='root-outlet'>
        <Outlet />
      </Content>
    </Container>
  )
}

export default RootLayout
