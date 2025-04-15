import React, { useEffect, useState } from 'react'
import { IconButton, Uploader } from 'rsuite'
import {
  FaUser,
  FaBirthdayCake,
  FaCodeBranch,
  FaGithub,
  FaLinkedin,
  FaHome,
  FaEnvelope,
  FaLightbulb,
  FaPencilAlt,
} from 'react-icons/fa'
import { MdCall } from 'react-icons/md'
import { Edit as EditIcon } from '@rsuite/icons'
import '../../Profile.scss'
import {
  useGetProfileQuery,
  useUploadResumeMutation,
} from '../../profileApiSlice'
import { StudentProfileResponse } from '../../types'
import { format } from 'date-fns'
import { Loader } from '../../../../shared'
import { Tabs } from '../../utils'
import CreateEditStudentProfile from '../createEditStudentProfile/CreateEditStudentProfile'
import PROFILE from '../../../../assets/images/profile.png'
import { notifySuccess } from '../../../../utils'

const StudentProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.PERSONAL)
  const { data, isFetching } = useGetProfileQuery()
  const [profileData, setProfileData] = useState<StudentProfileResponse>()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const education = data?.student?.academicDetails
  const [imgSrc, setImgSrc] = useState<string | undefined>(
    data?.student?.profilePhoto,
  )
  const [fileList, setFileList] = useState<File[]>([])
  const [uploadResume] = useUploadResumeMutation()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = async (newFileList: any[]) => {
    const latestFile = newFileList[newFileList.length - 1]?.blobFile
    setFileList(latestFile ? [latestFile] : [])

    try {
      const uploaded = await uploadResume(latestFile).unwrap()
      if (uploaded.resumeUrl) {
        notifySuccess('Resume updated successfully')
      }
    } catch (err) {
      console.error('Upload failed:', err)
    }
  }

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
    <div className='user-profile'>
      {isFetching && <Loader />}
      {!isFetching && (
        <>
          <div className='user-profile-header'>
            <div className='user-profile-info'>
              <div className='user-logo-section'>
                <img
                  src={imgSrc}
                  alt='user Logo'
                  onError={handleImageError}
                  className='user-logo'
                />
                <IconButton
                  icon={<EditIcon className='edit-icon' />}
                  appearance='subtle'
                  className='edit-button'
                  onClick={() => data && handleEditClick(data)}
                />
              </div>
              <div className='user-name'>
                <span className='user-name-text'>
                  {data?.student?.userId?.name ?? '-'}
                </span>
              </div>
            </div>
          </div>
          <div className='user-profile-body'>
            <div className='tab-header'>
              <div
                className={`tab-item ${
                  activeTab === Tabs.PERSONAL ? 'active' : ''
                }`}
                onClick={() => setActiveTab(Tabs.PERSONAL)}
                role='button'
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setActiveTab(Tabs.PERSONAL)
                  }
                }}>
                Personal Details
              </div>
              <div
                className={`tab-item ${
                  activeTab === Tabs.ACADEMIC ? 'active' : ''
                }`}
                onClick={() => setActiveTab(Tabs.ACADEMIC)}
                role='button'
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setActiveTab(Tabs.ACADEMIC)
                  }
                }}>
                Academic Details
              </div>
              <div
                className={`tab-item ${
                  activeTab === Tabs.MY_RESUME ? 'active' : ''
                }`}
                onClick={() => setActiveTab(Tabs.MY_RESUME)}
                role='button'
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setActiveTab(Tabs.MY_RESUME)
                  }
                }}>
                My Resume
              </div>
            </div>

            <div className='tab-content'>
              {activeTab === Tabs.PERSONAL && (
                <div className='personal-details'>
                  <div className='details-grid'>
                    <div className='detail-item'>
                      <div className='details-icons'>
                        <FaUser className='icon' />
                      </div>
                      <div className='text'>
                        <span className='label'>Gender</span>
                        <span className='value'>
                          {data?.student?.gender ?? '-'}
                        </span>
                      </div>
                    </div>
                    <div className='detail-item'>
                      <div className='details-icons'>
                        <FaBirthdayCake className='icon' />
                      </div>
                      <div className='text'>
                        <span className='label'>Date of Birth</span>
                        <span className='value'>
                          {data?.student?.dateOfBirth
                            ? format(
                                new Date(data.student.dateOfBirth),
                                'dd/ MMM/ yyyy',
                              )
                            : '-'}
                        </span>
                      </div>
                    </div>
                    <div className='detail-item'>
                      <div className='details-icons'>
                        <FaHome className='icon' />
                      </div>
                      <div className='text'>
                        <span className='label'>Address</span>
                        <span className='value'>
                          {data?.student?.address ?? '-'}
                        </span>
                      </div>
                    </div>
                    <div className='detail-item'>
                      <div className='details-icons'>
                        <MdCall className='icon' />
                      </div>
                      <div className='text'>
                        <span className='label'>Mobile</span>
                        <span className='value'>
                          {data?.student?.mobile ?? '-'}
                        </span>
                      </div>
                    </div>
                    <div className='detail-item'>
                      <div className='details-icons'>
                        <FaEnvelope className='icon' />
                      </div>
                      <div className='text'>
                        <span className='label'>Email</span>
                        <span className='value'>
                          {data?.student?.userId?.email ?? '-'}
                        </span>
                      </div>
                    </div>
                    <div className='detail-item'>
                      <div className='details-icons'>
                        <FaLinkedin className='icon' />
                      </div>
                      <div className='text'>
                        <span className='label'>LinkedIn</span>
                        <a
                          href={data?.student?.linkedIn}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='value'>
                          {data?.student?.linkedIn ? 'View Profile' : '-'}
                        </a>
                      </div>
                    </div>

                    <div className='detail-item'>
                      <div className='details-icons'>
                        <FaCodeBranch className='icon' />
                      </div>
                      <div className='text'>
                        <span className='label'>Branch</span>
                        <span className='value'>
                          {data?.student?.branch ?? '-'}
                        </span>
                      </div>
                    </div>

                    <div className='detail-item'>
                      <div className='details-icons'>
                        <FaGithub className='icon' />
                      </div>
                      <div className='text'>
                        <span className='label'>GitHub</span>
                        <a
                          href={data?.student?.github}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='value'>
                          {data?.student?.github ? 'View Profile' : '-'}
                        </a>
                      </div>
                    </div>

                    <div className='detail-item'>
                      <div className='details-icons'>
                        <FaLightbulb className='icon' />
                      </div>
                      <div className='text'>
                        <span className='label'>Skills</span>
                        <span className='value'>
                          {data?.student?.skills ?? '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === Tabs.ACADEMIC && (
                <section id='education' className='education-section'>
                  <div className='education-timeline'>
                    {education &&
                      education.map(
                        (
                          edu: {
                            level: 'SSC' | 'HSC' | 'DIPLOMA' | 'BE'
                            institutionName: string
                            passingYear: number | null
                            marks: number | null
                          },
                          index: number,
                        ) => (
                          <div className='education-item' key={index}>
                            <div className='education-content'>
                              <h3 className='degree'>{edu.level}</h3>
                              <h4 className='institution'>
                                {edu.institutionName}
                              </h4>
                              <span className='years'>
                                Passing Year: {edu.passingYear}
                              </span>
                              <div className='marks'>Marks: {edu.marks}</div>
                            </div>
                            {index < education.length - 1 && (
                              <div className='timeline-line' />
                            )}
                          </div>
                        ),
                      )}
                    {!education && <span>No data found</span>}
                  </div>
                </section>
              )}
              {activeTab === Tabs.MY_RESUME && (
                <section id='resume' className='education-section relative'>
                  <Uploader
                    fileList={fileList}
                    onChange={handleChange}
                    fileListVisible={false}
                    action='http://localhost'
                    draggable
                    autoUpload={false}
                    multiple={false}>
                    <div className='resume-uploader'>
                      {fileList.length > 0 || data?.student?.resume ? (
                        <>
                          <div className='resume-edit'>
                            <iframe
                              src={
                                fileList.length > 0
                                  ? URL.createObjectURL(fileList[0])
                                  : data?.student?.resume
                              }
                              width='100%'
                              height='100%'
                              title='PDF Preview'
                            />
                            <div className='option'>
                              <div className='edit-icon'>
                                <FaPencilAlt />
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className='no-resume'>
                          <span>Upload a resume file</span>
                        </div>
                      )}
                    </div>
                  </Uploader>
                </section>
              )}
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
