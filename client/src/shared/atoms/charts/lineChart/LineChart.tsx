import React from 'react'
import { LineChart as RsuiteLineChart } from '@rsuite/charts'

interface LineChartProps {
  data: Array<any>;
}

const LineChart: React.FC<LineChartProps> = ({ data = [], ...rest }) => {
  const processData = (Data: Array<any>): Array<any> => {
    if (Array.isArray(Data)) {
      if (typeof Data[0] === 'object' && !Array.isArray(data[0])) {
        return data.map((item: any) => {
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
    <div className="line-chart-container">
      <RsuiteLineChart data={chartData} {...rest} />
    </div>
  )
}

export default LineChart
