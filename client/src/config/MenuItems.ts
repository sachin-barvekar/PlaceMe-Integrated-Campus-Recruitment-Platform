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

type MenuItemType = {
  id: string,
  name: string,
  link?: string,
  icon: React.FC<HTMLAttributes<SVGElement>>,
  roles: string[]
}

const menuItems: MenuItemType[] = [
  {
    id: '1',
    name: 'Dashboard',
    link: '/',
    icon: AiOutlineHome,
    roles: ['ROLE_ADMIN']
  },
  {
    id: '2',
    name: 'Students',
    link: '/student',
    icon: UserInfoIcon,
    roles: ['ROLE_ADMIN']
  },
  {
    id: '3',
    name: 'Recruiters',
    link: '/recruiter',
    icon: MdBusiness,
    roles: ['ROLE_ADMIN']
  },
  {
    id: '4',
    name: 'Job Openings',
    link: '/openings',
    icon: FaRegHandshake,
    roles: ['ROLE_ADMIN']
  },
  {
    id: '5',
    name: 'Placed Students',
    link: '/placed-students',
    icon: FaUserGraduate,
    roles: ['ROLE_ADMIN']
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
    name: 'Feedback',
    link: '/feedback',
    icon: MdFeedback,
    roles: ['ROLE_ADMIN']
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
