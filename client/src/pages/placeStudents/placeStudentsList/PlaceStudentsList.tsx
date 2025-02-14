import { FC, useState } from 'react'
import { Toolbar, CardTable } from '../../../shared'

import '../../../scss/common/list/CardList.scss'

const PlaceStudentList: FC = () => {
  const mockPlaceStudentData = [
    {
      name: 'Jane Smith',
      branch: 'Mechanical Engineering',
      companyName: 'Auto Innovators',
      designation: 'Mechanical Engineer',
      salary: '10 LPA',
      profilePhoto:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    {
      name: 'Alex Johnson',
      branch: 'Electronics Engineering',
      companyName: 'Smart Devices Inc.',
      designation: 'Hardware Engineer',
      salary: '11 LPA',
      profilePhoto:
        'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    {
      name: 'Emily Davis',
      branch: 'Information Technology',
      companyName: 'Data Solutions',
      designation: 'Data Analyst',
      salary: '9 LPA',
      profilePhoto:
        'https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    {
      name: 'Michael Lee',
      branch: 'Civil Engineering',
      companyName: 'BuildTech',
      designation: 'Project Manager',
      salary: '13 LPA',
      profilePhoto:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    {
      name: 'Sophia Brown',
      branch: 'Computer Engineering',
      companyName: 'Innovatech',
      designation: 'Frontend Developer',
      salary: '11.5 LPA',
      profilePhoto:
        'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    {
      name: 'Daniel Wilson',
      branch: 'Mechanical Engineering',
      companyName: 'Robotics Co.',
      designation: 'Robotics Engineer',
      salary: '14 LPA',
      profilePhoto:
        'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    {
      name: 'James Martinez',
      branch: 'Computer Engineering',
      companyName: 'AI Innovations',
      designation: 'Machine Learning Engineer',
      salary: '15 LPA',
      profilePhoto:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    }
  ]

  const [data] = useState(mockPlaceStudentData)
  const options = [
    {
      label: 'Placed Students',
      value: 'all',
      onClick: () => {}
    }
  ]

  return (
    <div className="card-list">
      <Toolbar
        options={options}
        onSearchChange={() => {}}
        total={data.length ?? 0}
      />
      <div className="card-list__main-container">
        <CardTable
          data={data ?? []}
          loading={false}
          //   onSortColumn={handleSortColumn}
          paginated
          pageSizeOptions={[10, 20, 30]}
          //   total={total ?? 0}
          defaultPageSize={mockPlaceStudentData.length}
          //   onPageChange={onPageChange}
          card
        />
      </div>
    </div>
  )
}

export default PlaceStudentList
