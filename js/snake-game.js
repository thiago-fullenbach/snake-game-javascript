window.onload = () => {
    const stage = document.getElementById('snake-screen')
    const ctx = stage.getContext('2d')
    const snakeColor = '#fafafa'
    const appleColor = 'red'
    const stageColor = 'black'

    const lp = 30
    const qp = 20
    const vel = 1
    let lives = 3
    let px = 5
    let py = 10
    let vx = 1
    let vy = 0
    let ax = 15
    let ay = 10

    let trail = []
    tail = 5

    const lifeCounter = document.getElementById('info-lives')
    const scoreCounter = document.getElementById('info-score')
    lifeCounter.innerHTML = lives
    scoreCounter.innerHTML = tail + 1
    document.onkeydown = e => setDirection(e.key)

    function restart() { // restarts game by pressing "R" button
        lives = 3
        resetGame()
        if(!runGame)
            runGame = setInterval(snakeGame, 1000/15)
    }

    function resetGame() { // reset all game variables
        trail = []
        tail = 5
        px = 5
        py = 10
        vx = 1
        vy = 0
        ax = 15
        ay = 10
        lifeCounter.innerHTML = lives
        updateScore()
    }

    function stopGame() {
        writeMsg('You  Lost!  Press  "R"  to  restart', '2rem')
        clearInterval(runGame)
        runGame = null
    }

    function updateScore() {
        scoreCounter.innerHTML = tail + 1
    }

    function writeMsg(text, textSize) {
        ctx.font = '2rem ArcadeClassic'
        ctx.fillStyle = snakeColor
        ctx.fillText(text, 2 * lp, 2 * lp)
    }

    function drawPiece(color, x, y, w = lp, h = lp) {
        ctx.fillStyle = color
        ctx.fillRect(x, y, w, h)
    }

    function clearStage() {
        drawPiece(stageColor, 0, 0,
            stage.clientWidth, stage.clientHeight)
    }

    function newApple() { // set new apple position
        trail.forEach(part => {
            while(ax == part.x && ay == part.y) { // prevents apple from spawning in the snake's body
                ax = Math.floor(Math.random()*qp)
                ay = Math.floor(Math.random()*qp)
            }
        })
    }

    function setDirection(key) {
        if(key == 'ArrowLeft' && vx == 0) {
            vx = - vel
            vy = 0
        }
        if(key == 'ArrowUp' && vy == 0) {
            vx = 0
            vy = - vel
        }
        if(key == 'ArrowRight' && vx == 0) {
            vx = vel
            vy = 0
        }
        if(key == 'ArrowDown' && vy == 0) {
            vx = 0
            vy = vel
        }
        if(key == 'r')
            restart()
    }

    function checkCollision() {
        trail.forEach(part => {
            drawPiece(snakeColor, part.x * lp, part.y * lp)
            if(part.x == px && part.y == py) { // checks collision
                lives--
                resetGame()
            }
        })
    }

    function snakeGame() {
        px += vx
        py += vy

        if(px > qp - 1)
            px = 0
        if(px < 0)
            px = qp - 1
        if(py > qp - 1)
            py = 0
        if(py < 0)
            py = qp - 1

        clearStage()

        drawPiece(appleColor, ax * lp, ay * lp)

        drawPiece(snakeColor, px * lp, py * lp)
        
        checkCollision()

        trail.push({ x: px, y: py })
        if(trail.length > tail) // limits snake's length
            trail.shift() 

        if(ax == px && ay == py) {
            tail++ // increases snake's length
            updateScore()
            newApple()
        }

        if(!lives)
            stopGame()
    }

    let runGame = setInterval(snakeGame, 1000/15)
}