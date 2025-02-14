import { render, screen } from '@testing-library/react'
import Section from './Section'

describe('Section', () => {
  it('renders the title correctly', () => {
    const title = 'Test Title'
    render(<Section title={title}>Test Content</Section>)
    const sectionTitle = screen.getByText(title)
    expect(sectionTitle).toBeInTheDocument()
  })

  it('renders the children correctly', () => {
    const children = <div>Test Children</div>
    render(<Section title="Test Title">{children}</Section>)
    const sectionChildren = screen.getByText('Test Children')
    expect(sectionChildren).toBeInTheDocument()
  })
})
