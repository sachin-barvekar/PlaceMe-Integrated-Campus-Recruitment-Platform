import React from 'react'
import { BarChart, PieChart, LineChart, ProgressCircle } from '../../atoms'
import './ChartScreen.scss'
import { ActionCell } from '../table/cells'

interface ChartScreenProps {
  chartType: 'bar' | 'pie' | 'line' | 'progress';
  title: string;
  data?: Array<any>;
  onAction?: (eventKey?: string, rowData?: any) => void;
  actionOptions?: any;
  Percent?: number;
  Status?: 'success' | 'fail' | 'active';
  strokeColor?: string;
}

const ChartScreen: React.FC<ChartScreenProps> = ({
  chartType,
  title,
  data = [],
  onAction,
  Percent,
  Status,
  actionOptions,
  strokeColor
}) => {
  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return <BarChart data={data} />
      case 'pie':
        return <PieChart data={data} />
      case 'line':
        return <LineChart data={data} />
      case 'progress':
        return (
          <ProgressCircle
            percent={Percent}
            status={Status}
            strokeColor={strokeColor}
          />
        )
      default:
        return <BarChart data={data} />
    }
  }

  return (
    <div className="chart-screen">
      <div className="chart-screen-title">
        <span>{title}</span>
        <div className="chart-screen-icon">
          <ActionCell
            rowData={data}
            dataKey="action"
            onAction={onAction}
            actionOptions={actionOptions}
            tooltip
          />
        </div>
      </div>
      {renderChart()}
    </div>
  )
}

export default ChartScreen
