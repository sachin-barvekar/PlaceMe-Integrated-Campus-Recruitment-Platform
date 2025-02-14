import React from 'react'
import { Link } from 'react-router-dom'
import { Header as HeaderSuite, Nav } from 'rsuite'
import NoticeIcon from '@rsuite/icons/Notice'
import useAuth from 'hooks/Auth'
import { LOGO } from '../../../assets/images'
import './header.scss'

const Header: React.FC = () => {
  const { user } = useAuth()
  const name = user?.displayName
  return (
    <HeaderSuite className="header">
      <img src={LOGO} className="header__logo" alt="placeMe" />
      <Nav className="header__user">
        <Nav.Item as={Link} to="/notification">
          <NoticeIcon />
        </Nav.Item>
        <Nav.Menu title={name}>
          <Nav.Item as={Link} to="/logout">
            <span>Logout</span>
          </Nav.Item>
        </Nav.Menu>
      </Nav>
    </HeaderSuite>
  )
}

export default Header
