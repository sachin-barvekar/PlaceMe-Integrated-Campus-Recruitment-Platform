import { HTMLAttributes } from 'react'
import { AiOutlineHome } from 'react-icons/ai'
import {
  MdBusiness,
  MdAssignmentTurnedIn,
  MdWork,
  MdSettings,
  MdDescription
} from 'react-icons/md'
import { CgProfile } from 'react-icons/cg'
import { FaClipboardList, FaUserGraduate, FaWhatsapp } from 'react-icons/fa'
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
    link: '/',
    icon: AiOutlineHome,
    roles: ['admin', 'student']
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
    roles: ['admin', 'student']
  },
  {
    id: '4',
    name: 'Job Openings',
    link: '/openings',
    icon: MdWork,
    roles: ['admin', 'student']
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
    roles: ['student']
  },
  {
    id: '7',
    name: 'My Jobs',
    link: '/jobs',
    icon: MdWork,
    roles: ['recruiter']
  },
  {
    id: '8',
    name: 'Applications',
    link: '/application',
    icon: FaClipboardList,
    roles: ['recruiter']
  },
  {
    id: '9',
    name: 'Job Offers',
    link: '/job-offers',
    icon: FaUserGraduate,
    roles: ['recruiter']
  },
  {
    id: '10',
    name: 'Profile',
    link: '/profile',
    icon: CgProfile,
    roles: ['student', 'admin', 'recruiter']
  },
  {
    id: '11',
    name: 'Configuration',
    link: '/settings',
    icon: MdSettings,
    roles: ['admin'],
    subMenu: [
      {
        id: '11-1',
        name: 'WhatsApp',
        link: '/settings/WhatsApp',
        icon: FaWhatsapp
      },
      {
        id: '11-2',
        name: 'Template',
        link: '/settings/template',
        icon: MdDescription
      }
    ]
  }

  // {
  //   id: '10',
  //   name: 'Placement Pro',
  //   link: '/placementpro',
  //   icon: MdStars,
  //   roles: ['ROLE_ADMIN']
  // }
]

export const getMenuItemsForRole = (role: string): MenuItemType[] => {
  return menuItems.filter((item) => item.roles.includes(role))
}

export const useFilteredMenuItems = (): MenuItemType[] => {
  const { role } = useAuth()
  return getMenuItemsForRole(role ?? '')
}

export default menuItems
