import { FC } from 'react'
import { useTableHandlers } from 'hooks/useTableHandlers'
import { IListApiRequest } from 'api/types'
import { Table, Toolbar } from '../../../shared'
import '../../../scss/common/list/List.scss'
import { Students } from '../types'
import { useFetchStudentsListQuery } from '../studentListApiSlice'

const { Column, HeaderCell, ProfileIconCell, Cell } = Table

const COLUMNS = [
  { key: 'name', label: 'Full Name', flexGrow: 1, minWidth: 130 },
  { key: 'email', label: 'Email', flexGrow: 1.3, minWidth: 120 },
  { key: 'mobile', label: 'Mobile No.', flexGrow: 1, minWidth: 120 },
  { key: 'gender', label: 'Gender', flexGrow: 0.7, minWidth: 100 },
  { key: 'dateOfBirth', label: 'Date of Birth', flexGrow: 0.9, minWidth: 140 },
  { key: 'branch', label: 'Branch', flexGrow: 1, minWidth: 120 },
  { key: 'address', label: 'Address', flexGrow: 1.8, minWidth: 150 }
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
          <Column flexGrow={0.5} fixed>
            <HeaderCell>Profile</HeaderCell>
            <ProfileIconCell imgKey="profilePhoto" />
          </Column>
          {COLUMNS.map((column, index) => {
            const { key, label, flexGrow, minWidth } = column

            return (
              <Column
                minWidth={minWidth ?? 100}
                flexGrow={flexGrow ?? 1}
                key={key}
                align={index === 0 ? 'left' : 'center'}
                sortable
              >
                <HeaderCell>{label}</HeaderCell>

                <Cell dataKey={key} tooltip />
              </Column>
            )
          })}
        </Table>
      </div>
    </div>
  )
}

export default StudentList
