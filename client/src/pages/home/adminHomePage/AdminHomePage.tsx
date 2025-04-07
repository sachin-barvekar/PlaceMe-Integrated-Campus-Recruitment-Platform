import { Stat, StatGroup } from 'rsuite'
import './AdminHome.scss'
import { ChartScreen, PageHeading } from '../../../shared'
import {
  useGetDashboardDataQuery,
  useGetRecruiterDashboardDataQuery,
} from '../dashboardApiSlice'
import { useNavigate } from 'react-router-dom'
import { FaUsers, FaUserTie } from 'react-icons/fa'
import { MdBusiness } from 'react-icons/md'

const AdminHome: React.FC = () => {
  const { data: recruiter } = useGetRecruiterDashboardDataQuery()
  const { data } = useGetDashboardDataQuery()
  const navigate = useNavigate()
  const formattedData = data?.branchWisePlacement?.map(
    ({ branch, count }: { branch: string; count: number }) => [branch, count],
  )
  return (
    <div className='dashboard'>
      <PageHeading title='Welcome Admin' />
      <StatGroup className='stat-container' columns={3}>
        <Stat
          onClick={() => {
            navigate('/student')
          }}
          bordered
          className='stat-card'
          icon={<FaUsers color='#2B478B' className='stat-icon' />}>
          <Stat.Value>{data?.totalStudents ?? 0}</Stat.Value>
          <Stat.Label>Total Students</Stat.Label>
        </Stat>
        <Stat
          onClick={() => {
            navigate('/recruiter')
          }}
          bordered
          className='stat-card'
          icon={<MdBusiness color='#314D63' className='stat-icon' />}>
          <Stat.Value>{recruiter?.totalRecruiters ?? 0}</Stat.Value>
          <Stat.Label>Total Recruiters</Stat.Label>
        </Stat>
        <Stat
          bordered
          onClick={() => {
            navigate('/placed-students')
          }}
          className='stat-card'
          icon={<FaUserTie color='#FF9800' className='stat-icon' />}>
          <Stat.Value>{data?.placedStudents ?? 0}</Stat.Value>
          <Stat.Label>Placed Students</Stat.Label>
        </Stat>
      </StatGroup>
      <div className='report-dash'>
        <div className='report-item'>
          <ChartScreen
            Percent={data?.placementPercentage ?? 0}
            strokeColor='green'
            title='Placed Students of the year'
            chartType='progress'
            actionOptions='Download'
          />
        </div>
        <div className='report-item'>
          <ChartScreen
            data={formattedData ?? []}
            title='Department Wise Placement (in number)'
            chartType='pie'
            actionOptions='Download'
          />
        </div>
        <div className='report-item'>
          <ChartScreen
            data={recruiter?.recruiterCountPerYear ?? []}
            title='Recruiters Visited'
            chartType='bar'
            actionOptions='Download'
          />
        </div>
        <div className='report-item'>
          <ChartScreen
            data={data?.highestPackageData ?? []}
            title='Highest Packages (LPA)'
            chartType='line'
            actionOptions='Download'
          />
        </div>
      </div>
    </div>
  )
}

export default AdminHome
