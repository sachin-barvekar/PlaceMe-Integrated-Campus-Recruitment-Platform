import React, { useEffect, useState } from 'react'
import { IconButton } from 'rsuite'
import {
  FaUser,
  FaBirthdayCake,
  FaCodeBranch,
  FaGithub,
  FaLinkedin,
  FaHome,
  FaEnvelope,
  FaLightbulb
} from 'react-icons/fa'
import { MdCall } from 'react-icons/md'
import { Edit as EditIcon } from '@rsuite/icons'
import '../../Profile.scss'
import { useGetProfileQuery } from 'pages/profile/profileApiSlice'
import { StudentProfileResponse } from 'pages/profile/types'
import { format } from 'date-fns'
import { Loader } from 'shared'
import { Tabs } from 'pages/profile/utils'
import CreateEditStudentProfile from '../createEditStudentProfile/CreateEditStudentProfile'
import PROFILE from '../../../../assets/images/profile.png'

const StudentProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.PERSONAL)
  const { data, isFetching } = useGetProfileQuery()
  const [profileData, setProfileData] = useState<StudentProfileResponse>()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const education = data?.student?.academicDetails
  const [imgSrc, setImgSrc] = useState<string | undefined>(
    data?.student?.profilePhoto
  )
  useEffect(() => {
    if (data?.student?.profilePhoto) {
      setImgSrc(data.student.profilePhoto)
    } else {
      setImgSrc(PROFILE)
    }
  }, [data?.student?.profilePhoto])

  const handleImageError = () => {
    setImgSrc(PROFILE)
  }
  const handleEditClick = (ProfileData: StudentProfileResponse) => {
    setProfileData(ProfileData)
    setIsModalOpen(true)
    setIsEditMode(true)
  }

  useEffect(() => {
    if (data?.profileCompletion !== undefined) {
      setIsModalOpen(!data.profileCompletion)
    }
  }, [data?.profileCompletion])
  return (
    <div className="user-profile">
      {isFetching && <Loader />}
      {!isFetching && (
        <>
          <div className="user-profile-header">
            <div className="user-logo-section">
              <img
                src={imgSrc}
                alt="user Logo"
                onError={handleImageError}
                className="user-logo"
              />
              <IconButton
                icon={<EditIcon className="edit-icon" />}
                appearance="subtle"
                className="edit-button"
                onClick={() => data && handleEditClick(data)}
              />
            </div>
            <div className="user-name">
              <span className="user-name-text">
                {data?.student?.userId?.name ?? '-'}
              </span>
            </div>
          </div>
          <div className="user-profile-body">
            <div className="tab-header">
              <div
                className={`tab-item ${activeTab === Tabs.PERSONAL ? 'active' : ''}`}
                onClick={() => setActiveTab(Tabs.PERSONAL)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setActiveTab(Tabs.PERSONAL)
                  }
                }}
              >
                Personal Details
              </div>
              <div
                className={`tab-item ${activeTab === Tabs.ACADEMIC ? 'active' : ''}`}
                onClick={() => setActiveTab(Tabs.ACADEMIC)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setActiveTab(Tabs.ACADEMIC)
                  }
                }}
              >
                Academic Details
              </div>
              <div
                className={`tab-item ${activeTab === Tabs.WHERE_PLACED ? 'active' : ''}`}
                onClick={() => setActiveTab(Tabs.WHERE_PLACED)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setActiveTab(Tabs.WHERE_PLACED)
                  }
                }}
              >
                Where I placed?
              </div>
            </div>

            <div className="tab-content">
              {activeTab === Tabs.PERSONAL && (
                <div className="personal-details">
                  <div className="details-grid">
                    <div className="detail-item">
                      <div className="details-icons">
                        <FaUser className="icon" />
                      </div>
                      <div className="text">
                        <span className="label">Gender</span>
                        <span className="value">
                          {data?.student?.gender ?? '-'}
                        </span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <div className="details-icons">
                        <FaBirthdayCake className="icon" />
                      </div>
                      <div className="text">
                        <span className="label">Date of Birth</span>
                        <span className="value">
                          {data?.student?.dateOfBirth
                            ? format(
                                new Date(data.student.dateOfBirth),
                                'dd/ MMM/ yyyy'
                              )
                            : '-'}
                        </span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <div className="details-icons">
                        <FaHome className="icon" />
                      </div>
                      <div className="text">
                        <span className="label">Address</span>
                        <span className="value">
                          {data?.student?.address ?? '-'}
                        </span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <div className="details-icons">
                        <MdCall className="icon" />
                      </div>
                      <div className="text">
                        <span className="label">Mobile</span>
                        <span className="value">
                          {data?.student?.mobile ?? '-'}
                        </span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <div className="details-icons">
                        <FaEnvelope className="icon" />
                      </div>
                      <div className="text">
                        <span className="label">Email</span>
                        <span className="value">
                          {data?.student?.userId?.email ?? '-'}
                        </span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <div className="details-icons">
                        <FaLinkedin className="icon" />
                      </div>
                      <div className="text">
                        <span className="label">LinkedIn</span>
                        <a
                          href={data?.student?.linkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="value"
                        >
                          {data?.student?.linkedIn ? 'View Profile' : '-'}
                        </a>
                      </div>
                    </div>

                    <div className="detail-item">
                      <div className="details-icons">
                        <FaCodeBranch className="icon" />
                      </div>
                      <div className="text">
                        <span className="label">Branch</span>
                        <span className="value">
                          {data?.student?.branch ?? '-'}
                        </span>
                      </div>
                    </div>

                    <div className="detail-item">
                      <div className="details-icons">
                        <FaGithub className="icon" />
                      </div>
                      <div className="text">
                        <span className="label">GitHub</span>
                        <a
                          href={data?.student?.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="value"
                        >
                          {data?.student?.github ? 'View Profile' : '-'}
                        </a>
                      </div>
                    </div>

                    <div className="detail-item">
                      <div className="details-icons">
                        <FaLightbulb className="icon" />
                      </div>
                      <div className="text">
                        <span className="label">Skills</span>
                        <span className="value">
                          {data?.student?.skills ?? '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === Tabs.ACADEMIC && (
                <section id="education" className="education-section">
                  <div className="education-timeline">
                    {education &&
                      // eslint-disable-next-line
                      education.map((edu, index) => (
                        // eslint-disable-next-line
                        <div className="education-item" key={index}>
                          <div className="education-content">
                            <h3 className="degree">{edu.level}</h3>
                            <h4 className="institution">
                              {edu.institutionName}
                            </h4>
                            <span className="years">
                              Passing Year: {edu.passingYear}
                            </span>
                            <div className="marks">Marks: {edu.marks}</div>
                          </div>
                          {index < education.length - 1 && (
                            <div className="timeline-line" />
                          )}
                        </div>
                      ))}
                  </div>
                </section>
              )}
              {/* {activeTab === Tabs.WHERE_PLACED && (
                <div className="placement-details-section">
                  <h3 className="section-title">Placement Details</h3>
                  <div className="placement-card">
                    <div className="placement-header">
                      <h4 className="company-name">Google</h4>
                      <span className="location">
                        <i className="icon location-icon"></i> San Francisco, CA
                      </span>
                    </div>
                    <div className="placement-body">
                      <p>
                        <i className="icon role-icon"></i> Role: Software
                        Engineer
                      </p>
                      <p>
                        <i className="icon package-icon"></i> Package: ₹25 LPA
                      </p>
                      <p>
                        <i className="icon duration-icon"></i> Job Type:
                        Full-Time
                      </p>
                      <p>
                        <i className="icon eligibility-icon"></i> Eligibility:
                        7+ CGPA
                      </p>
                    </div>
                    <div className="placement-footer">
                      <a href="#" className="apply-btn">
                        Apply Now
                      </a>
                    </div>
                  </div>
                </div>
              )} */}
            </div>
          </div>
          <CreateEditStudentProfile
            profileData={profileData}
            isOpen={isModalOpen}
            isEditMode={isEditMode}
            onClose={() => {
              setIsModalOpen(false)
              setIsEditMode(false)
              setProfileData(undefined)
            }}
          />
        </>
      )}
    </div>
  )
}

export default StudentProfilePage
