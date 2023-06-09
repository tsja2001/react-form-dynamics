/* eslint-disable no-unused-vars */
import { useRef, useState } from 'react'
import style from './DndV3.module.scss'
import { chartDataList } from './chartDataList'
import { DASHBOARD_SIZE } from './constant'
import {
  DashboardChartItem,
  checkElementOverlap,
  deleteChartAtPosition,
  deleteChartById,
  getChartAtPosition,
  getChartAtStartPoint,
  getColAndRow,
  isChartOutDashboard,
  resizeChart,
  updateChartAtPosition,
} from './utils/checkElementOverlap'
import useDimensions from '../../../hock/useDimensions'
import { DragBar } from './component/dragBar/DragBar'
import { ChartListItem } from './chartList'

const DndV2 = () => {
  // 渲染的数据列表
  const [chartList, setChartList] = useState([])
  // 整个图表的ref
  const dashboardRef = useRef(null)
  // 整个dashboard图表的宽高
  const dashboardSize = useDimensions(dashboardRef)
  // 当前拖拽数据
  const dragData = useRef(null)
  // 鼠标从dashboard中开始拖拽时, 鼠标所在的位置(用于拖动长或者宽大大于1的元素时, 记录鼠标位置)
  const dragStartPoint = useRef(null)
  // 当前鼠标拖动的元素, 要放置的目标索引
  const dropPosition = useRef(null)
  // 当拖动item时调整位置时, 记录当前拖动的元素位置, 用于拖动结束后删除元素
  const dragItemPosition = useRef(null)
  // 记录要调整元素大小的调整方向
  const resizeDirection = useRef(null)

  // 测试
  const chartItem = useRef(new ChartListItem('aaa', 12))



  // 从list中选择图表拖动
  const dragChartStartFromList = (event, data) => {}

  // 从dashboard的item拖动以调整位置
  const dragChartStartFromDashboard = (event, [col, row]) => {}

  // 从dashboard的dragBar拖动以调整大小 (todo考虑和拖动调整位置合并)
  const dragResizeStartFromDragBar = (event, [col, row], position) => {}

  // 鼠标拖动路过元素
  const dragOver = (event, index) => {}

  // 鼠标松开, 结束拖动
  const chartChartDrop = (event) => {}

  return (
    <div className={style.content}>
      <div className={style.chartList}>
        {chartDataList.map((item, index) => (
          <div
            id={item.id}
            key={index}
            className={style.item}
            onDragStart={(event) => dragChartStartFromList(event, item)}
            draggable={true}
          >
            <span>{item.name}</span>
          </div>
        ))}
      </div>
      <button>撤回</button>
      <div>width: {dashboardSize.width}</div>
      <div>height: {dashboardSize.height}</div>
      <div
        className={style.dashboardWrap}
        ref={dashboardRef}
        style={{
          gridTemplateColumns: `repeat(${DASHBOARD_SIZE[0]}, 1fr)`,
          gridTemplateRows: `repeat(${DASHBOARD_SIZE[1]}, 1fr)`,
        }}
      >
        {Array.from({ length: DASHBOARD_SIZE[1] }).map((item, rowIndex) => {
          return Array.from({ length: DASHBOARD_SIZE[0] }).map(
            (item, colIndex) => {
              return (
                <div
                  // 松开鼠标, 放下元素
                  onDrop={chartChartDrop}
                  // 路过元素, 记录位置
                  onDragOver={(event) => dragOver(event, [colIndex, rowIndex])}
                  className={style.gridItem}
                  key={`${rowIndex}-${colIndex}`}
                >
                  {(() => {
                    // const chartItem = getChartAtStartPoint(chartList, [
                    //   colIndex,
                    //   rowIndex,
                    // ])
                    // // 如果当前位置有元素, 显示元素
                    // if (chartItem) {
                    //   return (
                    //     <div
                    //       className={style.chartItem}
                    //       draggable={true}
                    //       style={{
                    //         width:
                    //           (dashboardSize.width / DASHBOARD_SIZE[0]) *
                    //             chartItem.width ?? 'auto',
                    //         height:
                    //           (dashboardSize.height / DASHBOARD_SIZE[1]) *
                    //             chartItem.height ?? 'auto',
                    //       }}
                    //       // 拖拽item调整位置
                    //       onDragStart={(event) =>
                    //         dragChartStartFromDashboard(event, [
                    //           colIndex,
                    //           rowIndex,
                    //         ])
                    //       }
                    //     >
                    //       <DragBar
                    //         onDragStart={(domEvent, direction) => {
                    //           dragResizeStartFromDragBar(
                    //             domEvent,
                    //             [colIndex, rowIndex],
                    //             direction
                    //           )
                    //         }}
                    //       />
                    //       {chartItem.chart.chart}
                    //     </div>
                    //   )
                    // }
                  })()}
                </div>
              )
            }
          )
        })}
      </div>
    </div>
  )
}

export default DndV2
