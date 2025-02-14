import { render, screen } from '@testing-library/react'
import Row from './Row'

describe('Row', () => {
  it('renders children correctly', () => {
    render(
      <Row>
        <div>Child 1</div>
        <div>Child 2</div>
      </Row>
    )

    expect(screen.getByText('Child 1')).toBeInTheDocument()
    expect(screen.getByText('Child 2')).toBeInTheDocument()
  })

  it('applies custom className correctly', () => {
    render(<Row className="custom-class">{undefined}</Row>)

    expect(screen.getByRole('row')).toHaveClass('custom-class')
  })
})
