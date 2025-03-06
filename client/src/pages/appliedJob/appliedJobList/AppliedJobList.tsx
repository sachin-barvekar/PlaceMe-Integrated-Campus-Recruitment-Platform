import { FC, useState } from 'react'
import { useTableHandlers } from 'hooks/useTableHandlers'
import { IListApiRequest } from 'api/types'
import { ACTIVE_TAB } from 'pages/jobs/utils'
import '../../../scss/common/list/List.scss'
import { StatusCell } from 'shared/molecules/table/cells'
import { Job } from 'pages/jobs/types'
import {
  useGetAppliedJobsQuery,
  useWithdrawJobApplicationMutation
} from 'pages/appliedJob/applyJobApiSlice'
import { notifySuccess } from 'utils'
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

const AppliedJobList: FC = () => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
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

  const [withdrawJob] = useWithdrawJobApplicationMutation()

  const handleConfirmWithdraw = async () => {
    //  eslint-disable-next-line
    const jobId = selectedJob?._id
    if (!jobId) return

    try {
      await withdrawJob({ jobId }).unwrap()
      notifySuccess('Application withdrawn successfully!')
    } catch (error) {
      //  eslint-disable-next-line
      console.error(error)
    }

    setIsModalOpen(false)
    setSelectedJob(null)
  }

  const handleAction = (action: string | undefined, rowData: Job) => {
    switch (action) {
      case '3':
        setIsModalOpen(true)
        setSelectedJob(rowData)
        break
      default:
        break
    }
  }

  const options = [
    {
      label: 'Applied Jobs',
      value: ACTIVE_TAB.ALL,
      onClick: () => {}
    }
  ]

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
      <ConfirmModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Withdraw Application"
        message="Are you sure you want to withdraw your application?"
        onConfirm={handleConfirmWithdraw}
        confirmText="Yes, Withdraw"
        cancelText="Cancel"
      />
    </div>
  )
}

export default AppliedJobList
