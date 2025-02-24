import React, { useEffect, useState } from 'react'
import { IconButton } from 'rsuite'
import {
  FaLinkedin,
  FaEnvelope,
  FaVenusMars,
  FaUserTie,
  FaUniversity,
  FaMapMarkerAlt
} from 'react-icons/fa'
import { MdCall } from 'react-icons/md'
import { Edit as EditIcon } from '@rsuite/icons'
import '../../Profile.scss'
import { useGetAdminProfileQuery } from 'pages/profile/profileApiSlice'
import { AdminProfileResponse } from 'pages/profile/types'
import { Loader } from 'shared'
import { Tabs } from 'pages/profile/utils'
import PROFILE from '../../../../assets/images/profile.png'
import CreateEditAdminProfile from '../CreateEditAdminProfile/CreateEditAdminProfile'

const AdminProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.PERSONAL)
  const { data, isFetching } = useGetAdminProfileQuery()
  const [profileData, setProfileData] = useState<AdminProfileResponse>()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [imgSrc, setImgSrc] = useState<string | undefined>(
    data?.admin?.profilePhoto
  )
  useEffect(() => {
    if (data?.admin?.profilePhoto) {
      setImgSrc(data.admin.profilePhoto)
    } else {
      setImgSrc(PROFILE)
    }
  }, [data?.admin?.profilePhoto])

  const handleImageError = () => {
    setImgSrc(PROFILE)
  }
  const handleEditClick = (ProfileData: AdminProfileResponse) => {
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
                {data?.admin?.userId?.name ?? '-'}
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
                Profile Details
              </div>
            </div>

            <div className="tab-content">
              {activeTab === Tabs.PERSONAL && (
                <div className="personal-details">
                  <div className="details-grid">
                    <div className="detail-item">
                      <FaVenusMars className="icon" />
                      <div className="text">
                        <span className="label">Gender</span>
                        <span className="value">
                          {data?.admin?.gender ?? '-'}
                        </span>
                      </div>
                    </div>

                    <div className="detail-item">
                      <MdCall className="icon" />
                      <div className="text">
                        <span className="label">Mobile</span>
                        <span className="value">
                          {data?.admin?.mobile ?? '-'}
                        </span>
                      </div>
                    </div>

                    <div className="detail-item">
                      <FaEnvelope className="icon" />
                      <div className="text">
                        <span className="label">Email</span>
                        <span className="value">
                          {data?.admin?.userId?.email ?? '-'}
                        </span>
                      </div>
                    </div>

                    <div className="detail-item">
                      <FaLinkedin className="icon" />
                      <div className="text">
                        <span className="label">LinkedIn</span>
                        <a
                          href={data?.admin?.linkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="value"
                        >
                          {data?.admin?.linkedIn ? 'View Profile' : '-'}
                        </a>
                      </div>
                    </div>

                    <div className="detail-item">
                      <FaUserTie className="icon" />
                      <div className="text">
                        <span className="label">Position</span>
                        <span className="value">{data?.admin?.position}</span>
                      </div>
                    </div>

                    <div className="detail-item">
                      <FaUniversity className="icon" />
                      <div className="text">
                        <span className="label">College Name</span>
                        <span className="value">
                          {data?.admin?.collegeName ?? '-'}
                        </span>
                      </div>
                    </div>

                    <div className="detail-item">
                      <FaMapMarkerAlt className="icon" />
                      <div className="text">
                        <span className="label">College Address</span>
                        <span className="value">
                          {data?.admin?.collegeAddress ?? '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <CreateEditAdminProfile
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

export default AdminProfilePage
