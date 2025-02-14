import { FC, useCallback, useState } from 'react'
import { Table, Toolbar } from '../../../shared'
import '../../../scss/common/list/List.scss'

const { Column, HeaderCell, ActionCell, Cell, ProfileIconCell } = Table

const COLUMNS = [
  { key: 'companyName', label: 'Company Name' },
  { key: 'designation', label: 'Designation' },
  { key: 'openings', label: 'Number of Openings' },
  { key: 'package', label: 'Package (LPA)' },
  { key: 'jobType', label: 'Job Type' },
  { key: 'location', label: 'Location' },
  { key: 'deadline', label: 'Application Deadline' }
]

const mockJobOpeningData = [
  {
    companyName: 'Tech Innovators Ltd.',
    designation: 'Software Engineer',
    openings: 5,
    package: '10 LPA',
    jobType: 'Full-time',
    location: 'San Francisco, CA',
    deadline: '2024-12-31'
  },
  {
    companyName: 'Global Solutions Inc.',
    designation: 'Data Analyst',
    openings: 3,
    package: '8 LPA',
    jobType: 'Full-time',
    location: 'New York, NY',
    deadline: '2024-11-15'
  },
  {
    companyName: 'Skyline Enterprises',
    designation: 'Frontend Developer',
    openings: 2,
    package: '12 LPA',
    jobType: 'Full-time',
    location: 'Remote',
    deadline: '2024-10-30'
  },
  {
    companyName: 'Quantum Technologies',
    designation: 'Machine Learning Engineer',
    openings: 4,
    package: '15 LPA',
    jobType: 'Full-time',
    location: 'Austin, TX',
    deadline: '2024-12-15'
  },
  {
    companyName: 'Infinity Softwares',
    designation: 'DevOps Engineer',
    openings: 6,
    package: '13 LPA',
    jobType: 'Full-time',
    location: 'Los Angeles, CA',
    deadline: '2024-11-30'
  }
]

const JobOpeningList: FC = () => {
  const [data] = useState(mockJobOpeningData)
  const [isFetching] = useState(false)

  const handleSortColumn = useCallback(() => {
    // Implement sorting logic if needed
  }, [])

  const handleRowClick = () => {
    // Handle row click action if needed
  }

  const handleAction = (action: string | undefined, rowData: any) => {
    switch (action) {
      case 'View':
        // Implement view action
        break
    }
  }

  const options = [
    {
      label: 'All Job Openings',
      value: 'all',
      onClick: () => {}
    }
  ]

  return (
    <div className="list">
      <Toolbar
        options={options}
        onSearchChange={() => {}}
        total={data.length ?? 0}
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
                flexGrow={1.3}
                key={key}
                align={index === 0 ? 'left' : 'center'}
                sortable
              >
                <HeaderCell>{label}</HeaderCell>
                <Cell dataKey={key} tooltip />
              </Column>
            )
          })}
          <Column flexGrow={1} key="action" align="center">
            <HeaderCell>Action</HeaderCell>
            <ActionCell
              tooltip
              dataKey="action"
              onAction={handleAction}
              actionOptions={['View']}
            />
          </Column>
        </Table>
      </div>
    </div>
  )
}

export default JobOpeningList
