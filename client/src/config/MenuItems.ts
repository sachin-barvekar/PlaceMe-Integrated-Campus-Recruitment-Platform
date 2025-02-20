import { HTMLAttributes } from 'react'
import { AiOutlineHome } from 'react-icons/ai'
import {
  MdBusiness,
  MdAssignmentTurnedIn,
  MdStars,
  MdFeedback
} from 'react-icons/md'
import { FaUserGraduate, FaRegHandshake } from 'react-icons/fa'
import UserInfoIcon from '@rsuite/icons/UserInfo'
import useAuth from '../hooks/Auth'

type SubMenuItemType = {
  id: string,
  name: string,
  link: string,
  icon?: React.FC<HTMLAttributes<SVGElement>>
}

type MenuItemType = {
  id: string,
  name: string,
  link?: string,
  icon: React.FC<HTMLAttributes<SVGElement>>,
  roles: string[],
  subMenu?: SubMenuItemType[]
}

const menuItems: MenuItemType[] = [
  {
    id: '1',
    name: 'Dashboard',
    link: '/dashboard',
    icon: AiOutlineHome,
    roles: ['admin']
  },
  {
    id: '2',
    name: 'Students',
    link: '/student',
    icon: UserInfoIcon,
    roles: ['admin']
  },
  {
    id: '3',
    name: 'Recruiters',
    link: '/recruiter',
    icon: MdBusiness,
    roles: ['admin']
  },
  {
    id: '4',
    name: 'Job Openings',
    link: '/openings',
    icon: FaRegHandshake,
    roles: ['admin']
  },
  {
    id: '5',
    name: 'Placed Students',
    link: '/placed-students',
    icon: FaUserGraduate,
    roles: ['admin', 'student']
  },
  {
    id: '6',
    name: 'Applied Jobs',
    link: '/applied',
    icon: MdAssignmentTurnedIn,
    roles: ['ROLE_ADMIN']
  },
  {
    id: '7',
    name: 'Placement Pro',
    link: '/placementpro',
    icon: MdStars,
    roles: ['ROLE_ADMIN']
  },
  {
    id: '8',
    name: 'Jobs',
    link: '/jobs',
    icon: MdFeedback,
    roles: ['ROLE_ADMIN']
  },
  {
    id: '9',
    name: 'Applications',
    link: '/application',
    icon: MdFeedback,
    roles: ['ROLE_ADMIN']
  },
  {
    id: '10',
    name: 'Profile',
    link: '/',
    icon: MdFeedback,
    roles: ['student']
  }
]

export const getMenuItemsForRole = (role: string): MenuItemType[] => {
  return menuItems.filter((item) => item.roles.includes(role))
}

export const useFilteredMenuItems = (): MenuItemType[] => {
  const { role } = useAuth()
  return getMenuItemsForRole(role ?? '')
}

export default menuItems
