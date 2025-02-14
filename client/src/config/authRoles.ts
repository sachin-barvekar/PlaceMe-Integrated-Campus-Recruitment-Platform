type RoleType = 'admin' | 'student' | 'recruiter' | null

const ROLE_PERMISSIONS = {
  admin: {
    menuItems: [
      'Dashboard',
      'Students',
      'Recruiters',
      'Job Openings',
      'Placed Students',
      'Feedback'
    ]
  },
  student: {
    menuItems: [
      'Dashboard',
      'Job Openings',
      'Placement Pro',
      'Applied Jobs',
      'Feedback'
    ]
  },
  recruiter: {
    menuItems: [
      'Dashboard',
      'Jobs',
      'Job Applications',
      'FaEnvelopeOpenText',
      'Feedback'
    ]
  }
}

const getRolePermissions = (role: RoleType) => {
  return ROLE_PERMISSIONS[role || 'admin']
}

export default getRolePermissions
