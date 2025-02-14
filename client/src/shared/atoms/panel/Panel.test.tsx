import { render, screen } from '@testing-library/react'
import React from 'react'
import Panel from './Panel'

describe('Panel', () => {
  it('renders the panel with title and children', () => {
    render(
      <Panel title="Test Panel">
        <div>Test Content</div>
      </Panel>
    )
    expect(screen.getByText('Test Panel')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('renders the panel without title', () => {
    render(
      <Panel>
        <div>Test Content</div>
      </Panel>
    )
    expect(screen.queryByText('Test Panel')).toBeNull()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })
})
