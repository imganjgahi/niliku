let selectedCellPosition = undefined
let boardData = undefined
let gameLevel = "hard"

function gameAnalize() {
    console.log(checkDuplicatedNumber(boardData))
    const gameAnalizData = localStorage.getItem("analize") ? JSON.parse(JSON.stringify(localStorage.getItem("analize"))) : {
        currectAnswer: 3
    }
}

function checkDuplicatedNumber(data) {
    return 3
    // let duplicatedNumberLength = {}

    // for (let x = 0; x < gameLevel; x++) {
    //     for (let y = 0; y < gameLevel; y++) {
    //         const targetNumber = data[x] ? data[x][y] ? data[x][y].num : undefined : undefined
    //         if (!targetNumber) return
    //         const hasDuplicatedInRow = data[x].forEach((cell, cellIndex) => {
    //             cellIndex !== y && +cell.num === +targetNumber
    //         })
    //         const hasDuplicateInOtherColls = data.forEach((row, rowIndex) => row.some((cell, cellIndex) => {
    //             return rowIndex !== x && cellIndex === y && +cell.num === +targetNumber
    //         }))
    //         console.log("X: ", x, y, hasDuplicatedInRow.length, hasDuplicateInOtherColls.length)
    //         duplicatedNumberLength += hasDuplicatedInRow.length + hasDuplicateInOtherColls.length
    //     }
    // }
    // return duplicatedNumberLength
}
function checkUserWin(data) {
    let isWin = true
    for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
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

function isValidMove(num, usedNumbers) {
    // console.log(usedNumbers.some(x => x === num), num, usedNumbers)
    return num && !usedNumbers.some(x => x === num)
}
function generateSudoku() {
    const rows = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0));
    let numbers = [...Array(9).keys()].map(n => n + 1);
    const cellpostions = [...Array(9).keys()].map(a => [...Array(9).keys()].map(b => (a * 9) + (b)));
    console.log(cellpostions)
}
function generateNumberOfCell(filterdNumbers) {
    const numbers = []
    for (let i = 1; i <= 9; i++) {
        if (filterdNumbers.includes(i))
            continue
        numbers.push(i)
    }
    const indexOfRandomNumber = Math.floor(Math.random() * numbers.length)
    const finalResult = numbers[indexOfRandomNumber]
    return finalResult
}

function generateCells(preRows) {
    const cells = []
    const usedNumbers = []
    for (let i = 0; i < 9; i++) {
        const flatedRows = preRows.map(pr => pr[i].num)
        flatedRows.push()
        usedNumbers.concat(flatedRows)
        const cellNumber = generateNumberOfCell([...flatedRows, ...usedNumbers])
        usedNumbers.push(cellNumber)
        cells[i] = cellNumber
    }
    return cells
}
const timer = ms => new Promise(res => setTimeout(res, ms))
function generateRow(level) {
    const result = []
    let maxHint = Math.floor(Math.random() * (9 / 3))
    const numbers = sudoku.generate(level)
    console.log(numbers)
    for (let r = 0; r < 9; r++) {
        const newRow = []
        for (let c = 0; c < 9; c++) {
            const targetNumber = numbers.split("")[(r * 9) + c]
            newRow.push({ num: targetNumber !== "." ? +targetNumber : ".", show: targetNumber !== "." ? "isFixed" : undefined })
        }
        result.push(newRow)
    }

    return result
}

function generateBoradData(level) {
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
function renderGameBoard(level, rows) {
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

function renderNumberPad() {
    const rootElement = document.querySelector(".rowOfNumbers")
    rootElement.innerHTML = ""
    for (let i = 1; i <= 9; i++) {
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
    document.getElementById("gameState").innerText = 81 + "/" + displayedCellsLength
    if (displayedCellsLength === 81) {
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
        newBoardGameData[selectedCellPosition.rowIndex][selectedCellPosition.cellIndex] = { num: newNumber, show: "withUser" }
        boardData = newBoardGameData
    }
    localStorage.setItem("currentState", JSON.stringify({
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
    if ((!force && localStorage.getItem("currentState")) && confirm("Are you Shure you wanna reset the game?") === false) return
    boardData = undefined
    selectedCellPosition = undefined
    localStorage.removeItem("currentState")
    renderGameBoard(level, generateBoradData(level))
    renderNumberPad()
    document.getElementById("gameState").innerText = "Pick a Cell and Guess Your First Number"
}

function solvePuzzle() {
    if (confirm("Are you Shure you wanna solved puzzle?") === false) return
    const bordNumbers = boardData.map(row => row.map(c => c.num)).flat().join("")
    const newBoardGame = JSON.parse(JSON.stringify(boardData))
    const newNumbers = sudoku.solve(bordNumbers)
    if (newNumbers) {
        const _newNumbers = newNumbers.split("")
        renderGameBoard(gameLevel, newBoardGame.map((row, rowIndex) => row.map((col, colIndex) => {
            return {
                num: _newNumbers[(rowIndex * 9) + colIndex],
                show: col.show === "isFixed" ? col.show : "withUser"
            }
        })))
    } else {
        alert("cant solved this puzzle :/")
    }
    checkGameState()

}
window.addEventListener('load', () => {
    console.log(generateSudoku())
    currentState = localStorage.getItem("currentState") ? JSON.parse(localStorage.getItem("currentState")) : undefined
    if (currentState) {
        document.getElementById("gameState").innerText = "Pick a Cell and Guess Your Number"
        renderGameBoard(gameLevel, currentState.board)
        renderNumberPad()
    } else {
        resetGame(gameLevel, true)
    }
})

window.addEventListener('keydown', (e) => {
    if (!isNaN(+e.key) && +e.key > 0 && +e.key <= 9) {
        fillTheCellwith(e.key)
    }
})