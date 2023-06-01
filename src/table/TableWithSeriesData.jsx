import { memo } from 'react'
import { SheetComponent } from '@antv/s2-react'
import '@antv/s2-react/dist/style.min.css'
import DynamicChartCpn from '../charts/DynamicChartCpn'
import seriesColumnData from '../data/getChartMockData/seriesColumnData'
import seriesLineData from '../data/getChartMockData/seriesLineData'

const TableWithSeriesData = () => {
  const rawData = seriesColumnData

  const s2Options = {
    width: 600,
    height: 600,
    // 对于列数据只有一列的情况，需要设置为 grid
    hierarchyType: 'grid'
  }

  const s2DataConfig = {
    fields: {
      rows: ['key','type'],
      // columns: [null],
      values: ['value'],
      // valuesInCols: true,
    },
    hierarchyType: 'tree',
    meta: rawData.chartConfig.metaConf,
    data: rawData.chartConfig.data,
  }

  return (
    <div>
      <h2>TableWithSeriesData</h2>
      <div style={{ height: '200px' }}>
        <DynamicChartCpn chartType="Line" {...rawData.chartConfig} />
      </div>
      <div style={{ paddingTop: '200px' }}>
        <SheetComponent
          dataCfg={s2DataConfig}
          options={s2Options}
          // sheetType="table"
        />
      </div>
      ,
    </div>
  )
}

export default memo(TableWithSeriesData)
