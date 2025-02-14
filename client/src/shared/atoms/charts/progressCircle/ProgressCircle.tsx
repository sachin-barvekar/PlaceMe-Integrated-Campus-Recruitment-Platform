import React from 'react'
import { Progress } from 'rsuite'

interface ProgressCircleProps {
  percent?: number;
  strokeColor?: string;
  status?: 'success' | 'fail' | 'active';
  showInfo?: boolean;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  percent = 0,
  strokeColor,
  status,
  showInfo = true
}) => {
  return (
    <div>
      <Progress.Circle
        percent={percent}
        strokeColor={strokeColor}
        status={status}
        showInfo={showInfo}
      />
    </div>
  )
}

export default ProgressCircle
