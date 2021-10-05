/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-loop-func */
/* eslint-disable indent */
/* eslint-disable no-plusplus */
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const miniGrid = document.querySelector('.mini-grid')
    let squares
    let displaySquares
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const width = 10
    const displayWidth = 4
    const displayIndex = 0
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = ['orange', 'red', 'purple', 'green', 'blue']

    // The Tetrominoes
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2],
    ]

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
    ]

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1],
    ]

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
    ]

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
    ]

    const theTetrominoes = [
        lTetromino,
        zTetromino,
        tTetromino,
        oTetromino,
        iTetromino,
    ]

    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], // lTetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // zTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], // tTetromino
        [0, 1, displayWidth, displayWidth + 1], // oTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], // iTetromino
    ]

    const createDivs = () => {
        // main divs
        for (let i = 0; i < 200; i++) {
            const div = document.createElement('div')
            grid.appendChild(div)
        }
        // taken divs
        for (let i = 0; i < 10; i++) {
            const div = document.createElement('div')
            div.classList.add('taken')
            grid.appendChild(div)
        }
        squares = Array.from(document.querySelectorAll('.grid div'))

        // mini divs
        for (let i = 0; i < 16; i++) {
            const div = document.createElement('div')
            miniGrid.appendChild(div)
        }
        displaySquares = document.querySelectorAll('.mini-grid div')
    }
    createDivs()

    // randomly assign tetromino
    let random = Math.floor(Math.random() * theTetrominoes.length)
    let currentPosition = 4
    let currentRotation = 0
    let current = theTetrominoes[random][currentRotation]

    // draw the tetromino

    const draw = () => {
        current.forEach((index) => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor =
                colors[random]
        })
    }

    // undraw the tetromino
    const undraw = () => {
        current.forEach((index) => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }

    // display the shape in the mini grid

    const displayMiniGridShape = () => {
        // remove class 'tetromino' from entire mini-grid
        displaySquares.forEach((square) => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach((index) => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor =
                colors[nextRandom]
        })
    }

    const addScore = () => {
        for (let i = 0; i < 199; i += width) {
            const row = [
                i,
                i + 1,
                i + 2,
                i + 3,
                i + 4,
                i + 5,
                i + 6,
                i + 7,
                i + 8,
                i + 9,
            ]

            if (
                row.every((index) => squares[index].classList.contains('taken'))
            ) {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach((index) => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach((cell) => grid.appendChild(cell))
            }
        }
    }

    // freeze function
    const freeze = () => {
        if (
            current.some((index) =>
                squares[currentPosition + index + width].classList.contains(
                    'taken'
                )
            )
        ) {
            current.forEach((index) => {
                squares[currentPosition + index].classList.add('taken')
            })

            // start a new tetromino falling
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayMiniGridShape()
            addScore()
            gameOver()
        }
    }

    const moveDown = () => {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    // move the tetromino left
    const moveLeft = () => {
        undraw()
        const isAtLeftEdge = current.some(
            (index) => (currentPosition + index) % width === 0
        )
        if (!isAtLeftEdge) {
            currentPosition -= 1
        }

        if (
            current.some((index) =>
                squares[currentPosition + index].classList.contains('taken')
            )
        ) {
            currentPosition += 1
        }
        draw()
    }

    const moveRight = () => {
        undraw()
        const isAtRightEdge = current.some(
            (index) => (currentPosition + index) % width === width - 1
        )
        if (!isAtRightEdge) {
            currentPosition += 1
        }

        if (
            current.some((index) =>
                squares[currentPosition + index].classList.contains('taken')
            )
        ) {
            currentPosition -= 1
        }
        draw()
    }

    // rotate
    const rotate = () => {
        undraw()
        currentRotation++
        if (currentRotation === current.length) {
            currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        draw()
    }

    const control = (e) => {
        switch (e.keyCode) {
            case 37:
                moveLeft()
                break
            case 38:
                rotate()
                break
            case 39:
                moveRight()
                break
            case 40:
                // moveDown()
                break
            default:
                break
        }
    }
    document.addEventListener('keyup', control)

    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, 300)
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            displayMiniGridShape()
        }
    })

    const gameOver = () => {
        if (
            current.some((index) =>
                squares[currentPosition + index].classList.contains('taken')
            )
        ) {
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerId)
        }
    }
})
