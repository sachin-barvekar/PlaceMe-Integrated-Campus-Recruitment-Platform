import React, { HTMLAttributes } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Nav } from 'rsuite'

type Props = {
  id: string,
  link?: string,
  name: string,
  icon: React.FunctionComponent<HTMLAttributes<SVGElement>>
}
const NavItem = ({ id, link, name, icon: Icon }: Props) => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <Nav.Item
      eventKey={id}
      active={location.pathname === link}
      onClick={() => link && navigate(link)}
      icon={<Icon className="rs-sidenav-item-icon rs-icon" />}
    >
      <span className="sidenav-item__text">{name}</span>
    </Nav.Item>
  )
}
export default NavItem
