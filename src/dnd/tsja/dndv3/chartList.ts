import { IChartItem } from './type'

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
  readonly id: string

  constructor(props: Partial<Omit<IChartItem, 'id'>>) {
    this.chart = props.chart
    this.width = props.width ?? 1
    this.height = props.height ?? 1
    this.startCol = props.startCol ?? 0
    this.startRow = props.startRow ?? 0
    this.endCol = props.endCol ?? this.startCol + this.width
    this.endRow = props.endRow ?? this.startRow + this.height
    this.id = ChartListItem.generateId()
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
    [x, y]: [number, number]
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
    const col = Math.floor((x - distanceLeft) / chartItemWidth)
    const row = Math.floor((y - distanceTop) / chartItemHeight)

    return [col, row]
  }

  // 增加新图表
  addChart(item: ChartListItem) {
    this.list.push(item)
  }

  // 查找某个位置上的图表
  findChartByPosition([col, row]: [number, number]): ChartListItem | null {
    const res = this.list.find((item) => {
      const { startCol, startRow, endCol, endRow } = item
      if (col >= startCol && col < endCol && row >= startRow && row < endRow) {
        return item
      }

      return false
    })

    return res ?? null
  }

  // insertItem(item) {}
}
// class ChartList {
//   constructor(public list: IChartItem[] = []) {}

//   insertItem(item) {}
// }
