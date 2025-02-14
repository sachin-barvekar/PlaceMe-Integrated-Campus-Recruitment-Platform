import React from 'react'
import { PieChart as RsuitePieChart } from '@rsuite/charts'

interface PieChartProps {
  data: Array<any>;
}

const PieChart: React.FC<PieChartProps> = ({ data = [], ...rest }) => {
  const processData = (Data: Array<any>): Array<any> => {
    if (Array.isArray(Data)) {
      if (typeof Data[0] === 'object' && !Array.isArray(Data[0])) {
        return data.map((item: any) => {
          const keys = Object.keys(item)
          return [item[keys[0]], item[keys[1]]]
        })
      }
      return Data
    }
    if (typeof Data === 'object') {
      return Object.entries(Data)
    }
    return []
  }
  const chartData = processData(data)

  return (
    <div className="pie-chart-container">
      <RsuitePieChart
        data={chartData}
        {...rest}
        legend={false}
        startAngle={120}
      />
    </div>
  )
}

export default PieChart
