import { MdBusiness } from 'react-icons/md'
import { FaUserTie } from 'react-icons/fa'
import mockdata from './data.json'
import { ChartScreen, DashCards, PageHeading } from '../../shared'
import './Dashboard.scss'
import '../../scss/common/list/List.scss'

const highestPackageData = [
  { year: 2019, package: 20 },
  { year: 2020, package: 25 },
  { year: 2021, package: 10 },
  { year: 2022, package: 35 },
  { year: 2023, package: 40 },
  { year: 2024, package: 15 }
]

const Dashboard: React.FC = () => {
  const sampleData = [
    ['Computer Engineering', 90],
    ['CSDS', 50],
    ['ENTC', 30],
    ['Mechanical', 45],
    ['Civil', 25]
  ]

  const USER_DATA = [
    {
      title: 'Total Students',
      description: 1000,
      icon: <FaUserTie className="dashboard-icon pending" />
    },
    {
      title: 'Total Recruiters',
      description: 60,
      icon: <MdBusiness className="dashboard-icon iconcompleted" />
    },
    {
      title: 'Placed Students',
      description: 455,
      icon: <FaUserTie className="dashboard-icon placed" />
    }
  ]

  return (
    <div className="dashboard">
      <PageHeading title="Welcome Admin" />
      <DashCards data={USER_DATA} onCardClick={() => {}} />
      <div className="report-dash">
        <ChartScreen
          Percent={60}
          strokeColor="green"
          title="Placed Students of the year"
          chartType="progress"
          actionOptions="Download"
        />
        <ChartScreen
          data={mockdata ?? []}
          title="Recruiters Visited"
          chartType="bar"
          actionOptions="Download"
        />

        <ChartScreen
          data={highestPackageData ?? []}
          title="Highest Packages (LPA)"
          chartType="line"
          actionOptions="Download"
        />
        <ChartScreen
          data={sampleData ?? []}
          title="Department Wise Placement (in number)"
          chartType="pie"
          actionOptions="Download"
        />
      </div>
    </div>
  )
}

export default Dashboard
