import { memo, useEffect, useRef, useState } from 'react'
import { chartDataList } from './chartDataList'
import style from './Dnd.module.scss'

const Dnd = () => {
  const dragData = useRef(null)
  const currentActionType = useRef(null)

  const [itemList, setItemList] = useState([
    {
      id: 1,
      name: 'Chart 1',
    },
  ])
  // 开始拖拽
  function handleDragStart(event, data) {
    dragData.current = data
  }

  // 拖拽过程中
  function handleDragOver(event) {
    event.preventDefault()

    const target = event.target
    if (target.classList.contains(style.grid)) {
      // 当前鼠标在父容器元素上
      // console.log('拖动到父容器元素上')
      currentActionType.current = 'parent'
    } else if (target.classList.contains(style.grid_item)) {
      // 当前鼠标在子元素上
      // console.log('拖动到子元素上')
      currentActionType.current = 'item'
    }
  }

  // (父容器)做拽后抬起鼠标时 => 新增图表
  function handleParentDrop(event) {
    event.preventDefault()
    const res = dragData.current
    console.log('res', res)
    dragData.current = null

    const target = event.target
    if (target.classList.contains(style.grid_item)) {
      // 当前鼠标在子元素上
      console.log('拖动到子元素上')
      currentActionType.current = 'item'
      console.log('target', target)
    } else {
      // 当前鼠标在父容器元素上
      console.log('拖动到父容器元素上')
      currentActionType.current = 'parent'
      setItemList((prev) => {
        return [...prev, res]
      })
    }
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
          onDragOver={handleDragOver}
          onDrop={(event) => handleParentDrop(event)}
          // onDragEnter={(event) => handleParentDragEnter(event)}
          // onDragLeave={(event) => handleParentDragLeave(event)}
        >
          <div className={style.grid}>
            {itemList.map((item, index) => (
              <div
                // onDrop={(event, index) => handleItemDrop(event, index)}
                key={index}
                // onDragEnter={(event) => handleItemDragEnter(event)}
                className={`${style.grid_item} ${style.grid_item}${item.id}`}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(Dnd)
