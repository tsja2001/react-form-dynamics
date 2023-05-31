import LineDemo from '../charts/LineDemo'
import ColumnDemo from '../charts/ColumnDemo'
import PieDemo from '../charts/PieDemo'

export const chartDataList = [
  {
    id: 1,
    name: 'LineDemo Chart 1111',
    chart: ({ style }) => {
      console.log('style', style)
      return (
        <div style={style}>
          <LineDemo />
        </div>
      )
    },
  },
  {
    id: 2,
    name: 'ColumnDemo Chart 2',
    chart: ({ style = {} }) => (
      <div style={style}>
        <ColumnDemo />
      </div>
    ),
  },
  {
    id: 3,
    name: 'PieDemo Chart 3',
    chart: ({ style = {} }) => (
      <div style={style}>
        <PieDemo />
      </div>
    ),
  },
  {
    id: 4,
    name: 'ColumnDemo Chart 4',
    chart: ({ style = {} }) => (
      <div style={style}>
        <ColumnDemo />
      </div>
    ),
  },
  {
    id: 5,
    name: 'PieDemo Chart 5',
    chart: ({ style = {} }) => (
      <div style={style}>
        <PieDemo />
      </div>
    ),
  },
  {
    id: 6,
    name: 'LineDemo Chart 6',
    chart: ({ style = {} }) => (
      <div style={style}>
        <LineDemo />
      </div>
    ),
  },
]
