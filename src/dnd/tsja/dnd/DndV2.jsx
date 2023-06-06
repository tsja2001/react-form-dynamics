import { useRef, useState } from 'react'
import style from './DndV2.module.scss'
import { chartDataList } from './chartDataList'
import {
  deleteChartAtPosition,
  getChartAtPosition,
} from './utils/checkElementOverlap'

const DndV2 = () => {
  // 渲染的数据列表
  const [chartList, setChartList] = useState([])
  // 当前拖拽数据
  const dragData = useRef(null)
  // 当前鼠标拖动的元素, 要放置的目标索引
  const dropIndex = useRef(null)
  // 当拖动item时调整位置时, 记录当前拖动的元素位置, 用于拖动结束后删除元素
  const dragItemPosition = useRef(null)

  // 从list中选择图表拖动
  const handleDragStart = (event, data) => {
    dragData.current = data
  }

  // 拖动item调整位置
  const handleDragItemStart = (event, [col, row]) => {
    // 获取当前拖动的元素
    const targetElement = getChartAtPosition(chartList, [col, row])
    // 记录当前拖动的元素位置, 用于拖动结束后删除元素
    dragItemPosition.current = [col, row]
    // 将正在拖动的元素设置到dragData中
    if (targetElement) {
      dragData.current = { ...targetElement.chart }
    }
  }

  // 鼠标拖动路过元素
  const handleDragOver = (event, index, item) => {
    event.preventDefault()
    event.stopPropagation()
    dropIndex.current = index
  }

  // 鼠标松开, 结束拖动
  const handleDrop = (event) => {
    event.preventDefault()
    event.stopPropagation()

    let newChartList = [...chartList]

    // 查看要放置的位置是否已经有元素
    const targetElement = getChartAtPosition(newChartList, dropIndex.current)

    // 如果没有元素, 直接放置
    if (!targetElement) {
      const currentItem = {
        chart: dragData.current,
        width: 1,
        height: 1,
        startCol: dropIndex.current[0],
        startRow: dropIndex.current[1],
        endCol: dropIndex.current[0],
        endRow: dropIndex.current[1],
      }

      // setChartList([...chartList, currentItem])
      newChartList.push(currentItem)
    }

    // 如果有元素, 进行替换
    if (targetElement) {
      targetElement.chart = dragData.current
      // setChartList(() => [...chartList])

    }

    // 如果是拖动item调整位置, 则删除原来的元素
    if (dragItemPosition.current) {
        newChartList = deleteChartAtPosition(
          newChartList,
          dragItemPosition.current
        )
    }

    setChartList([...newChartList])

    dragData.current = null
    dropIndex.current = null
    dragItemPosition.current = null
  }
  return (
    <div className={style.content}>
      <div className={style.chartList}>
        {chartDataList.map((item, index) => (
          <div
            id={item.id}
            key={index}
            className={style.item}
            onDragStart={(event) => handleDragStart(event, item)}
            draggable={true}
          >
            <span>{item.name}</span>
          </div>
        ))}
      </div>
      <div className={style.dashboardWrap}>
        {Array.from({ length: 3 }).map((item, rowIndex) => {
          return Array.from({ length: 4 }).map((item, colIndex) => {
            return (
              <div
                draggable={true}
                // 拖拽item调整位置
                onDragStart={(event) =>
                  handleDragItemStart(event, [colIndex, rowIndex])
                }
                // 松开鼠标, 放下元素
                onDrop={handleDrop}
                // 路过元素, 记录位置
                onDragOver={(event) =>
                  handleDragOver(event, [colIndex, rowIndex], item)
                }
                className={style.gridItem}
                key={`${rowIndex}-${colIndex}`}
              >
                <div className={style.chartItem}>
                  {
                    chartList.find((item) => {
                      if (
                        item.startCol === colIndex &&
                        item.startRow === rowIndex
                      ) {
                        return true
                      }
                    })?.chart?.chart
                  }
                </div>
              </div>
            )
          })
        })}
      </div>
    </div>
  )
}

export default DndV2
