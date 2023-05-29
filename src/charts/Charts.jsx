import { Line } from '@ant-design/charts'
import { lineSeriseData } from '../data/line'

export const Charts = () => {
  const config = {
    title: {
      visible: true,
      text: '多折线图',
    },
    data: lineSeriseData,
    // data: lineData,
    xField: 'key',
    yField: 'value',
    seriesField: 'type',

    width: 648,
    height: 379,
    label: {},

    xAxis: {
      title: {
        text: 'xaaaassaasdfasfasfaa轴',
        position: 'start',
      },
      label: {
        autoRotate: true,
        autoHide: true,
        rotate: 0.3,
      },
      // line: null,
      tickLine: {},
    },
  }

  return <Line {...config}></Line>
}
