import { memo, useRef, useState } from "react"
import { chartDataList } from "./chartDataList"
import style from "./Dnd.module.scss"
import {
  DownCircleFilled,
  LeftCircleFilled,
  RightCircleFilled,
  UpCircleFilled,
} from "@ant-design/icons"
import LineDemo from "../charts/LineDemo"
import { Button } from "antd"
import { getRowAndCol } from "../utils/getRowAndCol"

const DndByGPT = () => {
  const dragData = useRef(null)
  const dropIndex = useRef(null)
  const clickIndex = useRef(null)
  const toBeRemovedIndex = useRef(null)
  const previousDropIndex = useRef(null)
  const arrow = useRef(null)

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
  function rowEditHandler(count) {
    const newItems = [...itemList]
    const previousStyle = newItems[clickIndex.current]?.style ?? {}
    if (previousStyle.gridRowStart === undefined) {
      previousStyle.gridRowStart = "span 1"
    }
    const previousRowCount = parseInt(
      previousStyle.gridRowStart.match(/\d+/)[0]
    )
    if (previousRowCount + count <= 0) {
      console.log("行数不能小于1")
      return
    }

    const newRowCount = previousRowCount + count

    newItems[clickIndex.current].style = {
      ...previousStyle,
      gridRowStart: `span ${newRowCount}`,
    }
    console.log("gridRowStart", newItems[clickIndex.current].style.gridRowStart)
    getRowAndCol(newItems)
    setItemList(newItems)
  }
  // 列数编辑
  function columnEditHandler(count) {
    const newItems = [...itemList]
    const previousStyle = newItems[clickIndex.current]?.style ?? {}
    if (previousStyle.gridColumnStart === undefined) {
      previousStyle.gridColumnStart = "span 1"
    }
    const previousColumnCount = parseInt(
      previousStyle.gridColumnStart.match(/\d+/)[0]
    )
    if (previousColumnCount + count <= 0) {
      console.log("列数不能小于1")
      return
    }
    const newColumnCount = previousColumnCount + count

    newItems[clickIndex.current].style = {
      ...previousStyle,
      gridColumnStart: `span ${newColumnCount}`,
    }
    console.log(
      "gridColumnStart",
      newItems[clickIndex.current].style.gridColumnStart
    )
    setItemList(newItems)
  }

  /**
   *
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

    switch (arrow.current) {
      case "top":
        console.log("top", event)

        break
      case "right":
        console.log("right", event)
        break
      case "bottom":
        console.log("bottom", event)
        break
      case "left":
        console.log("left", event)
        if (item) {
          item.chartStyle.width =
            parseInt(item.chartStyle.width.slice(0, -2)) + 1 + "px"
        }
        console.log(item.chartStyle)
        setItemList([...itemList])
        break
    }
  }

  function handleDrop(event) {
    event.preventDefault()
    event.stopPropagation()

    const currentDropIndex = dropIndex.current
    const newItems = [...itemList]

    if (currentDropIndex !== null) {
      newItems[dropIndex.current].chart = dragData.current.chart
    }

    setItemList(newItems)

    // 清空拖拽数据和目标索引
    dragData.current = null
    dropIndex.current = null
  }

  function handleItemStartDrop(event, data, index) {
    dragData.current = data
    previousDropIndex.current = index
  }

  function handleItemDrop(event) {
    event.preventDefault()
    event.stopPropagation()

    const currentDropIndex = dropIndex.current
    const newItems = [...itemList]

    if (currentDropIndex !== null) {
      newItems[dropIndex.current].chart = dragData.current.chart
    }

    if (
      previousDropIndex.current !== null &&
      dropIndex.current !== previousDropIndex.current
    ) {
      newItems[previousDropIndex.current].chart = null
    }

    setItemList(newItems)

    // 清空拖拽数据和目标索引
    dragData.current = null
    dropIndex.current = null
  }

  // 方向拖拽回调处理
  function handleArrowDropStart(event, data, index, direction) {
    dragData.current = data
    previousDropIndex.current = index
    arrow.current = direction
    console.log(`Start Drop:`, event)
  }

  function handleArrowLeftDropOver(event, index) {
    event.preventDefault()
    event.stopPropagation()
    dropIndex.current = index
    console.log(`Drop Over:`, event)
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
                onDragOver={(event) => handleDragOver(event, index, item)}
                onDrop={handleDrop}
                style={item.style}
                className={`${style.grid_item}`}
                onClick={(event) => {
                  handleClickItem(event, index)
                }}
              >
                <div
                  className={style.chartWarp}
                  onDragStart={(event) =>
                    handleItemStartDrop(event, item, index)
                  }
                  draggable={true}
                  onDragOver={(event) => handleDragOver(event, index, item)}
                  onDrop={handleItemDrop}
                  onClick={(event) => {
                    handleClickItem(event, index)
                  }}
                >
                  {item.chart ? (
                    <>
                      {item.chart({
                        style: item.chartStyle,
                      })}
                      <div className={style.arrowTop}></div>
                      <div className={style.arrowRight}></div>
                      <div className={style.arrowBottom}></div>
                      <div
                        onDragStart={(event) =>
                          handleArrowDropStart(event, item, index, "left")
                        }
                        draggable={true}
                        // onDrop={handleItemDrop}
                        className={style.arrowLeft}
                      ></div>
                    </>
                  ) : (
                    `${item.name} 请将图表拖拽到此处`
                  )}

                  {/* {item.chart ? item.chart : `${item.name} 请将图表拖拽到此处`} */}
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
