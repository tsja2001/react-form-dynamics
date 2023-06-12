export const DIRECTIONS = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
}

// 行数, 列数
export const DASHBOARD_SIZE = [8, 6]

// 拖拽类型
// fromList 从预览列表中拉取
// fromDashboard 拖动dashboard内图表以调整位置
// resize 拖动bar来调整大小
export const DRAG_TYPE = {
  FROM_LIST: 'fromList',
  FROM_DASHBOARD: 'fromDashboard',
  RESIZE: 'resize',
}
