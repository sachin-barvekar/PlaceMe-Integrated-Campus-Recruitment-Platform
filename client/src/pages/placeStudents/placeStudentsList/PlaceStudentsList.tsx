import { FC, useContext, useState } from 'react'
import { useTableHandlers } from 'hooks/useTableHandlers'
import { IListApiRequest } from 'api/types'
import { notifyError, notifySuccess } from 'utils'
import { AuthContext } from 'contexts/AuthContext'
import { Toolbar, CardTable } from '../../../shared'
import '../../../scss/common/list/CardList.scss'
import {
  useDeletePlacementMutation,
  useFetchPlacementListQuery
} from '../placeStudentApiSlice'
import { Placement } from '../types'
import CreateEditPlacement from './addPlaceStudent/CreateEditPlaceStudent'

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
        filters: []
      },
      'search'
    )
  const { data, isFetching } = useFetchPlacementListQuery(requestBody)

  const total = data?.totalElements ?? data?.content?.length ?? 0
  const options = [
    {
      label: 'Placed Students',
      value: 'all',
      onClick: () => {}
    }
  ]

  const handleAction = async (action: string | undefined, rowData: any) => {
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
          // eslint-disable-next-line
          const _id = rowData?._id
          // eslint-disable-next-line
          if (!_id) {
            notifyError('Placement does not have id.')
            return
          }
          await deletePlacement({ _id }).unwrap()
          notifySuccess(`Placement deleted successfully.`)
        } catch (error) {
          notifyError('Error while delete placement.')
        }
        break
      default:
        break
    }
  }

  return (
    <div className="card-list">
      <Toolbar
        options={options}
        onSearchChange={onSearchChange}
        total={total}
        buttonName="Add Placement"
        onButtonClick={() => {
          setIsModalOpen(true)
        }}
        {...(role === 'student' && { buttonName: undefined })}
      />
      <div className="card-list__main-container">
        <CardTable
          data={data?.content ?? []}
          loading={isFetching}
          onSortColumn={onSortColumn}
          paginated
          pageSizeOptions={[10, 20, 30]}
          defaultPageSize={10}
          onPageChange={onPageChange}
          total={total}
          actionOptions={role === 'student' ? [] : ['Edit', 'Delete']}
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
      />
    </div>
  )
}

export default PlaceStudentList
