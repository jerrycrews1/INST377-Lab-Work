/* eslint-disable no-plusplus */
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const width = 10

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

    const createDivs = () => {
        for (i = 0; i < 200; i++) {
            const div = document.createElement('div')
            grid.appendChild(div)
        }

        for (i = 0; i < 10; i++) {
            const div = document.createElement('div')
            div.classList.add('taken')
            grid.appendChild(div)
        }
        squares = Array.from(document.querySelectorAll('.grid div'))
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

    const moveDown = () => {
        undraw()
        currentPosition += width
        draw()
    }
    // make the tetromino move down every second
    timerId = setInterval(moveDown, 100)
})
