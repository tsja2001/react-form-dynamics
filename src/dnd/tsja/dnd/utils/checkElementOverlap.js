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
 * 获取以指定位置为起点的图表 (如果当前位置有图表, 但不是图表的起始点, 则返回null)
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
 * 判断指定位置, 是否有图表
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
 * 更新指定位置的图表
 */
export const updateChartAtPosition = (chartList, [col, row], chartItem) => {
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
 * 删除指定位置的图表
 */
export const deleteChartAtPosition = (chartList, [col, row]) => {
	const target = getChartAtPosition(chartList, [col, row])

	// console.log('删除前 chartList', chartList)
	if (target) {
		const res = chartList.filter((item) => {
			return item !== target
		})

		// console.log('删除后 chartList', res)

		return res
	}


	return chartList
}




/**
 * 判断当前拖拽的图表是否和已有的图表重叠
 * 
 * @param {*} chartList 当前显示的图表list
 * @param {*} [col, row] 当前拖拽的图表的位置 
 * @returns 
 */
export const checkElementOverlap = (chartList, [col, row]) => {
	const res = chartList.find((item) => {
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

	return !!res
}
