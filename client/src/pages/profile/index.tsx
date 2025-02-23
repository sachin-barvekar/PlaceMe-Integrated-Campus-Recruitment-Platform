import { useContext } from 'react'
import { AuthContext } from 'contexts/AuthContext'
import StudentProfilePage from './studentProfile/StudentProfile/StudentProfile'
import AdminProfilePage from './adminProfile/AdminProfile/AdminProfile'

const profileComponents: Record<string, React.FC> = {
  admin: AdminProfilePage,
  student: StudentProfilePage
}

const ProfilePage = () => {
  const authContext = useContext(AuthContext)
  const role = authContext?.role ?? ''
  const ProfileComponent = profileComponents[role]

  return <ProfileComponent />
}

export default ProfilePage
