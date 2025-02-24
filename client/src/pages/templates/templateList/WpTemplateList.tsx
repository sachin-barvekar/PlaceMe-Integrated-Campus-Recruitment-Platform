// import { FC, useCallback, useState } from 'react'
// import { Table, Toolbar, Modal, Button } from 'shared'

// import { useTableHandlers } from 'hooks/useTableHandlers'
// // import '../../../scss/common/list/List.scss'
// import { notifyError, notifySuccess } from 'utils'
// // import CreateEditTemplate from '../createEditTemplate/CreateEditTemplate'

// // import { LANGUAGE } from '../utils'

// const { Column, HeaderCell, Cell, ActionCell } = Table

// // const getLanguageFullName = (code: string): string => {
// //   const languageEntry = Object.entries(LANGUAGE).find(
// //     ([_, value]) => value === code
// //   )
// //   return languageEntry ? languageEntry[0].replace(/_/g, ' ') : code
// // }

// const TemplateColumns = [
//   { key: 'id', label: 'Template ID', width: 200 },
//   { key: 'name', label: 'Template Name', width: 270 },
//   { key: 'category', label: 'Category', width: 170 },
//   { key: 'status', label: 'Status', width: 150 },
//   { key: 'language', label: 'Language', width: 150 }
// ]

// const WPTemplateList: FC = () => {
//   // const [activeTab, setActiveTab] = useState<string>()
//   // const [searchTerm, setSearchTerm] = useState('')
//   // const [openTemplateModal, setOpenTemplateModal] = useState(false)
//   const [openDeleteModal, setOpenDeleteModal] = useState(false)
//   const [templateToDelete, setTemplateToDelete] = useState<any | null>(null)

//   // const [openViewModal, setOpenViewModal] = useState(false)
//   // const [templateDetails, setTemplateDetails] = useState<any | null>(null)

//   const [currentPage, setCurrentPage] = useState(1)
//   const [pageSize, setPageSize] = useState(10)

//   const { onSortColumn } = useTableHandlers({
//     page: { size: pageSize, number: currentPage },
//     sortBy: {},
//     filters: []
//   })

//   //   const { data, isFetching } = useGetTemplatesQuery()

//   //   const [deleteTemplate] = useDeleteTemplateMutation()

//   const handleSortColumn = useCallback(
//     (column: string, type?: any) => {
//       onSortColumn(column, type)
//     },
//     [onSortColumn]
//   )
//   // const handleTabChange = (tab: string) => {
//   //   setActiveTab(tab)
//   // }

//   // const handleSearchChange = (value: string) => {
//   //   setSearchTerm(value)
//   // }

//   const options = [
//     { label: 'All', value: '', onClick: () => handleTabChange('') },
//     {
//       label: 'Approved',
//       value: 'APPROVED',
//       onClick: () => handleTabChange('APPROVED')
//     },
//     {
//       label: 'Pending',
//       value: 'PENDING',
//       onClick: () => handleTabChange('PENDING')
//     },
//     {
//       label: 'Rejected',
//       value: 'REJECTED',
//       onClick: () => handleTabChange('REJECTED')
//     }
//   ]

//   // const handleTemplateAction = () => {
//   //   setOpenTemplateModal(true)
//   // }

//   // const handleClose = () => {
//   //   setOpenTemplateModal(false)
//   //   setOpenViewModal(false)
//   //   setTemplateDetails(null)
//   // }

//   //   const templatesData = useMemo(
//   //     () =>
//   //       data?.data?.map((template) => ({
//   //         ...template,
//   //         language: getLanguageFullName(template.language)
//   //       })) || [],
//   //     [data]
//   //   )

//   const handleViewTemplate = (rowData: any) => {
//     setTemplateDetails(rowData)
//     setOpenViewModal(true)
//   }

