import { render, screen, fireEvent } from '@testing-library/react'
import Toolbar from './Toolbar'

describe('MacrosToolbar', () => {
  const mockOptions = [
    { label: 'Option 1', value: 'option1', onClick: jest.fn() },
    { label: 'Option 2', value: 'option2', onClick: jest.fn() }
  ]

  it('renders the correct total', () => {
    render(
      <Toolbar
        options={mockOptions}
        total={5}
        buttonName="Test Button"
        onButtonClick={jest.fn()}
        onSearchChange={jest.fn()}
      />
    )
    expect(screen.getByText('Total 5')).toBeInTheDocument()
  })

  it('calls the correct onClick when a nav item is clicked', () => {
    render(
      <Toolbar
        options={mockOptions}
        total={5}
        buttonName="Test Button"
        onButtonClick={jest.fn()}
        onSearchChange={jest.fn()}
      />
    )
    fireEvent.click(screen.getByText('Option 2'))
    expect(mockOptions[1].onClick).toHaveBeenCalled()
  })
})
