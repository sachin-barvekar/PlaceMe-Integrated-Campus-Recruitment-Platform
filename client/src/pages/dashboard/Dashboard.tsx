import { MdBusiness } from 'react-icons/md'
import { FaUserTie } from 'react-icons/fa'
import { useNavigate } from 'react-router'
import { ChartScreen, DashCards, PageHeading } from '../../shared'
import './Dashboard.scss'
import '../../scss/common/list/List.scss'
import { useGetDashboardDataQuery } from './dashboardApiSlice'

const Dashboard: React.FC = () => {
  const { data } = useGetDashboardDataQuery()
  const navigate = useNavigate()
  const formattedData = data?.branchWisePlacement?.map(({ branch, count }) => [
    branch,
    count
  ])

  const USER_DATA = [
    {
      title: 'Total Students',
      description: data?.totalStudents ?? 0,
      icon: <FaUserTie className="dashboard-icon total" />,
      onClick: () => {
        navigate('/student')
      }
    },
    {
      title: 'Total Recruiters',
      description: 60,
      icon: <MdBusiness className="dashboard-icon recruiter" />
    },
    {
      title: 'Placed Students',
      description: data?.placedStudents ?? 0,
      icon: <FaUserTie className="dashboard-icon placed" />,
      onClick: () => {
        navigate('/placed-students')
      }
    }
  ]

  return (
    <div className="dashboard">
      <PageHeading title="Welcome Admin" />
      <DashCards data={USER_DATA} />
      <div className="report-dash">
        <div className="report-item">
          <ChartScreen
            Percent={data?.placementPercentage ?? 0}
            strokeColor="green"
            title="Placed Students of the year"
            chartType="progress"
            actionOptions="Download"
          />
        </div>
        <div className="report-item">
          <ChartScreen
            data={formattedData ?? []}
            title="Department Wise Placement (in number)"
            chartType="pie"
            actionOptions="Download"
          />
        </div>
        <div className="report-item">
          <ChartScreen
            data={[]}
            title="Recruiters Visited"
            chartType="bar"
            actionOptions="Download"
          />
        </div>
        <div className="report-item">
          <ChartScreen
            data={data?.highestPackageData ?? []}
            title="Highest Packages (LPA)"
            chartType="line"
            actionOptions="Download"
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
