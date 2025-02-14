import React from 'react'
import { Button } from 'rsuite'
import './dashCard.scss'

interface DashCardProps {
  title: string;
  description: string | React.ReactNode;
  icon: string | JSX.Element | React.ReactNode;
  onClick?: () => void;
}

const DashCard: React.FC<DashCardProps> = ({
  title,
  description,
  icon,
  onClick
}) => {
  return (
    <Button className="dash-card" onClick={onClick}>
      <div className="dash-card__icon-wrapper">
        {typeof icon === 'string' ? (
          <img src={icon} alt="icon" className="dash-card__icon" />
        ) : (
          <div className="dash-card__icon">{icon}</div>
        )}
      </div>
      <div className="dash-card__content">
        <h2 className="dash-card__title">{title}</h2>
        <p className="dash-card__description">{description}</p>
      </div>
    </Button>
  )
}

export default DashCard
