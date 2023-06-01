import { memo } from 'react'
import { SheetComponent } from '@antv/s2-react'
import { s2Data } from '../data/table/table_demo'
import '@antv/s2-react/dist/style.min.css'

const Table = () => {
  const s2Options = {
    width: 600,
    height: 600,
  }

  const s2DataConfig = {
    describe: '标准交叉表数据。',
    fields: {
      rows: ['province', 'city'],
      columns: ['type', 'sub_type'],
      values: ['number'],
      valueInCols: true,
    },
    meta: [
      {
        field: 'number',
        name: '数量',
      },
      {
        field: 'province',
        name: '省份',
      },
      {
        field: 'city',
        name: '城市',
      },
      {
        field: 'type',
        name: '类别',
      },
      {
        field: 'sub_type',
        name: '子类别',
      },
    ],
    data: s2Data.data,
    totalData: s2Data.totalData,
  }

  return (
    <div>
      <h2>Table</h2>
      <SheetComponent
        dataCfg={s2DataConfig}
        options={s2Options}
        // sheetType="table"
      />
      ,
    </div>
  )
}

export default memo(Table)
