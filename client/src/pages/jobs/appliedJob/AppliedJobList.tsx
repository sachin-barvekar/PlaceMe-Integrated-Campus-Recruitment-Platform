import { FC } from 'react'
import { useTableHandlers } from 'hooks/useTableHandlers'
import { IListApiRequest } from 'api/types'
import { ACTIVE_TAB } from 'pages/jobs/utils'
import '../../../scss/common/list/List.scss'
import { StatusCell } from 'shared/molecules/table/cells'
import { Job } from 'pages/jobs/types'
import { useGetAppliedJobsQuery } from 'pages/jobs/jobApiSlice'
import { Table, Toolbar } from 'shared'
import { useNavigate } from 'react-router-dom'

const { Column, HeaderCell, Cell } = Table

const COLUMNS = [
  { key: 'recruiterName', label: 'Company', flexGrow: 1, minWidth: 120 },
  { key: 'role', label: 'Job Role', flexGrow: 1, minWidth: 120 },
  { key: 'jobType', label: 'Job Type', flexGrow: 1, minWidth: 110 },
  { key: 'package', label: 'Package', flexGrow: 1, minWidth: 120 },
  { key: 'location', label: 'Location', flexGrow: 1, minWidth: 120 },
  { key: 'driveDate', label: 'Drive Date', flexGrow: 1, minWidth: 110 },
  { key: 'lastDateToApply', label: 'Deadline', flexGrow: 1, minWidth: 110 },
  { key: 'createdAt', label: 'Post Date', flexGrow: 1, minWidth: 110 }
]

const AppliedJobList: FC = () => {
  const Navigate = useNavigate()
  const { requestBody, onPageChange, onSearchChange, onSortColumn } =
    useTableHandlers<Job, IListApiRequest<Job>>(
      {
        page: { size: 10, number: 0 },
        filters: []
      },
      'search'
    )
  const { data, isFetching } = useGetAppliedJobsQuery(requestBody)
  const total = data?.totalElements ?? data?.content?.length ?? 0

  const options = [
    {
      label: 'Applied Jobs',
      value: ACTIVE_TAB.ALL,
      onClick: () => {}
    }
  ]
  const handleOnRowClick = (rowData: Job) => {
    // eslint-disable-next-line
    const jobId = rowData._id
    if (jobId) {
      Navigate(`/job/${jobId}`)
    }
  }

  return (
    <div className="list">
      <Toolbar
        options={options}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search by company name, job role, type or location"
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
          onRowClick={handleOnRowClick}
        >
          {COLUMNS.map((column, index) => {
            const { key, label, flexGrow, minWidth } = column

            return (
              <Column
                flexGrow={flexGrow ?? 1}
                minWidth={minWidth ?? 100}
                key={key}
                align={index === 0 ? 'left' : 'center'}
                sortable
                fixed={index === 0}
              >
                <HeaderCell>{label}</HeaderCell>

                <Cell dataKey={key} tooltip />
              </Column>
            )
          })}
          <Column flexGrow={1} minWidth={100} key="active">
            <HeaderCell>Status</HeaderCell>
            <StatusCell
              dataKey="active"
              posDataLabel="Active"
              negDataLabel="Inactive"
            />
          </Column>
        </Table>
      </div>
    </div>
  )
}

export default AppliedJobList
