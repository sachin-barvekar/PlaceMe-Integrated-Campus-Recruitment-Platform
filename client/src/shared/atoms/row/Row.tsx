import { Row as RsuiteRow } from 'rsuite'

type Props = {
  children: React.ReactNode
  className?: string
}
const Row = ({ children, className }: Props) => {
  const classes = ['section__row']
  if (className) {
    classes.push(className)
  }
  return (
    <RsuiteRow className={classes.join(' ')} gutter={16}>
      {children}
    </RsuiteRow>
  )
}
export default Row
