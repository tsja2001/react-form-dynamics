import { memo } from 'react'
import { chartDataList } from './chartDataList'
import style from './Dnd.module.scss'
import Grid from './Grid/Grid'

const Dnd = () => {
  const dashboard = [
    [{ id: '1-1' }, { id: '1-2' }, { id: '1-3' }],
    [{ id: '2-1' }, { id: '2-2' }, { id: '2-3' }],
    [{ id: '3-1' }, { id: '3-2' }, { id: '3-3' }],
  ]

  // 开始拖拽
  function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id)
  }

  // 拖拽过程中
  function handleDragOver(event) {
    event.preventDefault()
  }

  // 做拽后抬起鼠标时
  function handleDrop(event) {
    event.preventDefault()
    const data = event.dataTransfer.getData('text/plain')
    console.log(data)
  }

  // 拖拽移动过元素时
  function handleDragEnter(event) {
    event.preventDefault()
    console.log('拖拽进入元素时🫠', event.target)
  }

  // 拖拽移出元素时
  function handleDragLeave(event) {
    event.preventDefault()
    console.log('拖拽移出元素时😡', event.target)
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
              onDragStart={handleDragStart}
              draggable={true}
            >
              <span>{item.name}</span>
            </div>
          ))}
        </div>
        <div
          className={style.center}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
        >
          <div className={style.grid}>
            <div className={style.grid_item}>1</div>
            <div className={style.grid_item}>2</div>
            <div className={style.grid_item}>3</div>
            <div className={style.grid_item}>4</div>
            <div className={style.grid_item}>5</div>
            <div className={style.grid_item}>6</div>
            <div className={style.grid_item}>7</div>
            <div className={style.grid_item}>8</div>
            <div className={style.grid_item}>9</div>
          </div>
        </div>
      </div>
      <Grid></Grid>
    </>
  )
}

export default memo(Dnd)
