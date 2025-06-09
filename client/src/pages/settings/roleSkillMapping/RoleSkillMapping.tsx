import React, { useState } from 'react'
import { PageHeading } from '../../../shared'
import { Uploader, Message, Divider } from 'rsuite'
import 'react-toastify/dist/ReactToastify.css'
import './RoleSkillMapping.scss'
import { useSkillMappingByAdminMutation } from '../settingsApiSlice'
import { FaPencilAlt } from 'react-icons/fa'
import { notifySuccess } from '../../../utils'

const RoleSkillMapping: React.FC = () => {
  const [fileList, setFileList] = useState<File[]>([])
  const [csvText, setCsvText] = useState('')
  const [uploadSkillMapping] = useSkillMappingByAdminMutation()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = async (newFileList: any[]) => {
    const latestFile = newFileList[newFileList.length - 1]?.blobFile
    if (latestFile) {
      const reader = new FileReader()
      reader.onload = e => {
        if (e.target && typeof e.target.result === 'string') {
          setCsvText(e.target.result)
        } else {
          setCsvText('')
        }
      }
      reader.readAsText(latestFile)
    }
    setFileList(latestFile ? [latestFile] : [])
    try {
      await uploadSkillMapping(latestFile).unwrap()
      notifySuccess('CSV uploaded. Model retraining started in the background.')
    } catch (err) {
      console.error('Upload failed:', err)
    }
  }

  return (
    <div className='role-skill-mapping-container'>
      <PageHeading title='Role-Skill Mapping' />

      <section className='intro-section'>
        <Message type='info' showIcon>
          Upload a CSV file that lists different job roles and the important
          skills needed for each one across all job domains. This helps the
          system stay updated with the latest industry trends. When students use
          the platform, it checks their current skills, predicts which job roles
          they best match with, and gives them a placement score. If the score
          is low, the system will suggest new skills they should learn to
          improve their chances of getting placed.
        </Message>
      </section>

      <Divider />

      <section className='upload-section'>
        <Uploader
          fileList={fileList}
          onChange={handleChange}
          fileListVisible={false}
          action='http://localhost'
          draggable
          autoUpload={false}
          multiple={false}>
          <div className='csv-uploader'>
            {fileList.length > 0 ? (
              <>
                <div className='csv-preview'>
                  <div className='file-name'>
                    <strong>File:</strong> {fileList[0].name}
                  </div>
                  <div className='option'>
                    <div className='edit-icon'>
                      <FaPencilAlt />
                    </div>
                  </div>
                  <div className='csv-content'>
                    <pre>{csvText}</pre>
                  </div>
                </div>
              </>
            ) : (
              <div className='no-csv'>
                <span>Upload a CSV file</span>
              </div>
            )}
          </div>
        </Uploader>
      </section>

      <Divider />

      <section className='note-section'>
        <Message type='warning' showIcon>
          <div>
            <strong>Note:</strong> The CSV file should contain exactly two
            columns:
            <ul>
              <li>
                <code>role</code> — Job role name
              </li>
              <li>
                <code>skills</code> — Comma-separated skills for the role
              </li>
            </ul>
            <p>Example CSV content:</p>
            <pre>
              {`role,skills
Backend Developer,"Node.js, Express, MongoDB, SQL, REST APIs"
Frontend Developer,"React, HTML, CSS, JavaScript, Redux"`}
            </pre>
          </div>
        </Message>
      </section>
    </div>
  )
}

export default RoleSkillMapping
