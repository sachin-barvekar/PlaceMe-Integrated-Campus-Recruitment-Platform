import { useState, useCallback } from 'react'
import { SortType } from 'rsuite-table'
import { IListApiRequest, IFilter } from '../api/types'

interface HandlersWithSearch<U, T> {
  requestBody: U
  onSearchChange: (value: string) => void
  onPageChange: (pageNumber: number, pageSize: number) => void
  onSortColumn: (column: string, type: SortType | undefined) => void
  onFilterChange: (newFilters: IFilter<T>[]) => void
}

export const useTableHandlers = <T, U extends IListApiRequest<T>>(
  initialState: U,
  searchFieldName?: keyof T,
): HandlersWithSearch<U, T> => {
  const [requestBody, setRequestBody] = useState<U>(initialState)

  const onSearchChange = useCallback(
    (value: string) => {
      if (!searchFieldName) return
      setRequestBody(prevState => ({
        ...prevState,
        filters: [
          ...(prevState.filters?.filter(
            ({ fieldName }) => fieldName !== searchFieldName,
          ) ?? []),
          {
            fieldName: searchFieldName,
            operator: 'like',
            fieldValue: value,
          },
        ],
        page: {
          size: prevState.page?.size,
          number: 0,
        },
      }))
    },
    [searchFieldName],
  )

  const onSortColumn = useCallback(
    (column: string, type: SortType | undefined) => {
      setRequestBody(prevState => ({
        ...prevState,
        sortBy: {
          fieldName: column as keyof U,
          direction: type ?? 'asc',
        },
      }))
    },
    [],
  )

  const onPageChange = (pageNumber: number, pageSize: number) => {
    setRequestBody(prevState => ({
      ...prevState,
      page: {
        number: pageNumber,
        size: pageSize,
      },
    }))
  }

  const onFilterChange = useCallback((newFilters: IFilter<T>[]) => {
    setRequestBody(prevState => ({
      ...prevState,
      filters: newFilters,
      page: {
        size: prevState.page?.size,
        number: 0,
      },
    }))
  }, [])

  return {
    requestBody,
    onSearchChange,
    onPageChange,
    onSortColumn,
    onFilterChange,
  }
}

export default useTableHandlers
