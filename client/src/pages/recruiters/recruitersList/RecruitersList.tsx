import { FC, useCallback, useState } from 'react'
import { Table, Toolbar } from '../../../shared'
import '../../../scss/common/list/List.scss'
import AddRecruiter from '../addRecruiter/AddRecruiter'

const { Column, ProfileIconCell, ActionCell, HeaderCell, StatusCell, Cell } =
  Table

const COLUMNS = [
  { key: 'companyName', label: 'Recruiter Name' },
  { key: 'address', label: 'Address' },
  { key: 'website', label: 'Website' },
  { key: 'phone', label: 'Phone' },
  { key: 'email', label: 'Email' }
]

const mockRecruiterData = [
  {
    companyName: 'Tech Innovators Ltd.',
    address: '123 Silicon Valley, CA',
    website: 'www.techinnovators.com',
    phone: '+1 555-123-4567',
    email: 'contact@techinnovators.com'
  },
  {
    companyName: 'Global Solutions Inc.',
    address: '456 Innovation Park, NY',
    website: 'www.globalsolutions.com',
    phone: '+1 555-987-6543',
    email: 'info@globalsolutions.com'
  },
  {
    companyName: 'Skyline Enterprises',
    address: '789 Highrise Blvd, TX',
    website: 'www.skyline.com',
    phone: '+1 555-654-3210',
    email: 'services@skyline.com'
  },
  {
    companyName: 'Quantum Technologies',
    address: '101 Quantum St, FL',
    website: 'www.quantumtech.com',
    phone: '+1 555-876-5432',
    email: 'support@quantumtech.com'
  },
  {
    companyName: 'Infinity Softwares',
    address: '202 Infinity Road, CA',
    website: 'www.infinitysoftwares.com',
    phone: '+1 555-432-1098',
    email: 'sales@infinitysoftwares.com'
  }
]

const RecruitersList: FC = () => {
  const [data] = useState(mockRecruiterData)
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
      label: 'All Recruiters',
      value: 'all',
      onClick: () => {}
    },
    {
      label: 'Visited Recruiters',
      value: 'visited',
      onClick: () => {}
    }
  ]

  return (
    <div className="list">
      <Toolbar
        options={options}
        onSearchChange={() => {}}
        total={data.length ?? 0}
        buttonName="Add Recruiter"
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
      <AddRecruiter
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default RecruitersList
