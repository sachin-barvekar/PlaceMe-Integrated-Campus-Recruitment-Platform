import { useTableHandlers } from 'hooks/useTableHandlers'
import { IListApiRequest } from 'api/types'
import { Table, Toolbar } from '../../../shared'
import '../../../scss/common/list/List.scss'
import { useFetchRecruiterListQuery } from '../recruiterListApiSlice'
import { Recruiter } from '../types'

const { Column, ProfileIconCell, ActionCell, HeaderCell, Cell } = Table

const COLUMNS = [
  { key: 'companyName', label: 'Recruiter Name', flexGrow: 1, minWidth: 120 },
  { key: 'aboutUs', label: 'About Us', flexGrow: 1.5, minWidth: 120 },
  { key: 'companyWebsite', label: 'Website', flexGrow: 1, minWidth: 130 },
  { key: 'linkedIn', label: 'LinkedIn', flexGrow: 1.5, minWidth: 130 },
  { key: 'address', label: 'Address', flexGrow: 1, minWidth: 150 }
]

const RecruitersList = () => {
  const { requestBody, onPageChange, onSearchChange, onSortColumn } =
    useTableHandlers<Recruiter, IListApiRequest<Recruiter>>(
      {
        page: { size: 10, number: 0 },
        filters: []
      },
      'search'
    )

  const { data, isFetching } = useFetchRecruiterListQuery(requestBody)
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
      label: 'All Recruiters',
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
        searchPlaceholder="Search by recruiter name or address"
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
          <Column fixed flexGrow={0.5}>
            <HeaderCell>Profile</HeaderCell>
            <ProfileIconCell imgKey="profilePhoto" />
          </Column>
          {COLUMNS.map((column, index) => {
            const { key, label, flexGrow, minWidth } = column

            return (
              <Column
                flexGrow={flexGrow ?? 1}
                minWidth={minWidth ?? 100}
                key={key}
                align={index === 0 ? 'left' : 'center'}
                sortable
              >
                <HeaderCell>{label}</HeaderCell>

                <Cell dataKey={key} tooltip />
              </Column>
            )
          })}
          <Column flexGrow={1} minWidth={80} key="action">
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

export default RecruitersList
