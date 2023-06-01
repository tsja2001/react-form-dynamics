import { memo } from 'react'
import { PivotSheet } from '@antv/s2'
import { SheetComponent } from '@antv/s2-react';
import { s2Data } from '../data/table/table_demo'
import '@antv/s2-react/dist/style.min.css';

const Table = () => {
  const s2Options = {
    width: 600,
    height: 600,
  }

  const s2DataConfig = {
    fields: {
      columns: ['province', 'city', 'type', 'price', 'cost'],
    },
    meta: [
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
        name: '商品类别',
      },
      {
        field: 'price',
        name: '价格',
      },
      {
        field: 'cost',
        name: '成本',
      },
    ],
    data: s2Data,
  };

  return (
    <div>
      <h2>Table</h2>
      <SheetComponent
        dataCfg={s2DataConfig}
        options={s2Options}
        sheetType="table"
      />
      ,
    </div>
  )
}

export default memo(Table)
