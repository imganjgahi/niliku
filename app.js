let selectedCellPosition = undefined
let boardData = undefined
function generateNumberOfCell(level, filterdNumbers) {
    const numbers = []
    for (let i = 1; i <= level; i++) {
        if (filterdNumbers.includes(i))
            continue
        numbers.push(i)
    }
    const indexOfRandomNumber = Math.floor(Math.random() * numbers.length)
    const finalResult = numbers[indexOfRandomNumber]
    return finalResult
}

function generateCells(level, preRows) {
    const cells = []
    const usedNumbers = []
    for (let i = 0; i < level; i++) {
        const flatedRows = preRows.map(pr => pr[i])
        usedNumbers.concat(flatedRows)
        const cellNumber = generateNumberOfCell(level, [...flatedRows, ...usedNumbers])
        usedNumbers.push(cellNumber)
        cells[i] = cellNumber
    }
    return cells
}
const timer = ms => new Promise(res => setTimeout(res, ms))
function generateRow(level) {
    const result = []
    for (let i = 0; i < level; i++) {
        const cells = generateCells(level, result)
        if (cells.includes(undefined)) {
            console.log("I: ", i) //TODO CALCULATE NUMS
            i--
        } else {
            result.push(cells)
        }
    }

    return result
}

function generateBoradData(level) {
    return generateRow(level)
}

function renderGameBoard(rows, targetCell = undefined) {
    boardData = rows
    const rootElement = document.getElementById("gameBoard")
    rootElement.innerHTML = ""
    rows.forEach((row, rowIndex) => {
        const rowEl = document.createElement('div')
        rowEl.className = "row"
        row.forEach((cell, cellIndex) => {
            const cellEl = document.createElement('div')
            cellEl.addEventListener('click', (e) => {
                renderGameBoard(rows, { rowIndex, cellIndex })
                selectedCellPosition = { rowIndex, cellIndex }
            })
            cellEl.className = "cell"
            if (targetCell) {
                if (targetCell.rowIndex === rowIndex && targetCell.cellIndex === cellIndex) {
                    cellEl.className = "cell selectedcell"
                } else if (targetCell.rowIndex === rowIndex || targetCell.cellIndex === cellIndex) {
                    cellEl.className = "cell hasFocusInRowOrCell"
                }
            }
            cellEl.innerText = cell
            rowEl.appendChild(cellEl)
        })
        rootElement.appendChild(rowEl)
    })
}

function fillTheCellwith(number) {
    console.log(number, selectedCellPosition, boardData)
    if (selectedCellPosition) {
        const newBoardGameData = JSON.parse(JSON.stringify(boardData))
        newBoardGameData[selectedCellPosition.rowIndex][selectedCellPosition.cellIndex] = number
        boardData = newBoardGameData
        renderGameBoard(newBoardGameData, selectedCellPosition)
    }
}
window.addEventListener('load', () => {
    renderGameBoard(generateBoradData(3))
})