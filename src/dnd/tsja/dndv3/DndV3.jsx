/* eslint-disable no-unused-vars */
import { useRef } from 'react'

import style from './DndV3.module.scss'
import { DASHBOARD_SIZE, DRAG_TYPE } from './constant'
import { chartDataList } from './chartDataList'
import useDimensions from '../../../hock/useDimensions'
import useForceUpdate from '../../../hock/useForceUpdate'
import { DragBar } from './component/dragBar/DragBar'
import { ChartList } from './chartList'

const DndV3 = () => {
  // 渲染的数据列表
  const chartlist = useRef(new ChartList(5, 3))
  // 整个图表的ref
  const dashboardRef = useRef(null)
  // 整个dashboard图表的宽高
  const dashboardSize = useDimensions(dashboardRef)
  // 当前拖拽数据
  const dragData = useRef({
    // 是否已经松开鼠标放下图表
    isDroped: false,
    // 一个网格内的图表数据, 也就是chartList的item
    chartData: null,
    // 开始拖拽时, 鼠标的位置[col, row]
    dragStartPosition: null,
    // 结束拖拽时的鼠标位置[col, row]
    drapEndPosition: null,
    // 当前正在拖动的数据来源, 有以下三种类型
    // fromList 从预览列表中拉取
    // fromDashboard 拖动dashboard内图表以调整位置
    // resize 拖动bar来调整大小
    type: null,
    // 拖拽的方向 up | left | down | right
    direction: null,
  })
  const forceUpdate = useForceUpdate()

  // 从list中选择图表拖动
  const dragChartStartFromList = (event, data) => {
    event.stopPropagation()
    dragData.current = { chartData: data, type: DRAG_TYPE.FROM_LIST }
  }

  // 从dashboard的item拖动以调整位置
  const dragChartStartFromDashboard = (event) => {
    // 获取鼠标当前位置[col, row]
    const mousePosintion = chartlist.current.getMousePosition(
      dashboardRef.current,
      [event.clientX, event.clientY]
    )

    dragData.current = {
      type: DRAG_TYPE.FROM_DASHBOARD,
      dragStartPosition: mousePosintion,
      drapEndPosition: mousePosintion,
      chartData: chartlist.current.findChartByPosition(mousePosintion),
    }
  }

  // 从dashboard的dragBar拖动以调整大小
  const dragResizeStartFromDragBar = (event, direction) => {
    // 阻止冒泡, 避免触发dashboard的拖动事件
    event.stopPropagation()

    // 获取鼠标当前位置[col, row]
    const mousePosintion = chartlist.current.getMousePosition(
      dashboardRef.current,
      [event.clientX, event.clientY]
    )

    dragData.current = {
      type: DRAG_TYPE.RESIZE,
      dragStartPosition: mousePosintion,
      drapEndPosition: mousePosintion,
      direction,
      chartData: chartlist.current.findChartByPosition(mousePosintion),
    }
  }

  // 鼠标拖动路过元素
  const dragOver = (event) => {
    event.preventDefault()
    event.stopPropagation()

    // 获取鼠标当前位置[col, row]
    const mousePosintion = chartlist.current.getMousePosition(
      dashboardRef.current,
      [event.clientX, event.clientY]
    )
    dragData.current.drapEndPosition = mousePosintion
  }

  // 鼠标松开, 结束拖动
  const chartChartDrop = (event) => {
    event.preventDefault()
    event.stopPropagation()

    const { type } = dragData.current
    dragData.current.isDroped = true

    switch (type) {
      // 从列表中拖动
      case DRAG_TYPE.FROM_LIST:
        dragChartDropFromList()
        break
      // 从dashboard中拖动
      case DRAG_TYPE.FROM_DASHBOARD:
        dragChartDropFromDashboard()
        break
      // 调整大小
      case DRAG_TYPE.RESIZE:
        resizeChartDropFromDragBar()
        break
    }

    dragData.current = null

    setTimeout(() => {
      forceUpdate()
    })
  }

  // 从列表中拖动图表到dashboard, 放下鼠标时的逻辑
  const dragChartDropFromList = () => {
    const { drapEndPosition, chartData } = dragData.current
    chartlist.current.updateChartDataByPosition(drapEndPosition, chartData)
  }

  // 从dashboard中拖动, 放下鼠标时的逻辑
  const dragChartDropFromDashboard = () => {
    const { dragStartPosition, drapEndPosition, chartData } = dragData.current

    const distanceX = drapEndPosition[0] - dragStartPosition[0]
    const distanceY = drapEndPosition[1] - dragStartPosition[1]

    const success = chartlist.current.moveChartByIdAndPosition(chartData.id, [
      distanceX,
      distanceY,
    ])
    if (!success) {
      console.log('拖动失败')
    }
  }

  // 调整大小, 放下鼠标时的逻辑
  const resizeChartDropFromDragBar = () => {
    const { dragStartPosition, drapEndPosition, chartData, direction } =
      dragData.current

    // 获取拖动的距离
    const distanceX = drapEndPosition[0] - dragStartPosition[0]
    const distanceY = drapEndPosition[1] - dragStartPosition[1]

    const success = chartlist.current.updateChartSizeById(
      chartData.id,
      [distanceX, distanceY],
      direction
    )
    if (!success) {
      console.log('大小调整失败')
    }
  }

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
                  onDragOver={dragOver}
                  className={style.gridItem}
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => {
                    console.log('dragData.current', dragData.current)
                    console.log('chartlist.current', chartlist.current)
                  }}
                >
                  {(() => {
                    const chartItem = chartlist.current.findChartByStartPoint([
                      colIndex,
                      rowIndex,
                    ])

                    // 如果当前位置有元素, 显示元素
                    if (chartItem) {
                      return (
                        <div
                          className={style.chartItem}
                          draggable={true}
                          style={{
                            width:
                              (dashboardSize.width / DASHBOARD_SIZE[0]) *
                                chartItem.width ?? 'auto',
                            height:
                              (dashboardSize.height / DASHBOARD_SIZE[1]) *
                                chartItem.height ?? 'auto',
                          }}
                          // 拖拽item调整位置
                          onDragStart={(event) =>
                            dragChartStartFromDashboard(event)
                          }
                        >
                          <DragBar
                            onDragStart={(domEvent, direction) => {
                              dragResizeStartFromDragBar(domEvent, direction)
                            }}
                          />
                          {chartItem.chart.chart}
                        </div>
                      )
                    }
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

export default DndV3
