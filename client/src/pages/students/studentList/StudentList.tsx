import { FC } from 'react'
import { useTableHandlers } from 'hooks/useTableHandlers'
import { IListApiRequest } from 'api/types'
import { Table, Toolbar } from '../../../shared'
import '../../../scss/common/list/List.scss'
import { Students } from '../types'
import { useFetchStudentsListQuery } from '../studentListApiSlice'

const { Column, HeaderCell, ActionCell, ProfileIconCell, Cell } = Table

const COLUMNS = [
  { key: 'name', label: 'Full Name' },
  { key: 'email', label: 'Email' },
  { key: 'mobile', label: 'Mobile Number' },
  { key: 'gender', label: 'Gender' },
  { key: 'dateOfBirth', label: 'Date of Birth' },
  { key: 'branch', label: 'Branch' },
  { key: 'address', label: 'Address' }
]

const StudentList: FC = () => {
  const { requestBody, onPageChange, onSearchChange, onSortColumn } =
    useTableHandlers<Students, IListApiRequest<Students>>(
      {
        page: { size: 10, number: 0 },
        filters: []
      },
      'search'
    )

  const { data, isFetching } = useFetchStudentsListQuery(requestBody)
  const total = data?.totalElements || data?.content?.length || 0

  const handleAction = (action: string | undefined, rowData: any) => {
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
    }
  ]

  return (
    <div className="list">
      <Toolbar
        options={options}
        onSearchChange={onSearchChange}
        total={total ?? 0}
      />
      <div className="list__main-container">
        <Table
          data={data?.content ?? []}
          loading={isFetching}
          onSortColumn={onSortColumn}
          paginated
          pageSizeOptions={[10, 20, 30]}
          total={total}
          defaultPageSize={data?.size ?? 10}
          onPageChange={onPageChange}
        >
          <Column flexGrow={0.5}>
            <HeaderCell>Profile</HeaderCell>
            <ProfileIconCell imgKey="profilePhoto" />
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

                <Cell dataKey={key} tooltip>
                  {' '}
                </Cell>
              </Column>
            )
          })}
          <Column flexGrow={1} key="action">
            <HeaderCell>Action</HeaderCell>
            <ActionCell
              tooltip
              dataKey="action"
              onAction={handleAction}
              actionOptions={['View', 'Delete']}
            />
          </Column>
        </Table>
      </div>
    </div>
  )
}

export default StudentList
