import useAuth from '../../hooks/Auth'
import AdminHome from './adminHomePage/AdminHomePage'
import RecruiterHome from './recruiterHomePage/RecruiterHome'
import StudentHome from './studentHomePage/StudentHomePage'

const RoleBasedHomePages: Record<string, React.FC> = {
  admin: AdminHome,
  student: StudentHome,
  recruiter: RecruiterHome,
}

export const HomePage = () => {
  const { role } = useAuth()
  if (!role) {
    return <div>Unauthorized</div>
  }

  const RoleBasedHomePage = RoleBasedHomePages[role]

  return RoleBasedHomePage ? <RoleBasedHomePage /> : <div>Unauthorized</div>
}

export default HomePage
