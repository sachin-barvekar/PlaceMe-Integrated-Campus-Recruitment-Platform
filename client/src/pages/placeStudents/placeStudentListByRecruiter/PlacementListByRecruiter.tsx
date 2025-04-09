import { FC } from 'react'
import { useTableHandlers } from '../../../hooks/useTableHandlers'
import { IListApiRequest } from '../../../api/types'
import { Toolbar, CardTable } from '../../../shared'
import '../../../scss/common/list/CardList.scss'
import { useFetchPlacementListByRecruiterQuery } from '../placeStudentApiSlice'
import { Placement } from '../types'

const PlaceStudentByRecruiterList: FC = () => {
  const { requestBody, onPageChange, onSearchChange, onSortColumn } =
    useTableHandlers<Placement, IListApiRequest<Placement>>(
      {
        page: { size: 10, number: 0 },
        filters: [],
      },
      'search',
    )
  const { data, isFetching } =
    useFetchPlacementListByRecruiterQuery(requestBody)

  const total = data?.totalElements ?? data?.content?.length ?? 0
  const options = [
    {
      label: 'Job Offers',
      value: 'all',
      onClick: () => {},
    },
  ]

  return (
    <div className='card-list'>
      <Toolbar
        searchPlaceholder='Serach by student or company name'
        options={options}
        onSearchChange={onSearchChange}
        total={total}
      />
      <div className='card-list__main-container'>
        <CardTable
          data={data?.content ?? []}
          loading={isFetching}
          onSortColumn={onSortColumn}
          paginated
          pageSizeOptions={[10, 20, 30]}
          defaultPageSize={10}
          onPageChange={onPageChange}
          total={total}
          card
        />
      </div>
    </div>
  )
}

export default PlaceStudentByRecruiterList
