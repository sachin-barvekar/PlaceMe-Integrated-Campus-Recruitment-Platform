import { createBrowserRouter, Navigate } from 'react-router-dom'
import AuthGuard from 'guards/AuthGuard'
import RouteGuard from 'guards/RouteGuard'
import Dashboard from 'pages/dashboard/Dashboard'
import StudentList from 'pages/students/studentList/StudentList'
import ProfilePage from 'pages/profile'
import RecruitersList from 'pages/recruiters/recruitersList/RecruitersList'
import JobOpeningList from 'pages/jobOpenings/jobOpeningsList/JobOpeningsList'
import WhatsAppConfig from 'pages/whatsApp/whatsAppConfig/WhatsAppConfig'
import PlaceStudentList from 'pages/placeStudents/placeStudentsList/PlaceStudentsList'
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
          path: '*',
          element: <Navigate to="/auth" replace />
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
                <RouteGuard requiredRoles={['admin']}>
                  <Dashboard />
                </RouteGuard>
              )
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
                <RouteGuard requiredRoles={['admin', 'student']}>
                  <PlaceStudentList />
                </RouteGuard>
              )
            },
            {
              path: '/profile',
              element: (
                <RouteGuard requiredRoles={['admin', 'student', 'recruiter']}>
                  <ProfilePage />
                </RouteGuard>
              )
            },
            {
              path: '/settings/WhatsApp',
              element: (
                <RouteGuard requiredRoles={['admin']}>
                  <WhatsAppConfig />
                </RouteGuard>
              )
            }
            // {
            //   path: '/settings/template',
            //   element: (
            //     <RouteGuard requiredRoles={['admin']}>
            //       <WPTemplateList />
            //     </RouteGuard>
            //   )
            // }
          ]
        }
      ]
    }
  ])

export default appRouter
