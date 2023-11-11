let selectedCellPosition = undefined
let boardData = undefined
let gameLevel = 9


function gameAnalize() {
    console.log(checkDuplicatedNumber(boardData))
    const gameAnalizData = localStorage.getItem("analize") ? JSON.parse(JSON.stringify(localStorage.getItem("analize"))) : {
        gameLevel,
        currectAnswer: 3
    }
}

function checkDuplicatedNumber(data) {
    let duplicatedNumberLength = {}

    for (let x = 0; x < gameLevel; x++) {
        for (let y = 0; y < gameLevel; y++) {
            const targetNumber = data[x] ? data[x][y] ? data[x][y].num : undefined : undefined
            if (!targetNumber) return
            const hasDuplicatedInRow = data[x].forEach((cell, cellIndex) => {
                cellIndex !== y && +cell.num === +targetNumber
            })
            const hasDuplicateInOtherColls = data.forEach((row, rowIndex) => row.some((cell, cellIndex) => {
                return rowIndex !== x && cellIndex === y && +cell.num === +targetNumber
            }))
            console.log("X: ", x, y, hasDuplicatedInRow.length, hasDuplicateInOtherColls.length)
            duplicatedNumberLength += hasDuplicatedInRow.length + hasDuplicateInOtherColls.length
        }
    }
    return duplicatedNumberLength
}
function checkUserWin(data) {
    let isWin = true
    for (let x = 0; x < gameLevel; x++) {
        for (let y = 0; y < gameLevel; y++) {
            if (isWin) {
                const targetNumber = data[x] ? data[x][y] ? data[x][y].num : undefined : undefined
                if (!targetNumber) return
                const hasDuplicatedInRow = data[x].some((cell, cellIndex) => cellIndex !== y && +cell.num === +targetNumber)
                const hasDuplicateInOtherColls = data.some((row, rowIndex) => row.some((cell, cellIndex) => {
                    return rowIndex !== x && cellIndex === y && +cell.num === +targetNumber
                }))
                isWin = !hasDuplicatedInRow && !hasDuplicateInOtherColls
            }
        }
    }
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
    let maxHint = Math.floor(Math.random() * (level / 3))
    for (let i = 0; i < level; i++) {
        let maxHintInRow = maxHint > Math.floor(level / 3) ? maxHint : Math.floor(level / 3)
        const cells = generateCells(level, result)
        if (cells.includes(undefined)) {
            i--
        } else {
            result.push(cells.map(x => {
                if (maxHintInRow > 0 && Math.floor(Math.random() * level) > level - 3) {
                    maxHintInRow--
                    return { num: x, show: "isFixed" }
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

function lightingCols() {
    let xSwitch = 1
    let ySwitch = 1
    const rows = Array.from(document.querySelectorAll(".row"))
    rows.forEach((row) => {
        const cells = row.querySelectorAll(".cell")
        ySwitch = xSwitch <= 0 ? -2 : 1
        cells.forEach(cell => {
            if (ySwitch > 0) {
                cell.className = cell.className + " lightCell"
            }
            if (ySwitch === 3) {
                ySwitch = -3
            }
            ySwitch++
        })
        if (xSwitch === 3) {
            xSwitch = -3
        }
        xSwitch++
    })
}
function selectedCellChangedHandler(rowIndex, cellIndex) {
    const cells = Array.from(document.querySelectorAll(".cell"))
    cells.forEach(cellEl => {
        const [row, col] = cellEl.getAttribute("data-cell").split("-")
        if (!cellEl.className.includes("isFixed")) {
            if (+row === rowIndex && +col === cellIndex) {
                cellEl.className = "cell selectedcell"
            } else if ((+row === rowIndex || +col === cellIndex)) {
                cellEl.className = "cell hasFocusInRowOrCell"
            } else {
                cellEl.className = "cell"
            }
        }
    })
    lightingCols()
}
function renderGameBoard(rows) {
    boardData = rows
    const rootElement = document.getElementById("gameBoard")
    rootElement.innerHTML = ""
    let lightBoxRows = 0
    let lightBoxCols = 0
    rows.forEach((row, rowIndex) => {
        if (lightBoxRows === 3) {
            lightBoxRows = -3
        }
        const rowEl = document.createElement('div')
        rowEl.className = "row"
        row.forEach((cell, cellIndex) => {
            if (lightBoxCols === 3) {
                lightBoxCols = -3
            }
            const cellEl = document.createElement('div')
            cellEl.setAttribute("data-cell", rowIndex + "-" + cellIndex)
            cellEl.addEventListener('click', (e) => {
                if (cell.show === "isFixed") return
                selectedCellPosition = { rowIndex, cellIndex }
                selectedCellChangedHandler(rowIndex, cellIndex)
            })
            cellEl.className = "cell"
            if (cell.show === "isFixed") {
                cellEl.className = "cell isFixed"
            } else if (cell.show) {
                cellEl.style.fontSize = "20px"
            }

            cellEl.innerText = cell.show ? cell.num : ""
            rowEl.appendChild(cellEl)
            lightBoxCols++
        })
        lightBoxRows++
        rootElement.appendChild(rowEl)
    })
    setTimeout(() => {
        lightingCols()
    }, 100);
}

function renderNumberPad(level) {
    const rootElement = document.querySelector(".rowOfNumbers")
    rootElement.innerHTML = ""
    for (let i = 1; i <= level; i++) {
        const element = document.createElement('span')
        element.className = "numPad"
        element.innerText = i
        element.addEventListener("click", () => {
            fillTheCellwith(i)
        })
        rootElement.appendChild(element)
    }
}

function cellValueChangedHandler() {
    if (selectedCellPosition) {
        const cells = Array.from(document.querySelectorAll(".cell"))
        cells.forEach(el => {
            const [row, col] = el.getAttribute('data-cell').split("-")
            if (+row === selectedCellPosition.rowIndex && +col === selectedCellPosition.cellIndex) {
                el.innerText = boardData[selectedCellPosition.rowIndex][selectedCellPosition.cellIndex].num
                el.style.fontSize = "20px"
            }
        })
    }
}

function checkGameState() {
    displayedCellsLength = JSON.parse(JSON.stringify(boardData))
        .flat(10).filter(x => x.show).length
    document.getElementById("gameState").innerText = (gameLevel * gameLevel) + "/" + displayedCellsLength
    if (displayedCellsLength === (gameLevel * gameLevel)) {
        if (checkUserWin(boardData)) {
            localStorage.removeItem("currentState")
            document.getElementById("gameState").innerText = "YOU WIN"
        } else {
            document.getElementById("gameState").innerText = "Game Over"
        }
    }
}

function updateBoardData(newNumber) {
    const newBoardGameData = JSON.parse(JSON.stringify(boardData))
    if (newBoardGameData[selectedCellPosition.rowIndex][selectedCellPosition.cellIndex].show !== "isFixed") {
        const oldValue = newBoardGameData[selectedCellPosition.rowIndex][selectedCellPosition.cellIndex].num || ""
        let finalNumber = ("00" + oldValue + "" + newNumber).slice(gameLevel < 10 ? -1 : -2)
        if (+finalNumber > +gameLevel) {
            finalNumber = finalNumber.slice(-1)
        }
        if (+finalNumber > 0) {
            newBoardGameData[selectedCellPosition.rowIndex][selectedCellPosition.cellIndex] = { num: +finalNumber, show: "withUser" }
        }
        boardData = newBoardGameData
    }
    localStorage.setItem("currentState", JSON.stringify({
        gameLevel,
        board: newBoardGameData
    }))
}
function fillTheCellwith(number) {
    if (selectedCellPosition) {
        updateBoardData(number)
        cellValueChangedHandler()
        checkGameState()
        gameAnalize()
    }
}

function resetGame(level, force) {
    if ((!force && localStorage.getItem("currentState")) && confirm("Are you Shure?") === false) return
    boardData = undefined
    selectedCellPosition = undefined
    localStorage.removeItem("currentState")
    renderGameBoard(generateBoradData(level))
    renderNumberPad(level)
    document.getElementById("gameState").innerText = "Set Your First Number"
}
window.addEventListener('load', () => {
    currentState = localStorage.getItem("currentState") ? JSON.parse(localStorage.getItem("currentState")) : undefined
    if (currentState) {
        gameLevel = +currentState.gameLevel
        renderGameBoard(currentState.board)
    } else {
        resetGame(gameLevel, true)
    }
})

window.addEventListener('keydown', (e) => {
    if (!isNaN(+e.key) && +e.key <= gameLevel) {
        fillTheCellwith(e.key)
    }
})