import React, { useState, useEffect } from 'react'
import { Nav, Input, InputGroup } from 'rsuite'
import SearchIcon from '@rsuite/icons/Search'
import PlusIcon from '@rsuite/icons/Plus'
import ArowBackIcon from '@rsuite/icons/ArowBack'
import './toolbar.scss'
import { Button } from '../../atoms'

interface Props {
  options: { label: string; value: string; onClick: () => void }[]
  buttonName?: string
  backbuttonName?: string
  onButtonClick?: () => void
  onBackButtonClick?: () => void
  total?: number
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
}

const Toolbar: React.FC<Props> = ({
  options,
  buttonName,
  onButtonClick,
  backbuttonName,
  onBackButtonClick,
  total,
  onSearchChange,
  searchPlaceholder = 'Search',
}) => {
  const [active, setActive] = useState(options[0]?.value)
  const [searchValue, setSearchValue] = useState('')

  const debounceDelay = 300
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchValue)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchValue)
    }, debounceDelay)

    return () => {
      clearTimeout(handler)
    }
  }, [searchValue])

  useEffect(() => {
    onSearchChange?.(debouncedSearchTerm)
  }, [debouncedSearchTerm, onSearchChange])

  const onNavSelect = (
    activeKey: string,
    option: { label: string; value: string; onClick: () => void },
  ) => {
    setActive(activeKey)
    option.onClick()
  }
  let panelClass = 'toolbar-right-panel'

  if (onSearchChange && buttonName) {
    panelClass += ' both-present'
  } else if (onSearchChange) {
    panelClass += ' only-search'
  } else if (buttonName) {
    panelClass += ' only-button'
  }
  return (
    <div className='toolbar'>
      <div className='toolbar-left'>
        <Nav appearance='subtle' activeKey={active} style={{ marginRight: 10 }}>
          {options.map(option => (
            <Nav.Item
              key={option.value}
              eventKey={option.value}
              onClick={() => onNavSelect(option.value, option)}>
              {option.label}
            </Nav.Item>
          ))}
        </Nav>
        {total && <div className='toolbar-totals'>Total {total}</div>}
      </div>
      <div className={panelClass}>
        {onSearchChange && (
          <div className='toolbar-search'>
            <InputGroup size='md'>
              <Input
                placeholder={searchPlaceholder}
                onChange={(value: string) => setSearchValue(value)}
              />
              <InputGroup.Addon>
                <SearchIcon />
              </InputGroup.Addon>
            </InputGroup>
          </div>
        )}
        {buttonName && (
          <Button
            className='toolbar-btn'
            appearance='primary'
            startIcon={<PlusIcon />}
            onClick={onButtonClick}>
            {buttonName}
          </Button>
        )}
        {backbuttonName && (
          <Button
            className='toolbar-btn'
            appearance='primary'
            startIcon={<ArowBackIcon />}
            onClick={onBackButtonClick}>
            {backbuttonName}
          </Button>
        )}
      </div>
    </div>
  )
}

export default Toolbar
