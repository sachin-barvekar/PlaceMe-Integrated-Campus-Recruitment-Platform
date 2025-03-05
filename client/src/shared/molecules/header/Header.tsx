import React from 'react'
import { Link } from 'react-router-dom'
import {
  Header as HeaderSuite,
  Nav,
  IconButton,
  Avatar,
  Whisper,
  Popover
} from 'rsuite'
import { CgProfile } from 'react-icons/cg'
import ExitIcon from '@rsuite/icons/Exit'
import MenuIcon from '@rsuite/icons/Menu'
import useAuth from 'hooks/Auth'
import { LOGO } from '../../../assets/images'
import './header.scss'
import NotificationPopover from './notificationPopover/NotificationPopover'

type Props = {
  onMenuClick: () => void,
  isMobile: boolean
}

const Header: React.FC<Props> = ({ onMenuClick, isMobile }) => {
  const { user } = useAuth()
  const name = user?.displayName ?? '-'
  const avatar = user?.photoURL || ''

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
        <NotificationPopover />
        {isMobile ? (
          <Whisper
            trigger="click"
            placement="bottomEnd"
            speaker={
              <Popover full>
                <div className="popover-content">
                  <p className="popover-username">{name}</p>
                  <Nav.Item as={Link} to="/profile">
                    <CgProfile /> &nbsp;Profile
                  </Nav.Item>
                  <Nav.Item as={Link} to="/logout">
                    <ExitIcon /> &nbsp; Logout
                  </Nav.Item>
                </div>
              </Popover>
            }
          >
            <Avatar size="sm" src={avatar} circle />
          </Whisper>
        ) : (
          <Nav.Menu title={name}>
            <Nav.Item as={Link} to="/profile">
              <CgProfile /> &nbsp;Profile
            </Nav.Item>
            <Nav.Item as={Link} to="/logout">
              <ExitIcon /> &nbsp; Logout
            </Nav.Item>
          </Nav.Menu>
        )}
      </Nav>
    </HeaderSuite>
  )
}

export default Header
