const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const score = document.querySelector(".score--value")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-screen")
const buttonPlay = document.querySelector(".btn-play")

//tamanho de cada parte e posição inicial da cobrinha 
const size = 30

const initialPosition = {x: 270, y: 240}
let snake = [initialPosition]

const incrementScore = () => {
    score.innerText = parseInt(score.innerText) + 10
}

let direction, loopId

const randomNumber = (min, max) => {
    //gerando valor aleatório (arredondado)
    return Math.round(Math.random() * (max - min) + min)
}

const randoPosition = () => {
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30
}

const randomColor = () => {
    const red = randomNumber(0, 255)
    const green = randomNumber(0, 255)
    const blue = randomNumber(0, 255)

    return `rgb(${red}, ${green}, ${blue})`
}

const audio = new Audio('../assets/eat.mp3')

//posiçao da frutinha
const food = {
    x: randoPosition(), 
    y: randoPosition(), 
    color: randomColor()
}

//desenhando a cobrinha
const drawSnake = () => {
    ctx.fillStyle = "#BFC9CA"
    
    snake.forEach((position, index) => {
        if(index == snake.length - 1){
            ctx.fillStyle = "white"
        }
        ctx.fillRect(position.x, position.y, size, size)
    })
}
//movendo a cobrinha
const moveSnake = () => {
    if(!direction) return
    const head = snake[snake.length - 1]

    if(direction == "right"){
        snake.push({x: head.x + size, y: head.y})
    }
    if(direction == "left"){
        snake.push({x: head.x - size, y: head.y})
    }
    if(direction == "down"){
        snake.push({x: head.x, y: head.y + size})
    }
    if(direction == "up"){
        snake.push({x: head.x, y: head.y - size})
    }

    snake.shift()
}
//desenhando a frutinha
const drawFood = () => {
    const{x, y, color} = food

    ctx.shadowColor = color
    ctx.shadowBlur = 7
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0
}
//desenhando o grid
const drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "#363636"

    for(let i = 30; i < canvas.width; i += 30){
        //linhas verticais
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        //linhas horizontais
        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }
}

//a cobra comeu a fruta? gere nova fruta com uma nova cor
const checkEat = () => {
    const head = snake[snake.length - 1]

    if(head.x == food.x && head.y == food.y){
        snake.push(head)
        audio.play()
        incrementScore()

        let x = randoPosition()
        let y = randoPosition()

        while(snake.find((position) => position.x == x && position.y == y)){
            x = randoPosition()
            y = randoPosition()
        }

        food.x = x
        food.y = y
        food.color = randomColor()
    }
}

//colidiu com o rabo ou com a parede?
const checkCollision = () => {
    const head = snake[snake.length - 1]  //cabeça da cobra
    const canvasLimit = canvas.width - size  //limite da tela
    const neckIndex = snake.length - 2 //colisão a partir do pescoço
    const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

    //a cobra não pode colidir com a propria cabeça
    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })

    //se colidiu com a parede ou com o proprio corpo
    if(wallCollision || selfCollision){
        gameOver()
    }
}

const gameOver = () => {
    direction = undefined

    menu.style.display = "flex"
    finalScore.innerText = score.innerText
    canvas.style.filter = "blur(3px)"
}

//loop do jogo
const gameLoop = () => {
    clearInterval(loopId)

    ctx.clearRect(0, 0, 600, 600)
    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()
    checkEat()
    checkCollision()

    loopId = setTimeout(() => {
        gameLoop()
    }, 300)
}

gameLoop()

//controlando a direção da cobrinha
document.addEventListener("keydown", ({key}) =>{
    if(key == "ArrowRight" && direction != "left"){
        direction = "right"
    }
    if(key == "ArrowLeft" && direction != "right"){
        direction = "left"
    }
    if(key == "ArrowDown" && direction != "up"){
        direction = "down"
    }
    if(key == "ArrowUp" && direction != "down"){
        direction = "up"
    }
})

buttonPlay.addEventListener("click", () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"

    snake = [initialPosition]
})