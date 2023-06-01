import { memo } from 'react'
import { SheetComponent } from '@antv/s2-react'
import lineData from '../data/getChartMockData/lineData'
import '@antv/s2-react/dist/style.min.css'
import DynamicChartCpn from '../charts/DynamicChartCpn'

const TableWithSingleData = () => {
  const s2Options = {
    width: 600,
    height: 600,
  }

  const s2DataConfig = {
    fields: {
      columns: ['key', 'value'],
    },
    meta: lineData.chartConfig.metaConf,
    data: lineData.chartConfig.data,
  }

  return (
    <div>
      <h2>TableWithSingleData</h2>
      <div style={{ height: '200px' }}>
        <DynamicChartCpn chartType="Line" {...lineData.chartConfig} />
      </div>
      <div style={{ paddingTop: '200px' }}>
        <SheetComponent
          dataCfg={s2DataConfig}
          options={s2Options}
          sheetType="table"
        />
      </div>
      ,
    </div>
  )
}

export default memo(TableWithSingleData)
