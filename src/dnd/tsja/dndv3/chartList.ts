interface IChartItem {
  chart: any
  width: number
  height: number
  startCol: number
  startRow: number
  endCol: number
  endRow: number
  readonly id: string
}

export class ChartListItem implements IChartItem {
  private static generateId(): string {
    return Math.random().toString(36).slice(2)
  }

  constructor(
    public chart: any = null,
    public width: number = 1,
    public height: number = 1,
    public startCol: number = 0,
    public startRow: number = 0,
    public endCol: number = startCol + width - 1,
    public endRow: number = startRow + height - 1,
    public readonly id: string = ChartListItem.generateId()
  ) {}
}

class ChartList {
  constructor(list = []) {
    // this.list = list
  }

  insertItem(item) {}
}
