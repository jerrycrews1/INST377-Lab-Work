document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const doodler = document.createElement('div')

    let isGameOver = false
    let platformCount = 5
    let upTimerId
    let downTimerId
    let leftTimerId
    let rightTimerId
    let isJumping = true
    let isGoingLeft = false
    let isGoingRight = false
    let score = 0

    let doodlerStartPoint = 150
    let doodlerLeftSpace = 50
    let doodlerBottomSpace = doodlerStartPoint

    let platforms = []

    const createDoodler = () => {
        grid.appendChild(doodler)
        doodler.classList.add('doodler')
        doodlerLeftSpace = platforms[0].left
        doodler.style.left = doodlerLeftSpace + 'px'
        doodler.style.bottom = doodlerBottomSpace + 'px'
    }

    class Platform {
        constructor(newPlatformBottom) {
            this.bottom = newPlatformBottom
            this.left = Math.random() * 315
            this.visual = document.createElement('div')

            const visual = this.visual
            visual.classList.add('platform')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)
        }
    }

    const createPlatforms = () => {
        for (let i = 0; i < platformCount; i++) {
            let platformGap = 600 / platformCount
            let newPlatformBottom = 100 + i * platformGap
            let newPlatform = new Platform(newPlatformBottom)
            platforms.push(newPlatform)
            console.log(platforms)
        }
    }

    const movePlatforms = () => {
        if (doodlerBottomSpace > 200) {
            platforms.forEach((platform) => {
                platform.bottom -= 4
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px'

                if (platform.bottom < 10) {
                    let firstPlatform = platforms[0].visual
                    firstPlatform.classList.remove('platform')
                    platforms.shift()
                    score++
                    console.log(platforms)
                    let newPlatform = new Platform(600)
                    platforms.push(newPlatform)
                }
            })
        }
    }

    const jump = () => {
        clearInterval(downTimerId)
        isJumping = true
        upTimerId = setInterval(() => {
            doodlerBottomSpace += 20
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace > doodlerStartPoint + 200) {
                fall()
            }
        }, 30)
    }

    const fall = () => {
        clearInterval(upTimerId)
        isJumping = false
        downTimerId = setInterval(() => {
            doodlerBottomSpace -= 5
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace <= 0) {
                gameOver()
            }
            // check for collission
            platforms.forEach((platform) => {
                if (
                    doodlerBottomSpace >= platform.bottom &&
                    doodlerBottomSpace <= platform.bottom + 15 &&
                    doodlerLeftSpace + 60 >= platform.left &&
                    doodlerLeftSpace <= platform.left + 85 &&
                    !isJumping
                ) {
                    console.log('landed')
                    doodlerStartPoint = doodlerBottomSpace
                    jump()
                }
            })
        }, 30)
    }

    const gameOver = () => {
        console.log('game over')
        isGameOver = true
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = score
        clearInterval(upTimerId)
        clearInterval(downTimerId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }

    const control = (e) => {
        if (e.key === 'ArrowLeft') {
            moveLeft()
        } else if (e.key === 'ArrowRight') {
            moveRight()
        } else if (e.key === 'ArrowUp') {
            moveStraight()
        }
    }

    const moveLeft = () => {
        if (isGoingRight) {
            clearInterval(rightTimerId)
            isGoingRight = false
        }
        isGoingLeft = true
        leftTimerId = setInterval(() => {
            if (doodlerLeftSpace >= 0) {
                doodlerLeftSpace -= 5
                doodler.style.left = doodlerLeftSpace + 'px'
            } else moveRight()
        }, 20)
    }

    const moveRight = () => {
        if (isGoingLeft) {
            clearInterval(leftTimerId)
            isGoingLeft = false
        }
        isGoingRight = true
        rightTimerId = setInterval(() => {
            if (doodlerLeftSpace <= 340) {
                doodlerLeftSpace += 5
                doodler.style.left = doodlerLeftSpace + 'px'
            } else moveLeft()
        }, 20)
    }

    const moveStraight = () => {
        isGoingRight = false
        isGoingLeft = false
        clearInterval(rightTimerId)
        clearInterval(leftTimerId)
    }

    const start = () => {
        if (!isGameOver) {
            createPlatforms()
            createDoodler()
            setInterval(movePlatforms, 30)
            jump()
            document.addEventListener('keyup', control)
        }
    }
    start()
})
