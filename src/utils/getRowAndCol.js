export function getRowAndCol(list) {
  console.log('list', list)
  let columnCount = 3 // replace with your grid's column count

  let currentColumn = 1
  let currentRow = 1

  for (let item of list) {
    // get the number of rows and columns this item spans
    let rows = parseInt(item.style.gridRowStart.split(' ')[1])
    let columns = parseInt(item.style.gridColumnStart.split(' ')[1])

    // if this item can't fit on the current row, move to the next row
    if (currentColumn + columns - 1 > columnCount) {
      currentColumn = 1
      currentRow++
    }

    console.log(
      `Item ${item.name} is at row ${currentRow}, column ${currentColumn}`
    )

    // move the current column pointer for the next item
    currentColumn += columns

    // if we're at the end of a row, move to the next row
    if (currentColumn > columnCount) {
      currentColumn = 1
      currentRow++
    }
  }
}
