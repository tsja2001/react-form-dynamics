/**
 * 获取指定位置的图表
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
