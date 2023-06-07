import { useEffect, useRef, useState } from 'react'
import style from './DndV2.module.scss'
import { chartDataList } from './chartDataList'
import { DASHBOARD_SIZE, DIRECTIONS } from './constant'
import {
  DashboardChartItem,
  deleteChartAtPosition,
  getChartAtPosition,
  getChartAtStartPoint,
  getColAndRow,
  isChartOutDashboard,
  resizeChart,
  updateChartAtPosition,
} from './utils/checkElementOverlap'
import useDimensions from '../../../hock/useDimensions'

const DndV2 = () => {
  // 渲染的数据列表
  const [chartList, setChartList] = useState([])
  // 整个图表的ref
  const dashboardRef = useRef(null)
  // 整个dashboard图表的宽高
  const dashboardSize = useDimensions(dashboardRef)
  // 当前拖拽数据
  const dragData = useRef(null)
  // 当前鼠标拖动的元素, 要放置的目标索引
  const dropIndex = useRef(null)
  // 当拖动item时调整位置时, 记录当前拖动的元素位置, 用于拖动结束后删除元素
  const dragItemPosition = useRef(null)
  // 记录要调整元素大小的调整方向
  const resizeDirection = useRef(null)

  // 从list中选择图表拖动
  const dragChartStartFromList = (event, data) => {
    // dragData.current = data
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
    dropIndex.current = index
  }

  // 鼠标松开, 结束拖动
  const chartChartDrop = (event) => {
    event.preventDefault()
    event.stopPropagation()

    let newChartList = [...chartList]
    // 查看要放置的位置是否已经有元素
    let targetElement = getChartAtPosition(newChartList, dropIndex.current)

    // 如果是调整大小
    if (resizeDirection.current) {
      // 获取将要拖动到的位置
      const dropLocation = getColAndRow(dashboardRef.current, [
        event.clientX,
        event.clientY,
      ])

      // 调整大小(已经在resizeChart中处理了越界的情况)
      const resizedChartList = resizeChart(
        newChartList,
        dropLocation,
        dragData.current,
        resizeDirection.current
      )

      newChartList = resizedChartList
    } 
    // 如果是拖动图表
    else {
      

      // 如果要放置的位置没有元素, 直接放置
      if (!targetElement) {
        const cloneDragData = { ...dragData.current }

        cloneDragData.startCol = dropIndex.current[0]
        cloneDragData.startRow = dropIndex.current[1]
        cloneDragData.endCol = dropIndex.current[0] + cloneDragData.width - 1
        cloneDragData.endRow = dropIndex.current[1] + cloneDragData.height - 1

        // 判断拖拽后的元素是否超越dashboard的边界
        const isOutDashboard = isChartOutDashboard(
          cloneDragData,
          DASHBOARD_SIZE
        )

        if (isOutDashboard) {
          console.log('放在此位置会超出边界')
          newChartList.push(dragData.current)
        } else {
          newChartList.push(cloneDragData)
        }
      }

      // 如果要放置的位置有元素
      if (targetElement) {
        // 如果要放置的位置的元素和拖动的元素不是同一个元素, 直接替换
        // if (targetElement.id !== dragData.current.id) {

        // }

        console.log('targetElement === dragData.current', targetElement.id === dragData.current.id)
        newChartList = updateChartAtPosition(
          newChartList,
          dropIndex.current,
          dragData.current
        )
      }

      // 如果是拖动item调整位置
      if (dragItemPosition.current) {
        // 判读拖动item是否在原位置, 如果不在, 删除原位置的元素
        if (
          dragItemPosition.current[0] !== dropIndex.current[0] ||
          dragItemPosition.current[1] !== dropIndex.current[1]
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
    dropIndex.current = null
    dragItemPosition.current = null
    resizeDirection.current = null
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
      <div className={style.dashboardWrap} ref={dashboardRef}>
        {Array.from({ length: 3 }).map((item, rowIndex) => {
          return Array.from({ length: 4 }).map((item, colIndex) => {
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
                            (dashboardSize.width / 4) * chartItem.width ??
                            'auto',
                          height:
                            (dashboardSize.height / 3) * chartItem.height ??
                            'auto',
                        }}
                        // 拖拽item调整位置
                        onDragStart={(event) =>
                          dragChartStartFromDashboard(event, [
                            colIndex,
                            rowIndex,
                          ])
                        }
                      >
                        <div
                          onDragStart={(event) =>
                            dragResizeStartFromDragBar(
                              event,
                              [colIndex, rowIndex],
                              DIRECTIONS.UP
                            )
                          }
                          draggable={true}
                          className={`${style.dragBar} ${style.dragBarTop}`}
                        >
                          ⬆️
                        </div>
                        <div
                          onDragStart={(event) =>
                            dragResizeStartFromDragBar(
                              event,
                              [colIndex, rowIndex],
                              DIRECTIONS.RIGHT
                            )
                          }
                          draggable={true}
                          className={`${style.dragBar} ${style.dragBarRight}`}
                        >
                          ➡️
                        </div>
                        <div
                          onDragStart={(event) =>
                            dragResizeStartFromDragBar(
                              event,
                              [colIndex, rowIndex],
                              DIRECTIONS.DOWN
                            )
                          }
                          draggable={true}
                          className={`${style.dragBar} ${style.dragBarBotton}`}
                        >
                          ⬇️
                        </div>
                        <div
                          onDragStart={(event) =>
                            dragResizeStartFromDragBar(
                              event,
                              [colIndex, rowIndex],
                              DIRECTIONS.LEFT
                            )
                          }
                          draggable={true}
                          className={`${style.dragBar} ${style.dragBarLeft}`}
                        >
                          ⬅️
                        </div>
                        {chartItem.chart.chart}
                      </div>
                    )
                  }
                })()}
              </div>
            )
          })
        })}
      </div>
    </div>
  )
}

export default DndV2
