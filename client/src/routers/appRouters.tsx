import { createBrowserRouter } from 'react-router-dom'
import AuthGuard from '../guards/AuthGuard'
import RouteGuard from '../guards/RouteGuard'
import HomePage from '../pages/home'
import StudentList from '../pages/students/studentList/StudentList'
import ProfilePage from '../pages/profile'
import RecruitersList from '../pages/recruiters/recruitersList/RecruitersList'
import JobOpeningList from '../pages/jobs/jobOpenings/JobOpeningsList'
import AppliedJobList from '../pages/jobs/appliedJob/AppliedJobList'
import PlaceStudentList from '../pages/placeStudents/placeStudentsList/PlaceStudentsList'
import JobList from '../pages/jobs/jobList/JobList'
import JobDetails from '../pages/jobs/jobDetails/JobDetails'
import ViewStudent from '../pages/profile/studentProfile/viewStudent/ViewStudent'
import LogoutPage from '../pages/login/Logout'
import LoginPage from '../pages/login/Login'
import AuthLayout from '../layouts/AuthLayout'
import RootLayout from '../layouts/RootLayout'
import Unauth from '../pages/unauthorized'

const appRouter = () =>
  createBrowserRouter([
    {
      element: <RootLayout />,
      children: [
        {
          path: '/auth',
          element: <LoginPage />,
        },
        {
          path: '/logout',
          element: <LogoutPage />,
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
                <RouteGuard requiredRoles={['admin', 'student', 'recruiter']}>
                  <HomePage />
                </RouteGuard>
              ),
            },
            {
              path: '/student',
              element: (
                <RouteGuard requiredRoles={['admin']}>
                  <StudentList />
                </RouteGuard>
              ),
            },
            {
              path: '/recruiter',
              element: (
                <RouteGuard requiredRoles={['admin', 'student']}>
                  <RecruitersList />
                </RouteGuard>
              ),
            },
            {
              path: '/job-openings',
              element: (
                <RouteGuard requiredRoles={['admin', 'student']}>
                  <JobOpeningList />
                </RouteGuard>
              ),
            },
            {
              path: '/jobs',
              element: (
                <RouteGuard requiredRoles={['recruiter']}>
                  <JobList />
                </RouteGuard>
              ),
            },
            {
              path: '/job/:jobId',
              element: (
                <RouteGuard requiredRoles={['admin', 'student', 'recruiter']}>
                  <JobDetails />
                </RouteGuard>
              ),
            },
            {
              path: '/job/student/:userId',
              element: (
                <RouteGuard requiredRoles={['admin', 'recruiter']}>
                  <ViewStudent />
                </RouteGuard>
              ),
            },
            {
              path: '/applied-jobs',
              element: (
                <RouteGuard requiredRoles={['student']}>
                  <AppliedJobList />
                </RouteGuard>
              ),
            },
            {
              path: '/placed-students',
              element: (
                <RouteGuard requiredRoles={['admin', 'student']}>
                  <PlaceStudentList />
                </RouteGuard>
              ),
            },
            {
              path: '/profile',
              element: (
                <RouteGuard requiredRoles={['admin', 'student', 'recruiter']}>
                  <ProfilePage />
                </RouteGuard>
              ),
            },
            {
              path: '*',
              element: (
                <RouteGuard requiredRoles={['admin', 'student', 'recruiter']}>
                  <HomePage />
                </RouteGuard>
              ),
            },
          ],
        },
        {
          path: '/home',
          element: <Unauth />,
        },
      ],
    },
  ])

export default appRouter
