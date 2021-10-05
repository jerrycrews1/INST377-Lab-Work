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
    const displayWidth = 10
    let displayIndex = 0
    let nextRandom = 0
    let timerId

    //The Tetrominoes
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
        for (i = 0; i < 200; i++) {
            const div = document.createElement('div')
            grid.appendChild(div)
        }
        // taken divs
        for (i = 0; i < 10; i++) {
            const div = document.createElement('div')
            div.classList.add('taken')
            grid.appendChild(div)
        }
        squares = Array.from(document.querySelectorAll('.grid div'))

        // mini divs
        for (i = 0; i < 16; i++) {
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
        })
    }

    // undraw the tetromino
    const undraw = () => {
        current.forEach((index) => {
            squares[currentPosition + index].classList.remove('tetromino')
        })
    }

    // display the shape in the mini grid

    const displayMiniGridShape = () => {
        // remove class 'tetromino' from entire mini-grid
        displaySquares.forEach((square) => {
            square.classList.remove('tetromino')
        })
        upNextTetrominoes[nextRandom].forEach((index) => {
            displaySquares[displayIndex + index].classList.add('tetromino')
        })
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
                squares[currentPosition + index].classList.containes('taken')
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
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            displayMiniGridShape()
        }
    })
})
