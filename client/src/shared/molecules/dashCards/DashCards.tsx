import { FC } from 'react'
import { Stack } from 'rsuite'
import { DashCard } from '../../atoms'
import './dashCards.scss'

type CardData = {
  title: string,
  description: string | React.ReactNode,
  icon: string | JSX.Element | React.ReactNode
}

type Props = {
  data: CardData[],
  onCardClick?: (title: string) => void
}

const DashCards: FC<Props> = ({ data, onCardClick }: Props) => {
  return (
    <Stack
      spacing={15}
      justifyContent="space-between"
      alignItems="stretch"
      className="dash-cards"
    >
      {data.map(({ title, description, icon }) => (
        <DashCard
          key={title}
          title={title}
          description={description || ''}
          icon={icon}
          onClick={() => onCardClick?.(title)}
        />
      ))}
    </Stack>
  )
}

export default DashCards
