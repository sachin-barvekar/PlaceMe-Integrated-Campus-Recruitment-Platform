import React from 'react'
import { Loader, PageHeading } from '../../../shared'
import { useGetPlacementScoreQuery } from '../dashboardApiSlice'
import { Progress, Tag } from 'rsuite'
import './studentHome.scss'

const StudentHome: React.FC = () => {
  const {
    data: placementData,
    isLoading,
    isError,
  } = useGetPlacementScoreQuery()

  const { placementScore, role, reason, suggestions, skills } =
    placementData || {}

  const getColor = (score: number) => {
    if (score >= 80) return 'green'
    if (score >= 50) return 'orange'
    return 'red'
  }

  return (
    <div className='dashboard'>
      <PageHeading title='Welcome Student' />
      <div className='dashboard-content'>
        {isLoading && <Loader />}
        {isError && <div>Error loading placement score</div>}
        {!isLoading && placementData && (
          <div className='placement-container'>
            <div className='progress-box'>
              <Progress.Circle
                percent={placementScore}
                strokeColor={getColor(placementScore ?? 0)}
              />
              <p>Placement Score</p>
            </div>

            <div className='placement-info'>
              <h2>
                Predicted Role: <span>{role}</span>
              </h2>

               <div>
                <strong>Reason:</strong>
                <ul className='list-disc pl-5'>
                  {reason?.map((s: string, index: number) => (
                    <li key={index}>{s}</li>
                  ))}
                </ul>
              </div>

              <div>
                <strong>Suggestions:</strong>
                <ul className='list-disc pl-5'>
                  {suggestions?.map((s: string, index: number) => (
                    <li key={index}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className='skills-box'>
                <h2>Your Skills:</h2>
                <div className='skills-tags'>
                  {skills?.map((skill: string, index: number) => (
                    <Tag key={index} color='blue'>
                      {skill}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentHome
