import { FC } from 'react'
import { useTableHandlers } from '../../../hooks/useTableHandlers'
import { IFilter, IListApiRequest, Operator } from '../../../api/types'
import { ACTIVE_TAB } from '../utils'
import '../../../scss/common/list/List.scss'
import { useFetchJobOpeningQuery } from '../jobApiSlice'
import { Job } from '../types'
import { Table, Toolbar } from '../../../shared'
import { useNavigate } from 'react-router'

const { Column, HeaderCell, Cell, StatusCell } = Table

const COLUMNS = [
  { key: 'recruiterName', label: 'Company', flexGrow: 1, minWidth: 120 },
  { key: 'role', label: 'Job Role', flexGrow: 1, minWidth: 120 },
  { key: 'jobType', label: 'Job Type', flexGrow: 1, minWidth: 110 },
  { key: 'package', label: 'Package', flexGrow: 1, minWidth: 120 },
  { key: 'location', label: 'Location', flexGrow: 1, minWidth: 120 },
  { key: 'driveDate', label: 'Drive Date', flexGrow: 1, minWidth: 110 },
  { key: 'lastDateToApply', label: 'Deadline', flexGrow: 1, minWidth: 110 },
  { key: 'createdAt', label: 'Post Date', flexGrow: 1, minWidth: 110 },
]

const JobOpeningList: FC = () => {
  const {
    requestBody,
    onPageChange,
    onSearchChange,
    onFilterChange,
    onSortColumn,
  } = useTableHandlers<Job, IListApiRequest<Job>>(
    {
      page: { size: 10, number: 0 },
      filters: [],
    },
    'search',
  )
  const { data, isFetching } = useFetchJobOpeningQuery(requestBody)
  const total = data?.totalElements ?? data?.content?.length ?? 0

  const Navigate = useNavigate()

  const options = [
    {
      label: 'All Jobs',
      value: ACTIVE_TAB.ALL,
      onClick: () => handleTabChange(ACTIVE_TAB.ALL),
    },
    {
      label: 'Active',
      value: ACTIVE_TAB.Active,
      onClick: () => handleTabChange(ACTIVE_TAB.Active),
    },
    {
      label: 'Expired',
      value: ACTIVE_TAB.InActive,
      onClick: () => handleTabChange(ACTIVE_TAB.InActive),
    },
  ]
  const handleTabChange = (tab: ACTIVE_TAB) => {
    let fieldValue
    switch (tab) {
      case ACTIVE_TAB.ALL:
        fieldValue = 'all'
        break
      case ACTIVE_TAB.Active:
        fieldValue = 'true'
        break
      case ACTIVE_TAB.InActive:
        fieldValue = 'false'
        break
      default:
        fieldValue = ''
    }

    const activeFilter: IFilter<Job> = {
      fieldName: 'active',
      operator: Operator.EQ,
      fieldValue: fieldValue ?? 'true',
    }

    const updatedFilters = [
      activeFilter,
      ...(requestBody.filters ?? []).filter(f => f.fieldName !== 'active'),
    ]
    onFilterChange(updatedFilters)
  }
  const handleOnRowClick = (rowData: Job) => {
    const jobId = rowData._id
    if (jobId) {
      Navigate(`/job/${jobId}`)
    }
  }

  return (
    <div className='list'>
      <Toolbar
        options={options}
        onSearchChange={onSearchChange}
        searchPlaceholder='Search by company name, job role, type or location'
        total={total ?? 0}
      />
      <div className='list__main-container'>
        <Table
          data={data?.content ?? []}
          loading={isFetching}
          onSortColumn={onSortColumn}
          paginated
          pageSizeOptions={[10, 20, 30]}
          total={total}
          defaultPageSize={data?.size ?? 10}
          onPageChange={onPageChange}
          onRowClick={handleOnRowClick}>
          {COLUMNS.map((column, index) => {
            const { key, label, flexGrow, minWidth } = column

            return (
              <Column
                flexGrow={flexGrow ?? 1}
                minWidth={minWidth ?? 100}
                key={key}
                align={index === 0 ? 'left' : 'center'}
                sortable
                fixed={index === 0}>
                <HeaderCell>{label}</HeaderCell>

                <Cell dataKey={key} tooltip />
              </Column>
            )
          })}
          <Column flexGrow={1} minWidth={100} key='active'>
            <HeaderCell>Status</HeaderCell>
            <StatusCell
              dataKey='active'
              posDataLabel='Active'
              negDataLabel='Inactive'
            />
          </Column>
        </Table>
      </div>
    </div>
  )
}

export default JobOpeningList
