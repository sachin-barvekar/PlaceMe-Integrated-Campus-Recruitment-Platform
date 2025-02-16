import { createBrowserRouter } from 'react-router-dom'
import AuthGuard from 'guards/AuthGuard'
import RouteGuard from 'guards/RouteGuard'
import Dashboard from 'pages/dashboard/Dashboard'
import StudentList from 'pages/students/studentList/StudentList'
import RecruitersList from 'pages/recruiters/recruitersList/RecruitersList'
import JobOpeningList from 'pages/jobOpenings/jobOpeningsList/JobOpeningsList'
import PlaceStudentList from 'pages/placeStudents/placeStudentsList/PlaceStudentsList'
import StudentProfile from 'pages/profile/studentProfile/StudentProfile'
import LogoutPage from '../pages/login/Logout'
import LoginPage from '../pages/login/Login'
import AuthLayout from '../layouts/AuthLayout'
import RootLayout from '../layouts/RootLayout'

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
              element: <Dashboard />
            },
            {
              path: '/student',
              element: (
                <RouteGuard requiredRoles={['admin']}>
                  <StudentList />
                </RouteGuard>
              )
            },
            {
              path: '/recruiter',
              element: (
                <RouteGuard requiredRoles={['admin']}>
                  <RecruitersList />
                </RouteGuard>
              )
            },
            {
              path: '/openings',
              element: (
                <RouteGuard requiredRoles={['admin']}>
                  <JobOpeningList />
                </RouteGuard>
              )
            },
            {
              path: '/placed-students',
              element: (
                <RouteGuard requiredRoles={['admin']}>
                  <PlaceStudentList />
                </RouteGuard>
              )
            },
            {
              path: '/profile',
              element: (
                <RouteGuard requiredRoles={['admin', 'student']}>
                  <StudentProfile />
                </RouteGuard>
              )
            }
          ]
        }
      ]
    }
  ])

export default appRouter
