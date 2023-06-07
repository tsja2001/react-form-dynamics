import { DIRECTIONS } from '../constant'

export class DashboardChartItem {
  constructor(chart) {
    this.chart = chart
    this.width = 1
    this.height = 1
    this.startCol = 0
    this.startRow = 0
    this.endCol = 0
    this.endRow = 0
  }
}

/**
 * 获取以指定位置为起点的图表 (如果当前位置有图表, 但不是图表的起始点, 也不返回)
 */
export const getChartAtStartPoint = (chartList, [col, row]) => {
  return chartList.find((item) => {
    return item.startCol === col && item.startRow === row
  })
}

/**
 * 获取指定位置的图表(当前位置有图表则返回, 无论当前位置是否是图表的起始点)
 */
export const getChartAtPosition = (chartList, [col, row]) => {
  return chartList.find((item) => {
    let isRowOverlap = false
    let isColOverlap = false
    if (item.startCol <= col && item.endCol >= col) {
      isRowOverlap = true
    }
    if (item.startRow <= row && item.endRow >= row) {
      isColOverlap = true
    }

    return isRowOverlap && isColOverlap
  })
}

/**
 * 判断指定位置, 是否有图表 (当前位置有图表则返回true, 无论当前位置是否是图表的起始点)
 */
export const checkChartAtPosition = (chartList, [col, row]) => {
  return !!getChartAtPosition(chartList, [col, row])
}

/**
 * 判断指定位置, 是否有图表, 且当前位置是图表的起始点
 */
export const checkChartAtStartPoint = (chartList, [col, row]) => {
  return !!getChartAtStartPoint(chartList, [col, row])
}

/**
 * 替换指定位置的图表(替换所有数据)
 */
export const updateChartAtPositionAllData = (
  chartList,
  [col, row],
  chartItem
) => {
  const resChartList = [...chartList]

  resChartList.forEach((item) => {
    if (item.startCol === col && item.startRow === row) {
      // 找到指定位置的图表, 更新图表
      Object.keys(item).forEach((key) => {
        item[key] = chartItem[key]
      })
    }
  })

  return resChartList
}

/**
 * 更新指定位置的图表的数据(只替换chart数据)
 */
export const updateChartAtPosition = (chartList, [col, row], chartItem) => {
  const resChartList = [...chartList]

  resChartList.forEach((item) => {
    if (item.startCol === col && item.startRow === row) {
      // 找到指定位置的图表, 更新图表数据
      item.chart = chartItem.chart
    }
  })

  return resChartList
}

/**
 * 删除指定位置的图表
 */
export const deleteChartAtPosition = (chartList, [col, row]) => {
  const target = getChartAtPosition(chartList, [col, row])

  if (target) {
    const res = chartList.filter((item) => {
      return item !== target
    })

    return res
  }

  return chartList
}

/**
 * 删除指定图表
 */
export const deleteChart = (chartList, target) => {
  const res = chartList.filter((item) => {
    return item !== target
  })

  return res
}

/**
 * 判断当前拖拽的图表是否和已有的图表重叠
 *
 * @param {*} chartList 图表list
 * @param {*} targetChart 要判断是否重叠的图表
 * @returns
 */
export const checkElementOverlap = (chartList, targetChart) => {
  console.log('chartList', chartList)
  console.log('targetChart', targetChart)

  let isOverlap = false
  // 获取target四个点的坐标
  const targetSCol = targetChart.startCol
  const targetSRow = targetChart.startRow
  const targetECol = targetChart.endCol
  const targetERow = targetChart.endRow
  const targetPositon = [targetSCol, targetSRow, targetECol, targetERow]

  chartList.forEach((chartItem) => {
    // 获取chartitem四个点的坐标
    const itemSCol = chartItem.startCol
    const itemSRow = chartItem.startRow
    const itemECol = chartItem.endCol
    const itemERow = chartItem.endRow
    const itemPositon = [itemSCol, itemSRow, itemECol, itemERow]
    // 判断target是否有point在item的内部
    const isTargetPointInItem =
      isPointInRect([targetSCol, targetSRow], itemPositon) ||
      isPointInRect([targetSCol, targetERow], itemPositon) ||
      isPointInRect([targetECol, targetSRow], itemPositon) ||
      isPointInRect([targetECol, targetERow], itemPositon)
    // 判断item是否有point在target的内部
    const isItemPointInTarget =
      isPointInRect([itemSCol, itemSRow], targetPositon) ||
      isPointInRect([itemSCol, itemERow], targetPositon) ||
      isPointInRect([itemECol, itemSRow], targetPositon) ||
      isPointInRect([itemECol, itemERow], targetPositon)

    if (isTargetPointInItem || isItemPointInTarget) {
      console.log('有重叠')
      isOverlap = true
    }
  })

  return isOverlap
}

