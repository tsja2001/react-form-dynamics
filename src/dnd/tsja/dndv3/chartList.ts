import { DIRECTIONS } from './constant'
import { IChartItem, IDirection } from './type'
import { cloneDeep } from 'lodash'

export class ChartListItem implements IChartItem {
  private static generateId(): string {
    return Math.random().toString(36).slice(2)
  }

  chart: any
  width: number
  height: number
  startCol: number
  startRow: number
  endCol: number
  endRow: number
  id: string

  constructor(props: Partial<IChartItem>) {
    this.chart = props.chart
    this.width = props.width ?? 1
    this.height = props.height ?? 1
    this.startCol = props.startCol ?? 0
    this.startRow = props.startRow ?? 0
    this.endCol = props.endCol ?? this.startCol + this.width - 1
    this.endRow = props.endRow ?? this.startRow + this.height - 1
    this.id = props.id ?? ChartListItem.generateId()
  }
}

export class ChartList {
  constructor(
    public colCount: number,
    public rowCount: number,
    private list: ChartListItem[] = []
  ) {}

  // 传入dashboard的ref, 和当前鼠标的位置, 返回当前鼠标在第几行第几列
  getMousePosition(
    dashboardRef: HTMLElement,
    [clientX, clientY]: [number, number]
  ): [number, number] {
    const { left, top } = dashboardRef.getBoundingClientRect()

    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    // dashboard的左上角坐标 + 滚动距离 = dashboard的实际位置
    const distanceLeft = left + scrollLeft
    const distanceTop = top + scrollTop

    // 计算每个图表的宽高
    const chartItemWidth = dashboardRef.offsetWidth / this.colCount
    const chartItemHeight = dashboardRef.offsetHeight / this.rowCount

    // 计算当前鼠标位置的col和row
    const col = Math.floor((clientX - distanceLeft) / chartItemWidth)
    const row = Math.floor((clientY - distanceTop) / chartItemHeight)

    return [col, row]
  }

  // 增加新图表
  addChart(item: ChartListItem) {
    this.list.push(item)
  }

  // 更新chartList
  updateChartList(list: ChartListItem[]) {
    this.list = list
  }

  // 查找某个位置上的图表
  findChartByPosition([col, row]: [number, number]): ChartListItem | null {
    const res = this.list.find((item) => {
      const { startCol, startRow, endCol, endRow } = item
      if (
        col >= startCol &&
        col <= endCol &&
        row >= startRow &&
        row <= endRow
      ) {
        return item
      }

      return false
    })

    return res ?? null
  }

  // 查找以某个位置为起点的图表
  findChartByStartPoint([col, row]: [number, number]): ChartListItem | null {
    const res = this.list.find((item) => {
      const { startCol, startRow } = item
      if (col === startCol && row === startRow) {
        return item
      }

      return false
    })

    return res ?? null
  }

  // 通过id查找图表
  findChartById(id: string): ChartListItem | null {
    return this.list.find((item) => item.id === id) ?? null
  }

  // 通过id查找其他图表
  findOtherChartById(id: string): ChartListItem[] {
    return this.list.filter((item) => item.id !== id)
  }

  // 图表数据, 若不存在则添加
  updateChartDataByPosition([col, row]: [number, number], chartData: any) {
    const chartItem = this.findChartByPosition([col, row])
    if (chartItem) {
      chartItem.chart = chartData
    } else {
      this.addChart(
        new ChartListItem({
          chart: chartData,
          startCol: col,
          startRow: row,
        })
      )
    }
  }

  // 通过id更新某个图表位置
  updateChartPositionById(
    chartId: string,
    [newCol, newRow]: [number, number]
  ): boolean {
    const chartItem = this.findChartById(chartId)

    if (chartItem) {
      const otherChartList = this.findOtherChartById(chartId)

      const newChartItem = new ChartListItem({
        ...chartItem,
        startCol: newCol,
        startRow: newRow,
        endCol: newCol + chartItem.width - 1,
        endRow: newRow + chartItem.height - 1,
      })

      // 判断新位置是否可以放置图表
      if (this.canDrop(newChartItem, otherChartList)) {
        this.updateChartList([...otherChartList, newChartItem])
        return true
      }
    }

    return false
  }

