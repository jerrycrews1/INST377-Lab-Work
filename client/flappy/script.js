document.addEventListener('DOMContentLoaded', () => {
    const bird = document.querySelector('.bird')
    const gameDisplay = document.querySelector('.game-container')
    const ground = document.querySelector('.ground')
    const scoreContainer = document.querySelector('.score')
    const gameOverDiv = document.querySelector('.game-over-container')
    const scoreDiv = document.querySelector('.current-score')
    const highScoreDiv = document.querySelector('.high-score')

    let birdLeft = 220
    let birdBottom = 150
    let gravity = 2
    let isGameOver = false
    let gap = 480
    let score = 0

    function startGame() {
        birdBottom -= gravity * 1.6
        bird.style.bottom = birdBottom + 'px'
        bird.style.left = birdLeft + 'px'
        scoreContainer.innerHTML = 'Score: ' + score
    }
    let gameTimerId = setInterval(startGame, 20)

    function control(e) {
        if (e.keyCode == 32) {
            jump()
        }
    }

    function jump() {
        if (birdBottom < 500) birdBottom += 65
        bird.style.bottom = birdBottom + 'px'
    }
    document.addEventListener('keyup', control)

    function generateObstacle() {
        let obstacleLeft = 500
        let randomHeight = Math.random() * 60
        let obstacleBottom = randomHeight

        const obstacle = document.createElement('div')
        const topObstacle = document.createElement('div')

        if (!isGameOver) {
            obstacle.classList.add('obstacle')
            topObstacle.classList.add('top-obstacle')
        }

        gameDisplay.appendChild(obstacle)
        gameDisplay.appendChild(topObstacle)

        obstacle.style.left = obstacleLeft + 'px'
        topObstacle.style.left = obstacleLeft + 'px'
        obstacle.style.bottom = obstacleBottom + 'px'
        topObstacle.style.bottom = obstacleBottom + gap + 'px'

        function moveObstacle() {
            obstacleLeft -= 2
            obstacle.style.left = obstacleLeft + 'px'
            topObstacle.style.left = obstacleLeft + 'px'

            if (obstacleLeft === -60) {
                clearInterval(timerId)
                gameDisplay.removeChild(obstacle)
                gameDisplay.removeChild(topObstacle)
            }
            console.log(birdBottom)
            if (
                (obstacleLeft > 200 &&
                    obstacleLeft < 280 &&
                    birdLeft === 220 &&
                    (birdBottom < obstacleBottom + 153 ||
                        birdBottom > obstacleBottom + gap - 200)) ||
                birdBottom < 0 ||
                birdBottom > 510
            ) {
                gameOver()
                clearInterval(timerId)
            }

            if (obstacleLeft === 200) {
                setScore()
            }
        }
        let timerId = setInterval(moveObstacle, 20)
        if (!isGameOver) setTimeout(generateObstacle, 3000)
    }
    generateObstacle()

    function gameOver() {
        clearInterval(gameTimerId)
        console.log('game over')
        isGameOver = true

        document.removeEventListener('keyup', control)
        gameOverDiv.style.display = 'block'
        scoreDiv.innerHTML = score
    }

    function setScore() {
        score += 1
    }
})
