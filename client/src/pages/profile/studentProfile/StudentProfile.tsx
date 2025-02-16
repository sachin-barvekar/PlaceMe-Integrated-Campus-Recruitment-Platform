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
    <div>
      {data?.profileCompletion ? (
        <p>Profile is complete</p>
      ) : (
        <p>Profile is incomplete. Please update it.</p>
      )}

      {data?.student && (
        <div>
          <p>Gender: {data.student.gender}</p>
          <p>Branch: {data.student.branch}</p>
          {/* Add other fields as needed */}
        </div>
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
