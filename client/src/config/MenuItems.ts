import { AiOutlineHome } from 'react-icons/ai'
import {
  MdBusiness,
  MdAssignmentTurnedIn,
  MdStars,
  MdFeedback
} from 'react-icons/md'
import { FaUserGraduate, FaRegHandshake } from 'react-icons/fa'
import UserInfoIcon from '@rsuite/icons/UserInfo'

const allMenuItems = [
  {
    id: '1',
    name: 'Dashboard',
    link: '/',
    icon: AiOutlineHome
  },
  {
    id: '2',
    name: 'Students',
    link: '/student',
    icon: UserInfoIcon
  },
  {
    id: '3',
    name: 'Recruiters',
    link: '/recruiter',
    icon: MdBusiness
  },
  {
    id: '4',
    name: 'Job Openings',
    link: '/openings',
    icon: FaRegHandshake
  },
  {
    id: '5',
    name: 'Placed Students',
    link: '/placed-students',
    icon: FaUserGraduate
  },
  {
    id: '6',
    name: 'Applied Jobs',
    link: '/applied',
    icon: MdAssignmentTurnedIn
  },
  {
    id: '7',
    name: 'Placement Pro',
    link: '/placementpro',
    icon: MdStars
  },
  {
    id: '8',
    name: 'Jobs',
    link: '/jobs',
    icon: MdFeedback
  },
  {
    id: '9',
    name: 'Applications',
    link: '/application',
    icon: MdFeedback
  },
  {
    id: '10',
    name: 'Feedback',
    link: '/feedback',
    icon: MdFeedback
  }
]

export default allMenuItems
