import React, { ReactElement, useContext } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import RootLayout from '../layouts/RootLayout'
import { AuthContext } from '../contexts/AuthContext'
import AuthLayout from '../layouts/AuthLayout'
import { Loader } from '../shared'

const LoginPage = React.lazy(() => import('../pages/login/Login'))
const LogoutPage = React.lazy(() => import('../pages/login/Logout'))
const DashboardPage = React.lazy(() => import('../pages/dashboard/Dashboard'))
const StudentListPage = React.lazy(
  () => import('../pages/students/studentList/StudentList')
)
const RecruiterListPage = React.lazy(
  () => import('../pages/recruiters/recruitersList/RecruitersList')
)
const JobOpeningListPage = React.lazy(
  () => import('../pages/jobOpenings/jobOpeningsList/JobOpeningsList')
)
const PlacedStudentsListPage = React.lazy(
  () => import('../pages/placeStudents/placeStudentsList/PlaceStudentsList')
)

type AuthGuardProps = {
  children: ReactElement,
  allowedRoles?: string[]
}

function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const authContext = useContext(AuthContext)

  if (authContext?.loading) {
    return <Loader />
  }

  if (!authContext?.user) {
    return <Navigate to="/auth" />
  }

  if (
    authContext.role !== null &&
    allowedRoles?.length &&
    !allowedRoles.includes(authContext.role)
  ) {
    return <Navigate to="/unauthorized" />
  }

  return children
}

const appRouter = () =>
  createBrowserRouter([
    {
      element: <RootLayout />,
      children: [
        {
          path: '/auth',
          element: <LoginPage />
        },
        {
          path: '/logout',
          element: <LogoutPage />
        },
        {
          element: (
            <AuthGuard>
              <AuthLayout />
            </AuthGuard>
          ),
          children: [
            {
              path: '/',
              element: (
                <AuthGuard allowedRoles={['admin', 'student', 'recruiter']}>
                  <DashboardPage />
                </AuthGuard>
              )
            },
            {
              path: '/student',
              element: (
                <AuthGuard allowedRoles={['admin']}>
                  <StudentListPage />
                </AuthGuard>
              )
            },
            {
              path: '/recruiter',
              element: (
                <AuthGuard allowedRoles={['admin']}>
                  <RecruiterListPage />
                </AuthGuard>
              )
            },
            {
              path: '/openings',
              element: (
                <AuthGuard allowedRoles={['admin']}>
                  <JobOpeningListPage />
                </AuthGuard>
              )
            },
            {
              path: '/placed-students',
              element: (
                <AuthGuard allowedRoles={['admin']}>
                  <PlacedStudentsListPage />
                </AuthGuard>
              )
            }
          ]
        }
      ]
    }
  ])

export default appRouter
