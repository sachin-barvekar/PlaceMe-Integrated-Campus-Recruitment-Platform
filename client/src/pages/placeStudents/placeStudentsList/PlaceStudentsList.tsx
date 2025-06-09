import { FC, useContext, useState } from 'react'
import { useTableHandlers } from '../../../hooks/useTableHandlers'
import { IListApiRequest } from '../../../api/types'
import { notifyError, notifySuccess } from '../../../utils'
import { AuthContext } from '../../../contexts/AuthContext'
import { Toolbar, CardTable } from '../../../shared'
import '../../../scss/common/list/CardList.scss'
import {
  useDeletePlacementMutation,
  useFetchPlacementListQuery,
} from '../placeStudentApiSlice'
import { Placement } from '../types'
import CreateEditPlacement from './addPlaceStudent/CreateEditPlaceStudent'
import { useFetchRecruiterListQuery } from '../../recruiters/recruiterListApiSlice'
import { Recruiter } from '../../recruiters/types'

const PlaceStudentList: FC = () => {
  const authContext = useContext(AuthContext)
  const role = authContext?.role ?? undefined
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [deletePlacement] = useDeletePlacementMutation()
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [selectedPlacementData, setSelectedPlacementData] =
    useState<Placement>()
  const { requestBody, onPageChange, onSearchChange, onSortColumn } =
    useTableHandlers<Placement, IListApiRequest<Placement>>(
      {
        page: { size: 10, number: 0 },
        filters: [],
      },
      'search',
    )
  const { data, isFetching } = useFetchPlacementListQuery(requestBody)

  const total = data?.totalElements ?? data?.content?.length ?? 0
  const { requestBody: recruiterReq } = useTableHandlers<
    Recruiter,
    IListApiRequest<Recruiter>
  >({
    page: { size: Number.MAX_SAFE_INTEGER, number: 0 },
    filters: [],
  })

  const { data: recruiterData } = useFetchRecruiterListQuery(recruiterReq)
  const recruiterMapData = [
    ...(recruiterData?.content?.map(recruiter => ({
      label: recruiter.companyName,
      value: recruiter.recruiterId,
    })) || []),
    { label: 'Other', value: 'other' },
  ]

  const companyIdToNameMap = new Map(
    recruiterMapData?.map(recruiter => [recruiter.value, recruiter.label]),
  )

  const formattedPlacementData =
    data?.content?.map((placement: Placement) => ({
      ...placement,
      companyName:
        companyIdToNameMap.get(placement.companyId) || placement.companyName, // fallback
    })) || []
  const options = [
    {
      label: 'Placed Students',
      value: 'all',
      onClick: () => {},
    },
  ]

  const handleAction = async (
    action: string | undefined,
    rowData: Placement,
  ) => {
    if (!rowData) {
      return
    }
    switch (action) {
      case '2':
        setSelectedPlacementData(rowData)
        setIsEditMode(true)
        setIsModalOpen(true)
        break
      case '3':
        try {
          const _id = rowData?._id
          if (!_id) {
            notifyError('Placement does not have id.')
            return
          }
          await deletePlacement({ _id }).unwrap()
          notifySuccess(`Placement deleted successfully.`)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          notifyError('Error while delete placement.')
        }
        break
      default:
        break
    }
  }

  return (
    <div className='card-list'>
      <Toolbar
        searchPlaceholder='Serach by student or company name'
        options={options}
        onSearchChange={onSearchChange}
        total={total}
        buttonName='Add Placement'
        onButtonClick={() => {
          setIsModalOpen(true)
        }}
        {...(role === 'student' && { buttonName: undefined })}
      />
      <div className='card-list__main-container'>
        <CardTable
          data={formattedPlacementData ?? []}
          loading={isFetching}
          onSortColumn={onSortColumn}
          paginated
          pageSizeOptions={[10, 20, 30]}
          defaultPageSize={10}
          onPageChange={onPageChange}
          total={total}
          actionOptions={role === 'student' ? undefined : ['Edit', 'Delete']}
          onAction={handleAction}
          card
        />
      </div>
      <CreateEditPlacement
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setIsEditMode(false)
          setSelectedPlacementData(undefined)
        }}
        isEditMode={isEditMode}
        placementData={selectedPlacementData}
        recruiterMapData={recruiterMapData}
      />
    </div>
  )
}

export default PlaceStudentList
