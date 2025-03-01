import React from 'react'
import { Link } from 'react-router-dom'
import { Header as HeaderSuite, Nav, IconButton } from 'rsuite'
import NoticeIcon from '@rsuite/icons/Notice'
import useAuth from 'hooks/Auth'
import MenuIcon from '@rsuite/icons/Menu'
import { LOGO } from '../../../assets/images'
import './header.scss'

type Props = {
  onMenuClick: () => void,
  isMobile: boolean
}

const Header: React.FC<Props> = ({ onMenuClick, isMobile }) => {
  const { user } = useAuth()
  const name = user?.displayName
  return (
    <HeaderSuite className="header">
      {isMobile ? (
        <IconButton
          icon={<MenuIcon />}
          onClick={onMenuClick}
          className="menu-button"
        />
      ) : (
        <img src={LOGO} className="header__logo" alt="placeMe" />
      )}
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
