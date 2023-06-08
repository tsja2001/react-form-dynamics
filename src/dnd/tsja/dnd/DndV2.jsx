import { useRef, useState } from 'react'
import style from './DndV2.module.scss'
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

  // 从list中选择图表拖动
  const dragChartStartFromList = (event, data) => {
    dragData.current = new DashboardChartItem(data)
  }

  // 从dashboard的item拖动以调整位置
  const dragChartStartFromDashboard = (event, [col, row]) => {
    // 获取当前拖动的元素
    const targetElement = getChartAtPosition(chartList, [col, row])
    // 记录当前拖动的元素位置, 用于拖动结束后删除元素
    dragItemPosition.current = [col, row]
    // 将正在拖动的元素设置到dragData中
    if (targetElement) {
      dragData.current = { ...targetElement }
    }
    dragStartPoint.current = getColAndRow(
      dashboardRef.current,
      [event.clientX, event.clientY],
      DASHBOARD_SIZE
    )
  }

  // 从dashboard的dragBar拖动以调整大小 (todo考虑和拖动调整位置合并)
  const dragResizeStartFromDragBar = (event, [col, row], position) => {
    resizeDirection.current = position

    const targetElement = getChartAtPosition(chartList, [col, row])
    // 记录当前拖动的元素位置
    dragItemPosition.current = [col, row]
    // 将正在拖动的元素设置到dragData中
    if (targetElement) {
      dragData.current = { ...targetElement.chart }
    }
  }

  // 鼠标拖动路过元素
  const dragOver = (event, index) => {
    event.preventDefault()
    event.stopPropagation()
    dropPosition.current = index
  }

  // 鼠标松开, 结束拖动
  const chartChartDrop = (event) => {
    event.preventDefault()
    event.stopPropagation()

    let newChartList = [...chartList]
    // 查看要放置的位置是否已经有元素
    let targetElement = getChartAtPosition(newChartList, dropPosition.current)

    // 如果是调整大小
    if (resizeDirection.current) {
      newChartList = resizeChartOnDragOver(event, newChartList)
    }
    // 如果是拖动图表
    else {
      // 如果要放置的位置没有元素, 判断拖拽后的元素放之后是否会和其他元素重叠(比如拖动一个宽度为2的元素, 放置在一个宽度为1的元素后面)
      if (!targetElement) {
        newChartList = dragChartOnDragOver(newChartList)
      }

      // 如果要放置的位置有元素
      if (targetElement) {
        // 如果要放置的位置的元素和拖动的元素不是同一个元素, 直接替换
        if (targetElement.id !== dragData.current.id) {
          newChartList = updateChartAtPosition(
            newChartList,
            dropPosition.current,
            dragData.current
          )
        }
        // 如果要放置的位置的元素和拖动的元素是同一个元素, 此时可能是调整一个元素的位置. 这个元素的宽或者高必须大于1
        else {
          newChartList = dragChartSelfOnDragOver(newChartList)
        }
      }

      // 如果是拖动item调整位置
      if (dragItemPosition.current) {
        // todo 优化掉dragItemPosition变量
        console.log(dragItemPosition.current)
        console.log(dragData.current)
        // 判读拖动item是否在原位置, 如果不在, 删除原位置的元素
        if (
          dragItemPosition.current[0] !== dropPosition.current[0] ||
          dragItemPosition.current[1] !== dropPosition.current[1]
        ) {
          newChartList = deleteChartAtPosition(
            newChartList,
            dragItemPosition.current
          )
        }
      }
    }

    setChartList([...newChartList])

    dragData.current = null
    dropPosition.current = null
    dragItemPosition.current = null
    resizeDirection.current = null
  }

  // 拖动调整大小
  const resizeChartOnDragOver = (domEvent, chartListProp) => {
    // 获取将要拖动到的位置
    const dropLocation = getColAndRow(
      dashboardRef.current,
      [domEvent.clientX, domEvent.clientY],
      DASHBOARD_SIZE
    )

    // 调整大小(已经在resizeChart中处理了越界的情况)
    const resizedChartList = resizeChart(
      chartListProp,
      dropLocation,
      dragData.current,
      resizeDirection.current
    )

    return resizedChartList
  }

  // 放置元素
  const dragChartOnDragOver = (chartListProp) => {
    const cloneDragData = { ...dragData.current }
    const cloneChartListProp = [...chartListProp]

    cloneDragData.startCol = dropPosition.current[0]
    cloneDragData.startRow = dropPosition.current[1]
    cloneDragData.endCol = dropPosition.current[0] + cloneDragData.width - 1
    cloneDragData.endRow = dropPosition.current[1] + cloneDragData.height - 1

    // 判断拖拽后的元素是否超越dashboard的边界
    const isOutDashboard = isChartOutDashboard(cloneDragData, DASHBOARD_SIZE)

    // 如果当前拖拽的元素长或者宽大于1, 则需要判断拖拽后的元素是否会和其他元素重叠
    const chartListWithoutDragItem = chartList.filter((item) => {
      return item.id !== dragData.current.id
    })

    const isOverlap = checkElementOverlap(
      chartListWithoutDragItem,
      cloneDragData
    )

    if (isOutDashboard) {
      console.log('放在此位置会超出边界')
      cloneChartListProp.push(dragData.current)
    } else if (isOverlap) {
      console.log('放在此位置会重叠')
      cloneChartListProp.push(dragData.current)
    } else {
      cloneChartListProp.push(cloneDragData)
    }

    return cloneChartListProp
  }

  // 放置一个长或者宽大于1的元素, 比如拖动一个宽度为2的元素, 向右拖动了一个
  const dragChartSelfOnDragOver = (chartListProp) => {
    let cloneChartListProp = [...chartListProp]
    const cloneDragData = { ...dragData.current }

    const dropLocation = getColAndRow(
      dashboardRef.current,
      [event.clientX, event.clientY],
      DASHBOARD_SIZE
    )
    cloneDragData.startCol = dropLocation[0]
    cloneDragData.startRow = dropLocation[1]
    cloneDragData.endCol = dropLocation[0] + cloneDragData.width - 1
    cloneDragData.endRow = dropLocation[1] + cloneDragData.height - 1

    // 判断拖拽后的元素是否超越dashboard的边界
    const isOutDashboard = isChartOutDashboard(cloneDragData, DASHBOARD_SIZE)
    if (isOutDashboard) {
      console.log('放在此位置会超出边界')
    } else {
      cloneChartListProp = deleteChartById(
        cloneChartListProp,
        dragData.current.id
      )
      cloneChartListProp.push(cloneDragData)
    }

    return cloneChartListProp
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
                  onDragOver={(event) => dragOver(event, [colIndex, rowIndex])}
                  className={style.gridItem}
                  key={`${rowIndex}-${colIndex}`}
                >
                  {(() => {
                    const chartItem = getChartAtStartPoint(chartList, [
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
                            dragChartStartFromDashboard(event, [
                              colIndex,
                              rowIndex,
                            ])
                          }
                        >
                          <DragBar
                            onDragStart={(domEvent, direction) => {
                              dragResizeStartFromDragBar(
                                domEvent,
                                [colIndex, rowIndex],
                                direction
                              )
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

export default DndV2
