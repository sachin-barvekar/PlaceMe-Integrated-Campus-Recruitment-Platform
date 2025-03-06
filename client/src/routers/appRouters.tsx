import { createBrowserRouter, Navigate } from 'react-router-dom'
import AuthGuard from 'guards/AuthGuard'
import RouteGuard from 'guards/RouteGuard'
import Dashboard from 'pages/dashboard/Dashboard'
import StudentList from 'pages/students/studentList/StudentList'
import ProfilePage from 'pages/profile'
import RecruitersList from 'pages/recruiters/recruitersList/RecruitersList'
import JobOpeningList from 'pages/jobOpenings/jobOpeningsList/JobOpeningsList'
import AppliedJobList from 'pages/appliedJob/appliedJobList/AppliedJobList'
import WhatsAppConfig from 'pages/whatsApp/whatsAppConfig/WhatsAppConfig'
import PlaceStudentList from 'pages/placeStudents/placeStudentsList/PlaceStudentsList'
import JobList from 'pages/jobs/jobList/JobList'
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
                <RouteGuard requiredRoles={['admin', 'student']}>
                  <RecruitersList />
                </RouteGuard>
              )
            },
            {
              path: '/job-openings',
              element: (
                <RouteGuard requiredRoles={['admin', 'student']}>
                  <JobOpeningList />
                </RouteGuard>
              )
            },
            {
              path: '/applied-jobs',
              element: (
                <RouteGuard requiredRoles={['student']}>
                  <AppliedJobList />
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
            },
            {
              path: '/jobs',
              element: (
                <RouteGuard requiredRoles={['recruiter']}>
                  <JobList />
                </RouteGuard>
              )
            }
          ]
        }
      ]
    }
  ])

export default appRouter
