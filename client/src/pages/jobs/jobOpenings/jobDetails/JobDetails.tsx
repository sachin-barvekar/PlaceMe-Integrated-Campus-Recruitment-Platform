import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './JobDetails.scss'
import { Button } from 'rsuite'
import { ConfirmModal, Loader } from 'shared'
import { Job } from 'pages/jobs/types'
import { format, isBefore } from 'date-fns'
import {
  useApplyJobMutation,
  useFetchJobDetailsByIdQuery,
  useWithdrawJobApplicationMutation
} from 'pages/jobs/jobApiSlice'
import { notifySuccess } from 'utils'
import { AuthContext } from 'contexts/AuthContext'

const JobDetails = () => {
  const { jobId } = useParams()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const authContext = useContext(AuthContext)
  const dbUser = authContext?.dbUser
  const parsedUser = typeof dbUser === 'string' ? JSON.parse(dbUser) : dbUser
  // eslint-disable-next-line
  const currentUserId = parsedUser?._id

  const [applyJob] = useApplyJobMutation()
  const [withdrawJob] = useWithdrawJobApplicationMutation()
  const { data, isFetching } = useFetchJobDetailsByIdQuery({ jobId })
  const navigate = useNavigate()
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [isApplicationOpen, setIsApplicationOpen] = useState(false)

  useEffect(() => {
    if (selectedJob) {
      setHasApplied(selectedJob.applicants?.includes(currentUserId) ?? false)

      setIsApplicationOpen(
        !!selectedJob.active &&
          isBefore(
            new Date(),
            selectedJob.lastDateToApply
              ? new Date(selectedJob.lastDateToApply)
              : new Date()
          )
      )
    }
  }, [selectedJob, currentUserId, applyJob])

  useEffect(() => {
    if (data?.job) {
      setSelectedJob(data.job)
    }
  }, [data])

  const formatDate = (date?: string | Date) => {
    if (!date) return '-'
    try {
      return format(new Date(date), 'dd-MMM-yyyy')
    } catch {
      return String(date)
    }
  }

  const handleConfirmModal = async () => {
    // eslint-disable-next-line
    const jobId = selectedJob?._id
    if (!jobId) return

    try {
      if (isWithdrawing) {
        await withdrawJob({ jobId }).unwrap()
        notifySuccess('Application withdrawn successfully!')
        setHasApplied(false)
      } else {
        await applyJob({ jobId }).unwrap()
        notifySuccess('Application submitted successfully!')
        setHasApplied(true)
      }
    } catch (error) {
      // eslint-disable-next-line
      console.error(
        `Error ${isWithdrawing ? 'withdrawing' : 'applying'} for job:`,
        error
      )
    }

    setIsModalOpen(false)
    setIsWithdrawing(false)
  }
  let buttonText = ''

  if (hasApplied) {
    buttonText = 'Already Applied'
  } else if (isApplicationOpen) {
    buttonText = 'Apply Now'
  } else {
    buttonText = 'Application Closed'
  }
  if (!selectedJob && !isFetching) {
    return <div className="job-details">No job details available.</div>
  }
  return (
    <div className="job-details">
      <div className="back-btn">
        <Button appearance="primary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
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
              <strong>Eligibility:</strong> {selectedJob.eligibilityCriteria}
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
          <div className="btn-container">
            <div>
              <Button
                appearance="primary"
                onClick={() => setIsModalOpen(true)}
                disabled={!isApplicationOpen || hasApplied}
              >
                {buttonText}
              </Button>
            </div>
            {hasApplied && (
              <div>
                <Button
                  appearance="primary"
                  color="red"
                  onClick={() => {
                    setIsWithdrawing(true)
                    setIsModalOpen(true)
                  }}
                >
                  Withdraw Application
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      <ConfirmModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isWithdrawing ? 'Withdraw Application' : 'Apply for Job'}
        message={
          isWithdrawing
            ? 'Are you sure you want to withdraw your application for this job?'
            : 'Are you sure you want to apply for this job?'
        }
        onConfirm={handleConfirmModal}
        confirmText={isWithdrawing ? 'Yes, Withdraw' : 'Yes, Apply'}
        cancelText="Cancel"
      />
    </div>
  )
}

export default JobDetails
