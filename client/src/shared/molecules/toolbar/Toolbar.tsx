import React, { useState, useEffect } from 'react'
import { Nav, Input, InputGroup } from 'rsuite'
import PlusIcon from '@rsuite/icons/Plus'
import './toolbar.scss'
import { Button, SelectDropdown } from '../../atoms'

interface Props {
  options: { label: string, value: string, onClick: () => void }[];
  buttonName?: string;
  onButtonClick?: () => void;
  total?: number;
  onSearchChange?: (value: string) => void;
  onDropdownSelect?: (value: string) => void;
}

const Toolbar: React.FC<Props> = ({
  options,
  buttonName,
  onButtonClick,
  total,
  onSearchChange,
  onDropdownSelect
}) => {
  const [selectedValue, setSelectedValue] = useState('name')
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
    option: { label: string, value: string, onClick: () => void }
  ) => {
    setActive(activeKey)
    option.onClick()
  }

  const handleDropdownChange = (value: string) => {
    setSelectedValue(value)
    onDropdownSelect?.(value)
  }

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <Nav appearance="subtle" activeKey={active} style={{ marginRight: 10 }}>
          {options.map((option) => (
            <Nav.Item
              key={option.value}
              eventKey={option.value}
              onClick={() => onNavSelect(option.value, option)}
            >
              {option.label}
            </Nav.Item>
          ))}
        </Nav>
        <div className="toolbar-totals">
          <span>Total {total}</span>
        </div>
      </div>
      <div className="toolbar-right-pane">
        {onDropdownSelect && (
          <div>
            <SelectDropdown
              searchable={false}
              value={selectedValue}
              onChange={handleDropdownChange}
              data={[
                { label: 'Name', value: 'name' },
                { label: 'Email', value: 'email' },
                { label: 'Mobile', value: 'mobile' }
              ]}
            />
          </div>
        )}
        {onSearchChange && (
          <div className="toolbar-search">
            <InputGroup size="md" style={{ maxWidth: 180, margin: 10 }}>
              <Input
                placeholder="Search"
                onChange={(value: string) => setSearchValue(value)}
              />
            </InputGroup>
          </div>
        )}
        {buttonName && (
          <Button
            className="toolbar-btn"
            startIcon={<PlusIcon />}
            onClick={onButtonClick}
          >
            {buttonName}
          </Button>
        )}
      </div>
    </div>
  )
}

export default Toolbar