//   const handleDeleteTemplate = async () => {
//     if (!templateToDelete?.id || !templateToDelete?.name) {
//       notifyError('Missing template ID or name.')
//       return
//     }
//     try {
//       //   await deleteTemplate({
//       //     templateId: templateToDelete.id,
//       //     templateName: templateToDelete.name
//       //   }).unwrap()
//       notifySuccess('Template deleted successfully')
//       setOpenDeleteModal(false)
//     } catch (error) {
//       notifyError('Failed to delete template')
//     }
//   }

//   const handleActionView = (rowData: any) => {
//     handleViewTemplate(rowData)
//   }

//   const handleActionDelete = (rowData: any) => {
//     setTemplateToDelete(rowData)
//     setOpenDeleteModal(true)
//   }

//   const handleAction = (action: string | undefined, rowData: any) => {
//     const { id: templateId } = rowData
//     if (!templateId) {
//       notifyError('Template ID is missing. Cannot perform action.')
//       return
//     }
//     switch (action) {
//       case '1':
//         handleActionView(rowData)
//         break
//       case '3':
//         handleActionDelete(rowData)
//         break
//       default:
//         break
//     }
//   }

//   //   const filteredTemplates = useMemo(() => {
//   //     return templatesData
//   //       ?.filter((template) => (activeTab ? template.status === activeTab : true))
//   //       ?.filter((template) =>
//   //         template?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
//   //       )
//   //   }, [templatesData, activeTab, searchTerm])

//   // const total = filteredTemplates?.length

//   // const paginatedData = useMemo(() => {
//   //   const startIndex = (currentPage - 1) * pageSize
//   //   const endIndex = startIndex + pageSize
//   //   return filteredTemplates.slice(startIndex, endIndex)
//   // }, [filteredTemplates, currentPage, pageSize])

//   const handlePageChange = (page: number, size?: number) => {
//     setCurrentPage(page)
//     if (size) setPageSize(size)
//   }

//   return (
//     <div className="list">
//       <Toolbar
//         options={options}
//         onSearchChange={handleSearchChange}
//         onButtonClick={handleTemplateAction}
//         buttonName="Create Template"
//         // total={total}
//       />
//       <div className="list__main-container">
//         <Table
//           // data={paginatedData}
//           //   loading={isFetching}
//           paginated
//           pageSizeOptions={[10, 20, 30]}
//           onPageChange={handlePageChange}
//           onSortColumn={handleSortColumn}
//           //   total={filteredTemplates.length}
//         >
//           {TemplateColumns.map((column, index) => {
//             const { key, label } = column
//             return (
//               <Column
//                 flexGrow={1}
//                 key={key}
//                 align={index === 0 ? 'left' : 'center'}
//                 sortable
//               >
//                 <HeaderCell>{label}</HeaderCell>
//                 <Cell dataKey={key} />
//               </Column>
//             )
//           })}
//           <Column flexGrow={1}>
//             <HeaderCell>Action</HeaderCell>
//             <ActionCell
//               dataKey="action"
//               onAction={handleAction}
//               actionOptions={['View', 'Delete']}
//             />
//           </Column>
//         </Table>
//       </div>

//       {/* {openTemplateModal && (
//         <CreateEditTemplate open={openTemplateModal} onClose={handleClose} />
//       )} */}
//       {/* <WhatsAppPreview
//         open={openViewModal}
//         templateDetails={templateDetails}
//         onClose={handleClose}
//       /> */}

//       <Modal
//         open={openDeleteModal}
//         onClose={() => setOpenDeleteModal(false)}
//         title="Confirm Delete"
//         size="calc(40% - 120px)"
//         className="delete-modal"
//         body={
//           <div className="modal-content">
//             <p className="modal-text">
//               Are you sure you want to delete the &nbsp;
//               <strong>{templateToDelete?.name}</strong> template?
//             </p>
//             <div className="modal-buttons">
//               <Button
//                 onClick={() => setOpenDeleteModal(false)}
//                 appearance="primary"
//                 color="red"
//               >
//                 No
//               </Button>
//               <Button onClick={handleDeleteTemplate} appearance="primary">
//                 Yes
//               </Button>
//             </div>
//           </div>
//         }
//       />
//     </div>
//   )
// }

// export default WPTemplateList

export {}
