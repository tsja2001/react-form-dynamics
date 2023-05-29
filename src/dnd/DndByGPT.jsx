import { memo, useRef, useState } from 'react'
import { chartDataList } from './chartDataList'
import style from './Dnd.module.scss'
import LineDemo from '../charts/LineDemo'

const DndByGPT = () => {
  const dragData = useRef(null)
  const dropIndex = useRef(null)

  const [itemList, setItemList] = useState([
    {
      id: 1,
      name: 'Chart 1',
      chart: <LineDemo />,
    },
  ])

  function handleDragStart(event, data) {
    dragData.current = data
  }

  function handleDragOver(event, index) {
    event.preventDefault()
    event.stopPropagation()
    console.log('index', index)
    dropIndex.current = index
  }

  function handleDrop(event) {
    event.preventDefault()
    event.stopPropagation()

    const currentDropIndex = dropIndex.current
    const newItems = [...itemList]

    if (currentDropIndex !== null) {
      newItems[dropIndex.current] = dragData.current
    } else {
      newItems.push(dragData.current)
    }

    setItemList(newItems)

    // 清空拖拽数据和目标索引
    dragData.current = null
    dropIndex.current = null
  }

  return (
    <>
      <div className={style.content}>
        <div className={style.left}>
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
        <div
          className={style.center}
          onDragOver={(event) => handleDragOver(event, null)}
          onDrop={handleDrop}
        >
          <div className={style.grid}>
            {itemList.map((item, index) => (
              <div
                key={index}
                onDragOver={(event) => handleDragOver(event, index)}
                onDrop={handleDrop}
                className={`${style.grid_item} ${style.grid_item}${item.id}`}
              >
                <div className={style.chartWarp}>{item.chart}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={style.right}>
          <button>编辑</button>
        </div>
      </div>
    </>
  )
}

export default memo(DndByGPT)
