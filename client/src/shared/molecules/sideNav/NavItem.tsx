import React, { HTMLAttributes } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Nav, Dropdown } from 'rsuite'

type SubMenuItem = {
  id: string
  link: string
  name: string
  icon?: React.FunctionComponent<HTMLAttributes<SVGElement>>
}
type Props = {
  id: string
  link?: string
  name: string
  icon: React.FunctionComponent<HTMLAttributes<SVGElement>>
  subMenu?: SubMenuItem[]
}
const NavItem = ({ id, link, name, icon: Icon, subMenu }: Props) => {
  const location = useLocation()
  const navigate = useNavigate()
  const isActive = (linkToCheck?: string) => location.pathname === linkToCheck
  return (
    <>
      {subMenu && subMenu.length > 0 ? (
        <Dropdown
          title={
            <>
              <Icon className='rs-sidenav-item-icon rs-icon' />
              <span className='sidenav-item__text'>{name}</span>
            </>
          }
          placement='rightStart'
          activeKey={id}>
          {subMenu.map(item => (
            <Dropdown.Item
              key={item.id}
              active={isActive(item.link)}
              onClick={() => navigate(item.link)}
              icon={
                item.icon ? (
                  <item.icon className='rs-dropdown-item-icon' />
                ) : undefined
              }>
              &nbsp;&nbsp;&nbsp;{item.name}
            </Dropdown.Item>
          ))}
        </Dropdown>
      ) : (
        <Nav.Item
          eventKey={id}
          active={isActive(link)}
          onClick={() => link && navigate(link)}
          icon={<Icon className='rs-sidenav-item-icon rs-icon' />}>
          <span className='sidenav-item__text'>{name}</span>
        </Nav.Item>
      )}
    </>
  )
}
export default NavItem
