import { useContext, useEffect, useState } from 'react'
import { AuthContext } from 'contexts/AuthContext'
import { useGetProfileQuery } from '../profileApiSlice'
import CreateEditStudentProfile from './createEditStudentProfile/CreateEditStudentProfile'

const StudentProfile = () => {
  const authContext = useContext(AuthContext)
  const firebaseUid = authContext?.user?.uid ?? undefined
  const { data, isLoading, error } = useGetProfileQuery(
    { firebaseUid },
    { skip: !firebaseUid }
  )
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  useEffect(() => {
    if (data?.profileCompletion !== undefined) {
      setIsModalOpen(!data.profileCompletion)
    }
  }, [data?.profileCompletion])

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error loading profile</p>

  return (
    <div style={{ backgroundColor: 'white', padding: '1rem' }}>
      {data?.profileCompletion ? (
        <div>
          <p>Profile is Completed</p>
          <p>Thank you for filling out your profile!</p>
          <p>
            We are currently in development mode. Our team, TechThinker, will
            get back to you soon.
          </p>
        </div>
      ) : (
        <p>Profile is incomplete. Please update it.</p>
      )}
      <CreateEditStudentProfile
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
        }}
      />
    </div>
  )
}

export default StudentProfile
