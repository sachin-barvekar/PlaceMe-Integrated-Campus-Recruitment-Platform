import { FC, ReactNode } from 'react'
import { Pagination, SelectPicker } from 'rsuite'
import './TableFooter.scss'

type TableFooterProps = {
  children?: ReactNode,
  total: number,
  pageSize: number,
  currentPage: number,
  pageSizeOptions?: number[],
  onPageChange: (page: number) => void,
  onPageSizeChange: (value: number | null, event: React.SyntheticEvent) => void,
  maxButtons?: number
}
const TableFooter: FC<TableFooterProps> = ({
  children,
  total,
  pageSize,
  currentPage,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  maxButtons,
  ...props
}) => {
  return (
    <div {...props} className="table-footer">
      <div className="table-footer__left">{children}</div>
      <div className="table-footer__right">
        {pageSizeOptions && (
          <>
            <span className="table-footer__rows-per-page-label">
              Rows per page:
            </span>
            <SelectPicker
              data={pageSizeOptions.map((size) => ({
                label: size.toString(),
                value: size
              }))}
              value={pageSize}
              onChange={onPageSizeChange}
              cleanable={false}
              searchable={false}
              className="table-footer__select"
              placement="topEnd"
            />
          </>
        )}
        <Pagination
          activePage={currentPage}
          limit={pageSize}
          total={total}
          onChangePage={onPageChange}
          size="sm"
          layout={['pager']}
          prev
          next
          maxButtons={maxButtons}
          first
          last
          ellipsis
          className="table-footer__pagination"
        />
      </div>
    </div>
  )
}
TableFooter.defaultProps = {
  children: null
}
export default TableFooter
