import { memo, useCallback } from 'react'
import { useState } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const ResponsiveGridLayout = WidthProvider(Responsive)

const MAX_ROWS = 3 // 设置最大行数为 3

const GridLayout = () => {
  // 初始布局和元素数组
  const [layout, setLayout] = useState([])
  const [items, setItems] = useState([
    {
      id: 'item1',
      title: 'item1',
      size: { w: 1, h: 1 },
      position: { x: 0, y: 0 },
    },
    {
      id: 'item2',
      title: 'item2',
      size: { w: 1, h: 1 },
      position: { x: 1, y: 0 },
    },
    {
      id: 'item3',
      title: 'item3',
      size: { w: 1, h: 1 },
      position: { x: 2, y: 0 },
    },
    {
      id: 'item4',
      title: 'item4',
      size: { w: 1, h: 1 },
      position: { x: 0, y: 1 },
    },
    {
      id: 'item5',
      title: 'item5',
      size: { w: 1, h: 1 },
      position: { x: 1, y: 1 },
    },
    {
      id: 'item6',
      title: 'item6',
      size: { w: 1, h: 1 },
      position: { x: 2, y: 1 },
    },
    {
      id: 'item7',
      title: 'item7',
      size: { w: 1, h: 1 },
      position: { x: 0, y: 2 },
    },
    {
      id: 'item8',
      title: 'item8',
      size: { w: 1, h: 1 },
      position: { x: 1, y: 2 },
    },
    {
      id: 'item9',
      title: 'item9',
      size: { w: 1, h: 1 },
      position: { x: 2, y: 2 },
    },
  ])
  const [showLayout, setShowLayout] = useState(1)

  // 增加新元素
  const addItem = () => {
    const newItem = {
      id: `item${items.length + 1}`,
      title: `Item ${items.length + 1}`,
      size: { w: 1, h: 1 },
      position: { x: 0, y: 0 },
    }

    setItems([...items, newItem])
  }

  // 删除元素
  const deleteItem = (itemId) => {
    const updatedItems = items.filter((item) => item.id !== itemId)
    setItems(updatedItems)
  }

  // 更新元素位置和大小
  const onLayoutChange = (newLayout) => {
    const correctedLayout = newLayout.filter((layout) => {
      // 确保没有元素的 y 值（也就是行数）超过 3
      if (layout.y >= MAX_ROWS) {
        // setShowLayout(false)
        return false
      }

      // 确保没有元素的 height 值超过最大行数
      if (layout.h > MAX_ROWS - layout.y) {
        layout.h = MAX_ROWS - layout.y
      }

      return true
    })

    setLayout(correctedLayout)
    console.log('newLayout', correctedLayout)

    // if (!showLayout) {
    //   setTimeout(() => {
    //     setShowLayout(true)
    //   })
    // }
    setShowLayout(showLayout + 1)
  }

  // 渲染布局和元素
  const renderLayout = useCallback(() => {
    return items.map((item) => {
      // setShowLayout(showLayout + 1)
      return (
        <div
          key={item.id}
          className="bg-slate-200"
          data-grid={{ ...item.size, ...item.position }}
        >
          {item.title}
          <button onClick={() => deleteItem(item.id)}>删除</button>
        </div>
      )
    })
  })

  return (
    <div>
      {JSON.stringify(showLayout)}
      {showLayout && (
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: layout }}
          // layouts={layout}
          breakpoints={{ lg: 800 }}
          cols={{ lg: 3 }}
          // 添加这个属性，设置最大行数
          // maxRows={MAX_ROWS}
          // maxRows={2}
          onLayoutChange={onLayoutChange}
        >
          {renderLayout()}
          <button onClick={addItem}>增加元素</button>
        </ResponsiveGridLayout>
      )}
    </div>
  )
}

export default memo(GridLayout)
