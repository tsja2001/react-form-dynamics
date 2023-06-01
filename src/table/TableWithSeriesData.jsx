import { memo } from 'react'
import { SheetComponent } from '@antv/s2-react'
import '@antv/s2-react/dist/style.min.css'
import DynamicChartCpn from '../charts/DynamicChartCpn'
import seriesColumnData from '../data/getChartMockData/seriesColumnData'
import seriesLineData from '../data/getChartMockData/seriesLineData'

const TableWithSeriesData = () => {
  const rawData = seriesColumnData

  return (
    <div>
      <h2>TableWithSeriesData</h2>
      <div style={{ height: '200px' }}>
        <DynamicChartCpn chartType="Line" {...rawData.chartConfig} />
      </div>
      <div style={{ paddingTop: '200px' }}>
        <SheetComponent
          dataCfg={{
            data: rawData.chartConfig.data,
            ...rawData.tableConfig.dataCfg,
          }}
          options={{
            ...rawData.tableConfig.options,
          }}
          // sheetType="table"
        />
      </div>
      ,
    </div>
  )
}

export default memo(TableWithSeriesData)
