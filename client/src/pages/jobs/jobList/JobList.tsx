import { FC, useState } from 'react'
import { useTableHandlers } from 'hooks/useTableHandlers'
import { IFilter, IListApiRequest, Operator } from 'api/types'
import { StatusCell } from 'shared/molecules/table/cells'
import { notifyError, notifySuccess } from 'utils'
import { Table, Toolbar } from '../../../shared'
import '../../../scss/common/list/List.scss'
import { Job } from '../types'
import CreateEditJob from './createEditJob/CreateEditJob'
import { useDeleteJobMutation, useFetchJobByIdQuery } from '../jobApiSlice'
import { ACTIVE_TAB } from '../utils'

const { Column, HeaderCell, ActionCell, Cell } = Table

const COLUMNS = [
  { key: 'role', label: 'Job Role', flexGrow: 1, minWidth: 150 },
  { key: 'jobType', label: 'Job Type', flexGrow: 1, minWidth: 130 },
  { key: 'package', label: 'Package', flexGrow: 1, minWidth: 120 },
  { key: 'location', label: 'Location', flexGrow: 1, minWidth: 150 },
  { key: 'driveDate', label: 'Drive Date', flexGrow: 1, minWidth: 140 },
  { key: 'lastDateToApply', label: 'Deadline', flexGrow: 1, minWidth: 140 },
  { key: 'createdAt', label: 'Post Date', flexGrow: 1, minWidth: 130 }
]

const JobList: FC = () => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [selectedJobData, setSelectedJobData] = useState<Job>()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const {
    requestBody,
    onPageChange,
    onSearchChange,
    onFilterChange,
    onSortColumn
  } = useTableHandlers<Job, IListApiRequest<Job>>(
    {
      page: { size: 10, number: 0 },
      filters: []
    },
    'search'
  )
  const [deleteJob] = useDeleteJobMutation()
  const { data, isFetching } = useFetchJobByIdQuery(requestBody)

  const total = data?.totalElements ?? data?.content?.length ?? 0

  const handleAction = (action: string | undefined, rowData: Job) => {
    switch (action) {
      case '2':
        setIsEditMode(true)
        setSelectedJobData(rowData)
        setIsModalOpen(true)
        break
      case '3':
        // eslint-disable-next-line
        const deleteJobHandler = async () => {
          try {
            // eslint-disable-next-line
            const jobId = rowData?._id
            // eslint-disable-next-line
            if (!jobId) {
              notifyError('Job does not have an ID.')
              return
            }
            await deleteJob({ jobId }).unwrap()
            notifySuccess(`Job deleted successfully.`)
          } catch (error) {
            notifyError('Error while deleting job.')
          }
        }
        deleteJobHandler()
        break
      default:
        break
    }
  }

  const options = [
    {
      label: 'All Jobs',
      value: ACTIVE_TAB.ALL,
      onClick: () => handleTabChange(ACTIVE_TAB.ALL)
    },
    {
      label: 'Active',
      value: ACTIVE_TAB.Active,
      onClick: () => handleTabChange(ACTIVE_TAB.Active)
    },
    {
      label: 'Expired',
      value: ACTIVE_TAB.InActive,
      onClick: () => handleTabChange(ACTIVE_TAB.InActive)
    }
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
      fieldValue: fieldValue ?? 'true'
    }

    const updatedFilters = [
      activeFilter,
      ...(requestBody.filters ?? []).filter((f) => f.fieldName !== 'active')
    ]
    onFilterChange(updatedFilters)
  }

  return (
    <div className="list">
      <Toolbar
        options={options}
        onSearchChange={onSearchChange}
        total={total ?? 0}
        buttonName="Add Job"
        searchPlaceholder="Search by Recruiter Name or Address"
        onButtonClick={() => setIsModalOpen(true)}
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
          {COLUMNS.map((column, index) => {
            const { key, label, flexGrow, minWidth } = column

            return (
              <Column
                flexGrow={flexGrow ?? 1}
                minWidth={minWidth ?? 100}
                key={key}
                align={index === 0 ? 'left' : 'center'}
                fixed={index === 0}
                sortable
              >
                <HeaderCell>{label}</HeaderCell>

                <Cell dataKey={key} tooltip>
                  {' '}
                </Cell>
              </Column>
            )
          })}
          <Column flexGrow={1} key="active" minWidth={100}>
            <HeaderCell>Status</HeaderCell>
            <StatusCell
              dataKey="active"
              posDataLabel="Active"
              negDataLabel="Inactive"
            />
          </Column>
          <Column flexGrow={1} minWidth={80} key="action">
            <HeaderCell>Action</HeaderCell>
            <ActionCell
              tooltip
              dataKey="action"
              onAction={handleAction}
              actionOptions={['Edit', 'Delete']}
            />
          </Column>
        </Table>
      </div>
      <CreateEditJob
        isEditMode={isEditMode}
        jobData={selectedJobData}
        isOpen={isModalOpen}
        onClose={() => {
          setIsEditMode(false)
          setSelectedJobData(undefined)
          setIsModalOpen(false)
        }}
      />
    </div>
  )
}

export default JobList
