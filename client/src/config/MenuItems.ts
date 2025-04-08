import { HTMLAttributes } from 'react'
import { AiOutlineHome } from 'react-icons/ai'
import { MdBusiness, MdAssignmentTurnedIn, MdWork } from 'react-icons/md'
import { FaUserGraduate } from 'react-icons/fa'
import UserInfoIcon from '@rsuite/icons/UserInfo'
import useAuth from '../hooks/Auth'

type SubMenuItemType = {
  id: string
  name: string
  link: string
  icon?: React.FC<HTMLAttributes<SVGElement>>
}

type MenuItemType = {
  id: string
  name: string
  link?: string
  icon: React.FC<HTMLAttributes<SVGElement>>
  roles: string[]
  subMenu?: SubMenuItemType[]
}

const menuItems: MenuItemType[] = [
  {
    id: '1',
    name: 'Dashboard',
    link: '/',
    icon: AiOutlineHome,
    roles: ['admin', 'student', 'recruiter'],
  },
  {
    id: '2',
    name: 'Students',
    link: '/student',
    icon: UserInfoIcon,
    roles: ['admin'],
  },
  {
    id: '3',
    name: 'Recruiters',
    link: '/recruiter',
    icon: MdBusiness,
    roles: ['admin', 'student'],
  },
  {
    id: '4',
    name: 'Job Openings',
    link: '/job-openings',
    icon: MdWork,
    roles: ['admin', 'student'],
  },
  {
    id: '5',
    name: 'Applied Jobs',
    link: '/applied-jobs',
    icon: MdAssignmentTurnedIn,
    roles: ['student'],
  },
  {
    id: '6',
    name: 'Placed Students',
    link: '/placed-students',
    icon: FaUserGraduate,
    roles: ['admin', 'student'],
  },
  {
    id: '7',
    name: 'My Jobs',
    link: '/jobs',
    icon: MdWork,
    roles: ['recruiter'],
  },
  {
    id: '8',
    name: 'Job Offers',
    link: '/job-offers',
    icon: FaUserGraduate,
    roles: ['recruiter'],
  },
]

export const getMenuItemsForRole = (role: string): MenuItemType[] => {
  return menuItems.filter(item => item.roles.includes(role))
}

export const useFilteredMenuItems = (): MenuItemType[] => {
  const { role } = useAuth()
  return getMenuItemsForRole(role ?? '')
}

export default menuItems
