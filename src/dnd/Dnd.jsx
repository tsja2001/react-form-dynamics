import { memo, useRef, useState } from 'react'
import { chartDataList } from './chartDataList'
import style from './Dnd.module.scss'

const Dnd = () => {
  const dragData = useRef(null)
  const dropIndex = useRef(null)

  const [itemList, setItemList] = useState([
    {
      id: 1,
      name: 'Chart 1',
    },
  ])

  function handleDragStart(event, data) {
    dragData.current = data
  }

  function handleDragOver(event, index) {
    event.preventDefault()
    dropIndex.current = index
  }

  function handleDrop(event) {
    event.preventDefault()

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
                className={`${style.grid_item} ${style.grid_item}${item?.id}`}
              >
                {item?.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(Dnd)
