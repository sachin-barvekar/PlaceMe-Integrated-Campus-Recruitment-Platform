import React, { useEffect, useState } from 'react'
import { IconButton } from 'rsuite'
import {
  FaLinkedin,
  FaEnvelope,
  FaUserTie,
  FaBuilding,
  FaMapMarkerAlt,
  FaUser,
} from 'react-icons/fa'
import { Edit as EditIcon } from '@rsuite/icons'
import '../../Profile.scss'
import { useGetRecruiterProfileQuery } from '../../profileApiSlice'
import { RecruiterProfileResponse } from '../../types'
import { Loader } from '../../../../shared'
import PROFILE from '../../../../assets/images/profile.png'
import CreateEditRecruiterProfile from '../createEditRecruiterProfile/CreateEditRecruiterProfile'

const RecruiterProfilePage: React.FC = () => {
  const { data, isFetching } = useGetRecruiterProfileQuery()
  const [profileData, setProfileData] = useState<RecruiterProfileResponse>()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [imgSrc, setImgSrc] = useState<string | undefined>(
    data?.recruiter?.profilePhoto,
  )

  useEffect(() => {
    if (data?.recruiter?.profilePhoto) {
      setImgSrc(data.recruiter.profilePhoto)
    } else {
      setImgSrc(PROFILE)
    }
  }, [data?.recruiter?.profilePhoto])

  const handleImageError = () => {
    setImgSrc(PROFILE)
  }

  const handleEditClick = (ProfileData: RecruiterProfileResponse) => {
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
                {data?.recruiter?.companyName ?? '-'}
              </span>
            </div>
          </div>
          <div className='user-profile-body'>
            <div className='tab-content'>
              <div className='personal-details'>
                <div className='details-grid'>
                  <div className='detail-item'>
                    <div className='details-icons'>
                      <FaBuilding className='icon' />
                    </div>
                    <div className='text'>
                      <span className='label'>Company Website</span>
                      <a
                        href={data?.recruiter?.companyWebsite}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='value'>
                        {data?.recruiter?.companyWebsite
                          ? 'Visit Website'
                          : '-'}
                      </a>
                    </div>
                  </div>

                  <div className='detail-item'>
                    <div className='details-icons'>
                      <FaLinkedin className='icon' />
                    </div>
                    <div className='text'>
                      <span className='label'>LinkedIn Profile</span>
                      <a
                        href={data?.recruiter?.linkedIn}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='value'>
                        {data?.recruiter?.linkedIn ? 'View Profile' : '-'}
                      </a>
                    </div>
                  </div>
                  <div className='detail-item'>
                    <div className='details-icons'>
                      <FaMapMarkerAlt className='icon' />
                    </div>
                    <div className='text'>
                      <span className='label'>Company Address</span>
                      <span className='value'>
                        {data?.recruiter?.address ?? '-'}
                      </span>
                    </div>
                  </div>
                  <div className='detail-item'>
                    <div className='details-icons'>
                      <FaUserTie className='icon' />
                    </div>
                    <div className='text'>
                      <span className='label'>About Us</span>
                      <span className='value'>
                        {data?.recruiter?.aboutUs ?? '-'}
                      </span>
                    </div>
                  </div>
                  <div className='detail-item'>
                    <div className='details-icons'>
                      <FaUser className='icon' />
                    </div>
                    <div className='text'>
                      <span className='label'>Contact Name</span>
                      <span className='value'>
                        {data?.recruiter?.userId?.name ?? '-'}
                      </span>
                    </div>
                  </div>
                  <div className='detail-item'>
                    <div className='details-icons'>
                      <FaEnvelope className='icon' />
                    </div>
                    <div className='text'>
                      <span className='label'>Contact Email</span>
                      <span className='value'>
                        {data?.recruiter?.userId?.email ?? '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <CreateEditRecruiterProfile
              profileData={profileData}
              isOpen={isModalOpen}
              isEditMode={isEditMode}
              onClose={() => {
                setIsModalOpen(false)
                setIsEditMode(false)
                setProfileData(undefined)
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default RecruiterProfilePage
