import { FC, useState } from 'react'
import { useTableHandlers } from 'hooks/useTableHandlers'
import { IFilter, IListApiRequest, Operator } from 'api/types'
import { ACTIVE_TAB } from 'pages/jobs/utils'
import '../../../scss/common/list/List.scss'
import { StatusCell } from 'shared/molecules/table/cells'
import { useFetchJobOpeningQuery } from 'pages/jobs/jobApiSlice'
import { Job } from 'pages/jobs/types'
import { notifySuccess } from 'utils'
import { useApplyJobMutation } from 'pages/appliedJob/applyJobApiSlice'
import { ConfirmModal, Table, Toolbar } from '../../../shared'

const { Column, HeaderCell, ActionCell, Cell } = Table

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

const JobOpeningList: FC = () => {
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
  const { data, isFetching } = useFetchJobOpeningQuery(requestBody)
  const total = data?.totalElements ?? data?.content?.length ?? 0
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  const [applyJob] = useApplyJobMutation()

  const handleAction = async (action: string | undefined, rowData: Job) => {
    switch (action) {
      case '1':
        setIsModalOpen(true)
        setSelectedJob(rowData)
        break
      default:
        break
    }
  }
  const handleConfirmApply = async () => {
    // eslint-disable-next-line
    const jobId = selectedJob?._id
    if (!jobId) return

    try {
      await applyJob({ jobId }).unwrap()
      notifySuccess('Application submitted successfully!')
    } catch (error) {
      // eslint-disable-next-line
      console.error('Error applying for job:', error)
    }

    setIsModalOpen(false)
    setSelectedJob(null)
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
          <Column flexGrow={1} minWidth={80} key="action" align="center">
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
      <ConfirmModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Apply for Job"
        message="Are you sure you want to apply for this job?"
        onConfirm={handleConfirmApply}
        confirmText="Yes, Apply"
        cancelText="Cancel"
      />
    </div>
  )
}

export default JobOpeningList
