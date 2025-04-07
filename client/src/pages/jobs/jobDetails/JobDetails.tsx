import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './JobDetails.scss'
import { Button } from 'rsuite'
import { ConfirmModal, Loader, Toolbar } from '../../../shared'
import { Job } from '../types'
import { format, isBefore } from 'date-fns'
import {
  useApplyJobMutation,
  useDeleteJobMutation,
  useFetchJobDetailsByIdQuery,
  useWithdrawJobApplicationMutation,
} from '../jobApiSlice'
import { notifyError, notifySuccess } from '../../../utils'
import { AuthContext } from '../../../contexts/AuthContext'
import { DETAILSPAGEACTIVE_TAB } from '../utils'

const JobDetails = () => {
  const { jobId } = useParams()
  const { dbUser, role } = useContext(AuthContext) || {}
  const parsedUser =
    dbUser && typeof dbUser === 'string' ? JSON.parse(dbUser) : dbUser
  const currentUserId = parsedUser?._id

  const [applyJob] = useApplyJobMutation()
  const [deleteJob] = useDeleteJobMutation()
  const [withdrawJob] = useWithdrawJobApplicationMutation()
  const { data, isFetching } = useFetchJobDetailsByIdQuery({ jobId })
  const navigate = useNavigate()
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [hasApplied, setHasApplied] = useState<boolean>(false)
  const [isApplicationOpen, setIsApplicationOpen] = useState<boolean>(false)
  const [activeTab, handleTabChange] = useState<string>(
    DETAILSPAGEACTIVE_TAB.DETAILS,
  )

  useEffect(() => {
    if (data?.job) {
      setSelectedJob(data.job)
    }
  }, [data])

  useEffect(() => {
    if (selectedJob) {
      setHasApplied(selectedJob.applicants?.includes(currentUserId) ?? false)
      setIsApplicationOpen(
        !!selectedJob.active &&
          isBefore(new Date(), new Date(selectedJob.lastDateToApply || '')),
      )
    }
  }, [selectedJob, currentUserId, setIsApplicationOpen])

  const formatDate = (date?: string | Date) => {
    if (!date) return '-'
    try {
      return format(new Date(date), 'dd-MMM-yyyy')
    } catch {
      return String(date)
    }
  }

  const [modalState, setModalState] = useState({
    open: false,
    title: '',
    message: '',
    confirmText: '',
    action: null as (() => Promise<void>) | null,
  })

  const openConfirmModal = (
    title: string,
    message: string,
    confirmText: string,
    action: (() => Promise<void>) | null,
  ) => {
    setModalState({ open: true, title, message, confirmText, action })
  }

  const handleConfirm = async () => {
    if (modalState.action) await modalState.action()
    setModalState(prev => ({ ...prev, open: false }))
  }

  const handleDeleteJob = async () => {
    if (!selectedJob?._id) {
      notifyError('Job does not have an ID.')
      return
    }
    try {
      await deleteJob({ jobId: selectedJob._id }).unwrap()
      notifySuccess('Job deleted successfully.')
      navigate(-1)
    } catch {
      notifyError('Error while deleting job.')
    }
  }

  const handleApplyOrWithdraw = async () => {
    if (!selectedJob?._id) return
    try {
      if (hasApplied) {
        await withdrawJob({ jobId: selectedJob._id }).unwrap()
        notifySuccess('Application withdrawn successfully!')
        setHasApplied(false)
      } else {
        await applyJob({ jobId: selectedJob._id }).unwrap()
        notifySuccess('Application submitted successfully!')
        setHasApplied(true)
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      notifyError(`Error ${hasApplied ? 'withdrawing' : 'applying'} for job.`)
    }
  }
  let buttonText = ''

  if (hasApplied) {
    buttonText = 'Withdraw Application'
  } else if (isApplicationOpen) {
    buttonText = 'Apply Now'
  } else {
    buttonText = 'Application Closed'
  }

  if (!selectedJob && !isFetching) {
    return <div className='job-details'>No job details available.</div>
  }

  const allOptions = [
    {
      label: 'Job Details',
      value: DETAILSPAGEACTIVE_TAB.DETAILS,
      onClick: () => handleTabChange(DETAILSPAGEACTIVE_TAB.DETAILS),
    },
    {
      label: 'Job Applicants',
      value: DETAILSPAGEACTIVE_TAB.APPLICANTS,
      onClick: () => handleTabChange(DETAILSPAGEACTIVE_TAB.APPLICANTS),
    },
  ]

  const isStudent = role === 'student'
  const options = isStudent
    ? allOptions.filter(
        option => option.value === DETAILSPAGEACTIVE_TAB.DETAILS,
      )
    : allOptions

  return (
    <div className='job-details'>
      <div className='back-btn'>
        <Toolbar
          options={options}
          onSearchChange={() => {}}
          backbuttonName='Back'
          onBackButtonClick={() => navigate(-1)}
        />
      </div>
      {activeTab === DETAILSPAGEACTIVE_TAB.DETAILS && (
        <div className='job-details'>
          {isFetching && <Loader />}
          {selectedJob && (
            <div>
              <h2>{selectedJob.role}</h2>
              <p>
                <strong>Company:</strong> {selectedJob.recruiterId?.companyName}
              </p>
              <p>
                <strong>Location:</strong> {selectedJob.location}
              </p>
              <p>
                <strong>Job Type:</strong> {selectedJob.jobType}
              </p>
              <p>
                <strong>Package:</strong> {selectedJob.package}
              </p>
              <p>
                <strong>Job Description:</strong>
              </p>
              <pre>{selectedJob.jobDescription}</pre>
              <p>
                <strong>Skills Required:</strong>
              </p>
              <pre>{selectedJob.skillsRequired}</pre>
              {selectedJob.eligibilityCriteria && (
                <p>
                  <strong>Eligibility:</strong>{' '}
                  {selectedJob.eligibilityCriteria}
                </p>
              )}
              <p>
                <strong>Drive Date:</strong> {formatDate(selectedJob.driveDate)}
              </p>
              <p>
                <strong>Last Date to Apply:</strong>{' '}
                {formatDate(selectedJob.lastDateToApply)}
              </p>
              <p className={selectedJob.active ? 'active' : 'inactive'}>
                <strong>Status:</strong>{' '}
                {selectedJob.active ? 'Active' : 'Inactive'}
              </p>
              <div className='btn-container'>
                {role === 'student' && (
                  <div>
                    <Button
                      appearance='primary'
                      color={hasApplied ? 'red' : undefined}
                      onClick={() =>
                        openConfirmModal(
                          hasApplied ? 'Withdraw Application' : 'Apply for Job',
                          hasApplied
                            ? 'Are you sure you want to withdraw your application?'
                            : 'Are you sure you want to apply?',
                          hasApplied ? 'Yes, Withdraw' : 'Yes, Apply',
                          handleApplyOrWithdraw,
                        )
                      }
                      disabled={!isApplicationOpen && !hasApplied}>
                      {buttonText}
                    </Button>
                  </div>
                )}
                {role === 'recruiter' && (
                  <Button
                    appearance='primary'
                    color='red'
                    onClick={() =>
                      openConfirmModal(
                        'Delete Job',
                        'Are you sure you want to delete this job? This action cannot be undone.',
                        'Yes, Delete',
                        handleDeleteJob,
                      )
                    }>
                    Delete
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      <ConfirmModal
        open={modalState.open}
        onClose={() => setModalState({ ...modalState, open: false })}
        title={modalState.title}
        message={modalState.message}
        onConfirm={handleConfirm}
        confirmText={modalState.confirmText}
        cancelText='Cancel'
      />
    </div>
  )
}

export default JobDetails