/**
 * 传入dashboard的ref, 和当前鼠标位置, 返回当前鼠标位置的col和row
 */
export const getColAndRow = (dashboardRef, [x, y]) => {
  const { left, top } = dashboardRef.getBoundingClientRect()
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop

  // dashboard的左上角坐标 + 滚动距离 = dashboard的实际位置
  const distanceLeft = left + scrollLeft
  const distanceTop = top + scrollTop

  // 计算每个图表的宽高
  const chartItemWidth = dashboardRef.offsetWidth / 4
  const chartItemHeight = dashboardRef.offsetHeight / 3

  // 计算当前鼠标位置的col和row
  const col = Math.floor((x - distanceLeft) / chartItemWidth)
  const row = Math.floor((y - distanceTop) / chartItemHeight)

  return [col, row]
}

/**
 * 调整图表大小
 */
export const resizeChart = (
  chartList,
  [col, row],
  resizeChartItem,
  direction
) => {
  let resChartList = []

  // 拖动下按钮
  if (direction === DIRECTIONS.DOWN) {
    const addHeight = row - resizeChartItem.endRow

    resChartList = chartList.map((item) => {
      const cloneItem = { ...item }
      if (
        cloneItem.startCol === resizeChartItem.startCol &&
        cloneItem.startRow === resizeChartItem.startRow
      ) {
        cloneItem.height += addHeight
        cloneItem.endRow += addHeight
      }

      // 计算修改完大小的图表, 是否和其他图表重叠
      const chartListWithoutSelf = deleteChart(chartList, item)

      const isOverlap = checkElementOverlap(chartListWithoutSelf, cloneItem)
      // 如果有重叠, 则不修改大小
      if (isOverlap) {
        console.log('有重叠, 拖拽失败')
        return item
      }

      return cloneItem
    })
  }

  // 拖动右按钮
  if (direction === DIRECTIONS.RIGHT) {
    const addWidth = col - resizeChartItem.endCol

    resChartList = chartList.map((item) => {
      const cloneItem = { ...item }
      if (
        cloneItem.startCol === resizeChartItem.startCol &&
        cloneItem.startRow === resizeChartItem.startRow
      ) {
        cloneItem.width += addWidth
        cloneItem.endCol += addWidth
      }

      // 计算修改完大小的图表, 是否和其他图表重叠
      const chartListWithoutSelf = deleteChart(chartList, item)

      const isOverlap = checkElementOverlap(chartListWithoutSelf, cloneItem)
      // 如果有重叠, 则不修改大小
      if (isOverlap) {
        console.log('有重叠, 拖拽失败')
        return item
      }

      return cloneItem
    })
  }

  // 拖动上按钮
  if (direction === DIRECTIONS.UP) {
    const addHeight = resizeChartItem.startRow - row

    resChartList = chartList.map((item) => {
      const cloneItem = { ...item }
      if (
        cloneItem.startCol === resizeChartItem.startCol &&
        cloneItem.startRow === resizeChartItem.startRow
      ) {
        cloneItem.height += addHeight
        cloneItem.startRow -= addHeight
      }

      // 计算修改完大小的图表, 是否和其他图表重叠
      const chartListWithoutSelf = deleteChart(chartList, item)

      const isOverlap = checkElementOverlap(chartListWithoutSelf, cloneItem)
      // 如果有重叠, 则不修改大小
      if (isOverlap) {
        console.log('有重叠, 拖拽失败')
        return item
      }

      return cloneItem
    })
  }

  // 拖动左按钮
  if (direction === DIRECTIONS.LEFT) {
    const addWidth = resizeChartItem.startCol - col

    resChartList = chartList.map((item) => {
      const cloneItem = { ...item }
      if (
        cloneItem.startCol === resizeChartItem.startCol &&
        cloneItem.startRow === resizeChartItem.startRow
      ) {
        cloneItem.width += addWidth
        cloneItem.startCol -= addWidth
      }

      // 计算修改完大小的图表, 是否和其他图表重叠
      const chartListWithoutSelf = deleteChart(chartList, item)

      const isOverlap = checkElementOverlap(chartListWithoutSelf, cloneItem)
      // 如果有重叠, 则不修改大小
      if (isOverlap) {
        console.log('有重叠, 拖拽失败')
        return item
      }

      return cloneItem
    })
  }

  return resChartList
}

/**
 * 判断一个点是否在一个矩形内
 */
export const isPointInRect = (
  [targetX, targetY],
  [startX, startY, endX, endY]
) => {
  // 判断点是否在矩形内
  const isXInRect = targetX >= startX && targetX <= endX
  const isYInRect = targetY >= startY && targetY <= endY

  return isXInRect && isYInRect
}
