import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { TableProps, RowDataType, RowKeyType } from 'rsuite-table'
import { Loader } from 'shared/atoms'
import TableFooter from '../table/footer/TableFooter'
import Card from './Card'
import './CardTable.scss'
import TextCard from './TextCard'
import { ReactComponent as NoData } from '../../../assets/images/no-data.svg'

export interface Pagination {
  page: number;
  limit: number;
}

const DEFAULT_PAGE_SIZE = 10
function CardTable<R extends RowDataType<any>, K extends RowKeyType>(
  props: TableProps<R, K> & {
    paginated?: boolean,
    pageSizeOptions?: number[],
    defaultPageSize?: number,
    total?: number,
    loading: boolean,
    onPageChange?: (page: number, pageSize: number) => void,
    maxButtons?: number,
    actionOptions?: string[],
    onAction?: (eventKey: string | undefined, rowData: any) => void,
    handleSelection?: (rowData: any) => void,
    selected?: any[],
    card?: boolean,
    textCard?: boolean
  }
): JSX.Element {
  const {
    data = [],
    paginated = false,
    pageSizeOptions,
    defaultPageSize = DEFAULT_PAGE_SIZE,
    total = data.length,
    loading,
    onPageChange,
    maxButtons = 3,
    actionOptions,
    onAction,
    handleSelection,
    selected = [],
    card,
    textCard
  } = props

  const initialPageSize =
    pageSizeOptions && pageSizeOptions.length > 0
      ? pageSizeOptions[0]
      : defaultPageSize

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const handlePageChangeInternal = (page: number) => {
    setCurrentPage(page)
    if (onPageChange) {
      onPageChange(page, pageSize)
    }
  }

  const handlePageSizeChangeInternal = (
    value: number | null,
    _: React.SyntheticEvent
  ) => {
    if (value !== null) {
      setPageSize(value)
      setCurrentPage(1)
      if (onPageChange) {
        onPageChange(1, value)
      }
    }
  }

  useEffect(() => {
    if (onPageChange) {
      onPageChange(currentPage, pageSize)
    }
    // eslint-disable-next-line
  }, [currentPage, pageSize])

  return (
    <div className="card-container">
      {data.length === 0 && !loading && (
        <div className="no-data">
          <NoData />
          <div>No Data Found</div>
        </div>
      )}
      {loading && <Loader />}
      {!loading && (
        <div
          className={textCard ? `card-wrapper text-wrapper` : 'card-wrapper'}
        >
          {data.map((item) => (
            <div key={item.id}>
              {card && (
                <Card
                  imageUrl={item.profilePhoto}
                  name={item?.studentName}
                  Branch={item.branch}
                  CompanyName={item?.companyName}
                  CompanyLocation={item?.location}
                  Designation={item?.jobRole}
                  Package={item?.package}
                  onAction={onAction}
                  data={item}
                  actionOptions={actionOptions}
                  handleSelection={handleSelection}
                  selected={selected.some((value) => value.uid === item.uid)}
                />
              )}
              {textCard && (
                <TextCard
                  title={item.name}
                  subtitle={item.cropName}
                  date={format(new Date(item.createdAt), 'MMMM dd, yyyy')}
                  totalIncome={item.creditAmountTotal}
                  totalExpense={item.debitAmountTotal}
                  onAction={onAction}
                  handleSelection={handleSelection}
                  actionOptions={actionOptions}
                  data={item}
                />
              )}
            </div>
          ))}
        </div>
      )}
      {paginated && (
        <TableFooter
          total={total}
          pageSize={pageSize}
          currentPage={currentPage}
          pageSizeOptions={pageSizeOptions}
          onPageChange={handlePageChangeInternal}
          onPageSizeChange={handlePageSizeChangeInternal}
          maxButtons={maxButtons}
        >
          {`${(currentPage - 1) * pageSize + 1}-${Math.min(
            currentPage * pageSize,
            total
          )} of ${total}`}
        </TableFooter>
      )}
    </div>
  )
}

CardTable.DEFAULT_PAGE_SIZE = DEFAULT_PAGE_SIZE

export default CardTable
