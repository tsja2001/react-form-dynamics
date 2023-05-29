import { memo } from 'react'
// import GridLayout from 'react-grid-layout'
import { Responsive, WidthProvider } from 'react-grid-layout'
import style from './Grid.module.scss'

const GridLayout = WidthProvider(Responsive)

const Grid = () => {
  const layout = [
    { i: '1', x: 0, y: 0, w: 1, h: 1 },
    { i: '2', x: 1, y: 0, w: 1, h: 1 },
    { i: '3', x: 2, y: 0, w: 1, h: 1 },
    { i: '4', x: 0, y: 1, w: 1, h: 1 },
    { i: '5', x: 1, y: 1, w: 1, h: 1 },
    { i: '6', x: 2, y: 1, w: 1, h: 1 },
    { i: '7', x: 0, y: 2, w: 1, h: 1 },
    { i: '8', x: 1, y: 2, w: 1, h: 1 },
    { i: '9', x: 2, y: 2, w: 1, h: 1 },
  ]

  const handleDragStop = (layout) => {
    console.log('拖拽停止后的布局:', layout)
    // 在这里可以处理拖拽停止后的布局
  }

  const handleResizeStop = (layout) => {
    console.log('大小调整停止后的布局:', layout)
    // 在这里可以处理大小调整停止后的布局
  }

  return (
    <GridLayout
      className={style.content}
      layouts={{ lg: layout }}
      cols={{ lg: 3, md: 3, sm: 3 }}
      rowHeight={100}
      draggableHandle=".drag-handle"
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
    >
      <div key="1" className={style.grid_item}>
        <div className="drag-handle">1</div>
      </div>
      <div key="2" className={style.grid_item}>
        <div className="drag-handle">2</div>
      </div>
      <div key="3" className={style.grid_item}>
        <div className="drag-handle">3</div>
      </div>
      <div key="4" className={style.grid_item}>
        <div className="drag-handle">4</div>
      </div>
      <div key="5" className={style.grid_item}>
        <div className="drag-handle">5</div>
      </div>
      <div key="6" className={style.grid_item}>
        <div className="drag-handle">6</div>
      </div>
      <div key="7" className={style.grid_item}>
        <div className="drag-handle">7</div>
      </div>
      <div key="8" className={style.grid_item}>
        <div className="drag-handle">8</div>
      </div>
      <div key="9" className={style.grid_item}>
        <div className="drag-handle">9</div>
      </div>
    </GridLayout>
  )
}

export default memo(Grid)
