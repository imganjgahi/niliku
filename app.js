let selectedCellPosition = undefined
let boardData = undefined
let gameLevel = 3
function hasDuplicatedNum(data, rowIndex, cellIndex, targetNum) {
    return data.some((row, x) => row.some((cell, y) => {
        if (x !== rowIndex && y === cellIndex) {
            console.log("check Other Cols", cell.num === targetNum, cell.num, targetNum)
            return cell.show && cell.num === targetNum
        } else if (x === rowIndex && y !== cellIndex) {
            console.log("check row Cols", cell.num === targetNum, cell.num, targetNum)
            return cell.show && cell.num === targetNum
        }

    }))
}
function checkUserWin(data) {
    let isWin = true
    data[0].forEach((cell, cellIndex) => {
        if (isWin && hasDuplicatedNum(data, 0, cellIndex, cell.num)) {
            isWin = false
        }
    })
    return isWin
}
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
        const flatedRows = preRows.map(pr => pr[i].num)
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
    let maxHint = level + 5
    for (let i = 0; i < level; i++) {
        let maxHintInRow = 3
        const cells = generateCells(level, result)
        if (cells.includes(undefined)) {
            i--
        } else {
            result.push(cells.map(x => {
                if (maxHintInRow > 0 && maxHint > 0 && Math.floor(Math.random() * level) > level / 2) {
                    maxHint--
                    maxHintInRow--
                    return { num: x, show: true }
                } else {
                    return { num: x, show: false }
                }
            }))
        }
    }

    return result
}

function generateBoradData(level) {
    gameLevel = level
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
            // cellEl.style.opacity =  cell.show ? 1 : 0.3
            cellEl.innerText = cell.show ? cell.num : ""
            // cellEl.innerText = cell.num
            rowEl.appendChild(cellEl)
        })
        rootElement.appendChild(rowEl)
    })
}

function fillTheCellwith(number) {
    if (selectedCellPosition) {
        const newBoardGameData = JSON.parse(JSON.stringify(boardData))
        newBoardGameData[selectedCellPosition.rowIndex][selectedCellPosition.cellIndex] = { num: number, show: true }
        boardData = newBoardGameData
        renderGameBoard(newBoardGameData, selectedCellPosition)
        displayedCellsLength = JSON.parse(JSON.stringify(newBoardGameData))
            .flat(10).filter(x => x.show).length

        document.getElementById("gameState").innerText = (gameLevel * gameLevel) + "/" + displayedCellsLength
        if (displayedCellsLength === (gameLevel * gameLevel) && checkUserWin(newBoardGameData)) {
            document.getElementById("gameState").innerText = "YOU WIN"
        }

    }
}
window.addEventListener('load', () => {
    renderGameBoard(generateBoradData(gameLevel))
    document.getElementById("gameState").innerText = "Set Your First Number"
})