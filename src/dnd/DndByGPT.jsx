import { memo, useRef, useState } from "react"
import { chartDataList } from "./chartDataList"
import style from "./Dnd.module.scss"
import {
  DownCircleFilled,
  LeftCircleFilled,
  RightCircleFilled,
  UpCircleFilled,
} from "@ant-design/icons"
import { Button } from "antd"

const DndByGPT = () => {
  // 拖拽数据
  const dragData = useRef(null)
  // 当前鼠标拖动的元素, 要放置的目标索引
  const dropIndex = useRef(null)
  const clickIndex = useRef(null)
  // 
  const previousDropIndex = useRef(null)

  const [itemList, setItemList] = useState([
    {
      id: 1,
      name: "chart1",
      style: {
        gridColumnStart: "span 1",
        gridRowStart: "span 1",
      },
      chartStyle: { width: "200px", height: "220px" },
    },
    {
      id: 2,
      name: "chart2",
      style: {
        gridColumnStart: "span 1",
        gridRowStart: "span 1",
      },
      chartStyle: { width: "200px", height: "220px" },
    },
    {
      id: 3,
      name: "chart3",
      style: {
        gridColumnStart: "span 1",
        gridRowStart: "span 1",
      },
      chartStyle: { width: "200px", height: "220px" },
    },
    {
      id: 4,
      name: "chart4",
      style: {
        gridColumnStart: "span 1",
        gridRowStart: "span 1",
      },
      chartStyle: { width: "200px", height: "220px" },
    },
    {
      id: 5,
      name: "chart5",
      style: {
        gridColumnStart: "span 1",
        gridRowStart: "span 1",
      },
      chartStyle: { width: "200px", height: "220px" },
    },
    {
      id: 6,
      name: "chart6",
      style: {
        gridColumnStart: "span 1",
        gridRowStart: "span 1",
      },
      chartStyle: { width: "200px", height: "220px" },
    },
    {
      id: 7,
      name: "chart7",
      style: {
        gridColumnStart: "span 1",
        gridRowStart: "span 1",
      },
      chartStyle: {
        width: "200px",
        height: "220px",
      },
    },
    {
      id: 8,
      name: "chart8",
      style: {
        gridColumnStart: "span 1",
        gridRowStart: "span 1",
      },
      chartStyle: { width: "200px", height: "220px" },
    },
    {
      id: 9,
      name: "chart9",
      style: {
        gridColumnStart: "span 1",
        gridRowStart: "span 1",
      },
      chartStyle: { width: "200px", height: "220px" },
    },
  ])

  // 点击选中每一个元素
  function handleClickItem(event, index) {
    console.log(index)
    clickIndex.current = index
  }
  // 行数编辑
  function rowEditHandler(count) {}
  // 列数编辑
  function columnEditHandler(count) {}

  /**
   * 开始从侧栏拖动图表
   * @param {*} event 默认事件
   * @param {*} data 拖拽数据
   * @param {*} ifRemove 是否移除拖动的元素
   */
  function handleDragStart(event, data, ifRemove = false) {
    dragData.current = data
  }

  function handleDragOver(event, index, item) {
    event.preventDefault()
    event.stopPropagation()
    dropIndex.current = index
  }

  function handleDrop(event) {
    event.preventDefault()
    event.stopPropagation()

    // const currentDropIndex = dropIndex.current
    const newItems = [...itemList]

    newItems[dropIndex.current].chart = dragData.current.chart
    // 如果从item中拖动元素到item中, 则删除原来的元素
    if(previousDropIndex.current !== null) {
      newItems[previousDropIndex.current].chart = null
      console.log(' previousDropIndex.current)', previousDropIndex.current)
    }

    setItemList(newItems)

    // 清空拖拽数据和目标索引
    dragData.current = null
    dropIndex.current = null
    previousDropIndex.current = null
  }

  // 开始拖动item元素
  function handleItemStartDrop(event, data, index) {
    dragData.current = data
    previousDropIndex.current = index
    console.log(index)
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
        >
          <div className={style.grid}>
            {itemList.map((item, index) => (
              <div
                key={index}
                style={item.style}
                className={`${style.grid_item}`}
                onClick={(event) => {
                  handleClickItem(event, index)
                }}
              >
                <div
                  // 松开鼠标 放下元素
                  className={style.chartWarp}
                  onDrop={handleDrop}
                  // 开始拖动item元素
                  onDragStart={(event) =>
                    handleItemStartDrop(event, item, index)
                  }
                  // 路过元素
                  onDragOver={(event) => handleDragOver(event, index, item)}
                  draggable={true}
                  onClick={(event) => {
                    handleClickItem(event, index)
                  }}
                >
                  {item.chart ? (
                    <>
                      {item.chart({
                        style: item.chartStyle,
                      })}
                    </>
                  ) : (
                    `${item.name} 请将图表拖拽到此处`
                  )}

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={style.edit}>
        <Button>编辑</Button>
        <Button onClick={() => rowEditHandler(1)}>行数(纵向)+1</Button>
        <Button onClick={() => columnEditHandler(1)}>列数(横向)+1</Button>
        <Button onClick={() => rowEditHandler(-1)}>行数(纵向)-1</Button>
        <Button onClick={() => columnEditHandler(-1)}>列数(横向)-1</Button>

        <div className={style.eidtBox}>
          <div className={`${style.iconBox} ${style.topIconBox}`}>
            <UpCircleFilled className={`${style.antdicon} `} />
            <DownCircleFilled className={`${style.antdicon} `} />
          </div>

          <div className={`${style.iconBox} ${style.bottomIconBox}`}>
            <UpCircleFilled className={`${style.antdicon}`} />
            <DownCircleFilled className={`${style.antdicon}`} />
          </div>

          <div className={`${style.iconBox} ${style.rightIconBox}`}>
            <LeftCircleFilled className={`${style.antdicon}`} />
            <RightCircleFilled className={`${style.antdicon}`} />
          </div>

          <div className={`${style.iconBox} ${style.leftIconBox}`}>
            <LeftCircleFilled className={`${style.antdicon}`} />
            <RightCircleFilled className={`${style.antdicon}`} />
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(DndByGPT)
