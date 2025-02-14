import React from 'react'
import { BarChart as RsuiteBarChart } from '@rsuite/charts'

interface BarChartProps {
  data: Array<any>;
}

const BarChart: React.FC<BarChartProps> = ({ data = [], ...rest }) => {
  const processData = (Data: Array<any>): Array<any> => {
    if (Array.isArray(data)) {
      if (typeof Data[0] === 'object' && !Array.isArray(data[0])) {
        return Data.map((item: any) => {
          const keys = Object.keys(item)
          return [item[keys[0]], item[keys[1]]]
        })
      }
      return Data
    }
    if (typeof data === 'object') {
      return Object.entries(data)
    }
    return []
  }

  const chartData = processData(data)

  return (
    <div className="pie-chart-container">
      <RsuiteBarChart data={chartData} {...rest} />
    </div>
  )
}

export default BarChart
