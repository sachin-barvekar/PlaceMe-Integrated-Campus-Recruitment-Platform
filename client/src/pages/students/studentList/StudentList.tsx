import { FC, useCallback, useState } from 'react'
import { Table, Toolbar } from '../../../shared'
import '../../../scss/common/list/List.scss'
import AddStudent from './addStudent/AddStudent'

const { Column, HeaderCell, ActionCell, StatusCell, ProfileIconCell, Cell } =
  Table

const COLUMNS = [
  { key: 'fullName', label: 'Full Name' },
  { key: 'email', label: 'Email' },
  { key: 'mobile', label: 'Mobile Number' },
  { key: 'gender', label: 'Gender' },
  { key: 'dob', label: 'Date of Birth' },
  { key: 'branch', label: 'Branch' },
  { key: 'address', label: 'Address' }
]

const mockStudentData = [
  {
    fullName: 'Rajesh Kumar',
    address: '123 Main St, Mumbai',
    gender: 'Male',
    dob: '1998-05-12',
    mobile: '+91 9876543210',
    branch: 'Computer Science',
    email: 'rajesh.kumar@example.com'
  },
  {
    fullName: 'Anita Sharma',
    address: '45 Sector Road, Delhi',
    gender: 'Female',
    dob: '1997-11-21',
    mobile: '+91 9123456789',
    branch: 'Information Technology',
    email: 'anita.sharma@example.com'
  },
  {
    fullName: 'Vikram Singh',
    address: '99 Green Park, Pune',
    gender: 'Male',
    dob: '1996-07-07',
    mobile: '+91 9988776655',
    branch: 'Mechanical Engineering',
    email: 'vikram.singh@example.com'
  },
  {
    fullName: 'Neha Patel',
    address: '202 Civil St, Ahmedabad',
    gender: 'Female',
    dob: '1998-02-18',
    mobile: '+91 9090909090',
    branch: 'Civil Engineering',
    email: 'neha.patel@example.com'
  },
  {
    fullName: 'Amitabh Desai',
    address: '350 Park Lane, Bangalore',
    gender: 'Male',
    dob: '1997-09-09',
    mobile: '+91 9876541234',
    branch: 'Electrical Engineering',
    email: 'amitabh.desai@example.com'
  },
  {
    fullName: 'Sachin Barvekar',
    address: '101 Tech Valley, Pune',
    gender: 'Male',
    dob: '1998-01-15',
    mobile: '+91 9123456780',
    branch: 'Computer Engineering',
    email: 'sachin.barvekar@example.com'
  },
  {
    fullName: 'Priya Mehta',
    address: '27 Lakeview Road, Kolkata',
    gender: 'Female',
    dob: '1999-03-27',
    mobile: '+91 9876545678',
    branch: 'Biomedical Engineering',
    email: 'priya.mehta@example.com'
  },
  {
    fullName: 'Rahul Gupta',
    address: '18 Chemical St, Jaipur',
    gender: 'Male',
    dob: '1997-08-04',
    mobile: '+91 9812345678',
    branch: 'Chemical Engineering',
    email: 'rahul.gupta@example.com'
  },
  {
    fullName: 'Sanjay Kapoor',
    address: '102 Space Park, Hyderabad',
    gender: 'Male',
    dob: '1996-12-25',
    mobile: '+91 9876543211',
    branch: 'Aerospace Engineering',
    email: 'sanjay.kapoor@example.com'
  },
  {
    fullName: 'Sakshi Deshmukh',
    address: '65 Broadway, Pune',
    gender: 'Female',
    dob: '1998-06-13',
    mobile: '+91 9123456781',
    branch: 'Computer Science',
    email: 'sakshi.deshmukh@example.com'
  }
]

const StudentList: FC = () => {
  // Using state for mock data
  const [data] = useState(mockStudentData)
  const [isFetching] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const handleSortColumn = useCallback(() => {
    // Implement sorting logic here if needed
  }, [])

  const handleRowClick = () => {
    // Handle row click action if needed
  }
  const handleAction = (
    action: string | undefined,
    rowData: AnimationPlayState
  ) => {
    switch (action) {
      case '5':
        break
      case '6':
        break
      case '8':
        break
      default:
        break
    }
  }

  const options = [
    {
      label: 'All Students',
      value: 'all',
      onClick: () => {}
    },
    {
      label: 'Verified Students',
      value: '',
      onClick: () => {}
    }
  ]

  return (
    <div className="list">
      <Toolbar
        options={options}
        onSearchChange={() => {}}
        total={data.length ?? 0}
        buttonName="Add Student"
        onButtonClick={() => setIsModalOpen(true)}
      />
      <div className="list__main-container">
        <Table
          data={data ?? []}
          loading={isFetching}
          onSortColumn={handleSortColumn}
          paginated
          pageSizeOptions={[10, 20, 30]}
          onRowClick={handleRowClick}
          total={data.length}
          defaultPageSize={10}
          onPageChange={() => {}}
        >
          <Column flexGrow={0.5}>
            <HeaderCell>Profile</HeaderCell>
            <ProfileIconCell imgKey="photoUrl" />
          </Column>
          {COLUMNS.map((column, index) => {
            const { key, label } = column

            return (
              <Column
                flexGrow={1.2}
                key={key}
                align={index === 0 ? 'left' : 'center'}
                sortable
              >
                <HeaderCell>{label}</HeaderCell>

                <Cell dataKey={key} tooltip />
              </Column>
            )
          })}
          <Column flexGrow={1} key="Status" sortable>
            <HeaderCell>Status</HeaderCell>
            <StatusCell
              negDataLabel="Inactive"
              posDataLabel="Active"
              dataKey="active"
            />
          </Column>
          <Column flexGrow={1} key="action">
            <HeaderCell>Action</HeaderCell>
            <ActionCell
              tooltip
              dataKey="action"
              onAction={handleAction}
              actionOptions={['View', 'Edit', 'Delete']}
            />
          </Column>
        </Table>
      </div>
      <AddStudent isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default StudentList
