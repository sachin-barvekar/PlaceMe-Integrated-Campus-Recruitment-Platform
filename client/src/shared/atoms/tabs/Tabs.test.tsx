import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import Tabs from './Tabs'

describe('Tabs', () => {
  it('renders the tabs with children', () => {
    render(
      <Tabs>
        <Tabs.Tab title="Tab 1">Content 1</Tabs.Tab>
        <Tabs.Tab title="Tab 2">Content 2</Tabs.Tab>
      </Tabs>
    )
    expect(screen.getByText('Tab 1')).toBeInTheDocument()
    expect(screen.getByText('Tab 2')).toBeInTheDocument()
    expect(screen.getByText('Content 1')).toBeInTheDocument()
    expect(screen.getByText('Content 2')).toBeInTheDocument()
  })

  it('switches tabs when clicked', () => {
    render(
      <Tabs defaultActiveKey="1">
        <Tabs.Tab eventKey="1" title="Tab 1">
          Content 1
        </Tabs.Tab>
        <Tabs.Tab eventKey="2" title="Tab 2">
          Content 2
        </Tabs.Tab>
      </Tabs>
    )
    const tab1 = screen.getByText('Tab 1')
    const tab2 = screen.getByText('Tab 2')
    const content1 = screen.getByText('Content 1')
    const content2 = screen.queryByText('Content 2')

    expect(content1).toBeVisible()
    expect(content2).not.toBeVisible()

    fireEvent.click(tab2)

    expect(content1).not.toBeVisible()
    expect(content2).toBeVisible()

    fireEvent.click(tab1)

    expect(content1).toBeVisible()
    expect(content2).not.toBeVisible()
  })
})