  // 通过id更新某个图表大小
  updateChartSizeById(
    chatId: string,
    [distanceX, distanceY]: [number, number],
    direction: (typeof DIRECTIONS)[keyof typeof DIRECTIONS]
  ): boolean {
    const chartItem = this.findChartById(chatId)

    if (chartItem) {
      const otherChartList = this.findOtherChartById(chatId)
      let newChartItem: ChartListItem | null = null

      switch (direction) {
        case DIRECTIONS.UP:
          newChartItem = new ChartListItem({
            ...chartItem,
            startRow: chartItem.startRow + distanceY,
            height: chartItem.endRow - chartItem.startRow - distanceY + 1,
          })
          break
        case DIRECTIONS.DOWN:
          newChartItem = new ChartListItem({
            ...chartItem,
            endRow: chartItem.endRow + distanceY,
            height: chartItem.endRow - chartItem.startRow + 1 + distanceY,
          })
          break
        case DIRECTIONS.LEFT:
          newChartItem = new ChartListItem({
            ...chartItem,
            startCol: chartItem.startCol + distanceX,
            width: chartItem.endCol - chartItem.startCol - distanceX + 1,
          })
          break
        case DIRECTIONS.RIGHT:
          const newObj = {
            ...chartItem,
            endCol: chartItem.endCol + distanceX,
            width: chartItem.endCol + distanceX - chartItem.startCol + 1,
          }
          console.log(newObj)
          newChartItem = new ChartListItem({
            ...chartItem,
            endCol: chartItem.endCol + distanceX,
            width: chartItem.endCol + distanceX - chartItem.startCol + 1,
          })
      }
      // 判断新位置是否可以放置图表
      if (newChartItem && this.canDrop(newChartItem, otherChartList)) {
        this.updateChartList([...otherChartList, newChartItem])
        return true
      }
    }

    return false
  }

  // 判断chartList中是否可以放置当前chartItem
  canDrop(chartItem: ChartListItem, chartList: ChartListItem[] = this.list) {
    // 判断是否超出dashboard范围
    if (chartItem.endCol > this.colCount || chartItem.endRow > this.rowCount) {
      return false
    }

    // 判断是否与其他图表重叠
    const isOverlap = chartList.some((listItem) => {
      // 判断要放置的图表的四个角是否在其他图表内
      if (
        this.isPointInChart(
          [chartItem.startCol, chartItem.startRow],
          listItem
        ) ||
        this.isPointInChart([chartItem.endCol, chartItem.endRow], listItem) ||
        this.isPointInChart([chartItem.startCol, chartItem.endRow], listItem) ||
        this.isPointInChart([chartItem.endCol, chartItem.startRow], listItem)
      ) {
        return true
      }

      // 判断其他图表的四个角是否在要放置的图表内
      if (
        this.isPointInChart(
          [listItem.startCol, listItem.startRow],
          chartItem
        ) ||
        this.isPointInChart([listItem.endCol, listItem.endRow], chartItem) ||
        this.isPointInChart([listItem.startCol, listItem.endRow], chartItem) ||
        this.isPointInChart([listItem.endCol, listItem.startRow], chartItem)
      ) {
        return true
      }

      return false
    })

    return !isOverlap
  }

  // 判断一个点是否在某个图表内
  isPointInChart([col, row]: [number, number], chartItem: ChartListItem) {
    const { startCol, startRow, endCol, endRow } = chartItem
    if (col >= startCol && col <= endCol && row >= startRow && row <= endRow) {
      return true
    }

    return false
  }
}
