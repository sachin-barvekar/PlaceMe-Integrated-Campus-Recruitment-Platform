import { FC } from 'react'
import './pageHeading.scss'

type Props = {
  title: string,
  description?: string
}
const PageHeading: FC<Props> = ({ title, description }: Props) => {
  return (
    <div className="page-heading">
      <h1 className="page-heading__title">{title}</h1>
      {description && (
        <p className="page-heading__description">{description}</p>
      )}
    </div>
  )
}
export default PageHeading
