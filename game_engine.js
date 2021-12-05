/**
 * game properties 
 */
const settings = {
    gameticks: 300,
    playground: {
        width: 20,
        height: 20,
        background: 'black'
    },
    start_length: 5,
    max_food: 20,
    score: {
        per_food: 20,
        per_length: 40
    }

}

/**
 * contains the pos
 */
const snake = {
    x: [],
    y: [],
    length: settings.start_length
}

/**
 * contains food pos
 */
const food = {
    x: [],
    y: [],
}

const score = {
    food: 0,
    length: 0,
    total: 0
}
/**
 *  default move direction is up
 *  directions up: 0, right: 1, down: 2, left:3
 */
var direction = 0

/**
 * if game is running
 */
var gameon = false

/**
 * Setup the canvas
 */
const setup = () => {

    //Clear
    snake.x = [], snake.y = [], snake.length = settings.start_length, food.x = [], food.y = [], score.total = 0, score.length = 0, score.food = 0, score.time = 0

    //Load
    const playground = document.getElementById('playground')
    playground.height = settings.playground.height * 10
    playground.width = settings.playground.width * 10
    const ctx = playground.getContext('2d')

    //draw
    for (var x = 1; playground.width >= x; x += 10) {

        for (var y = 1; playground.height >= y; y += 10) {

            ctx.fillStyle = settings.playground.background
            ctx.fillRect(x, y, 8, 8)
        }
    }

    //set start pos
    ctx.fillStyle = 'red'
    ctx.fillRect(
        (snake.x[0] = playground.width / 2 + 1),
        (snake.y[0] = playground.height / 2 + 1),
        8, 8)

    gameon = false
}

/**
 * Main game function
 */
const game = () => {

    const spawnfood = playground => {

        let x, y

        //Get Randome coords
        x = Math.round(Math.random() * (playground.width / 10 - 2) + 2) * 10 + 1
        y = Math.round(Math.random() * (playground.height / 10 - 2) + 2) * 10 + 1

        //If there is anything, skip this
        if (snake.x.includes(x) || snake.y.includes(y) || food.x.includes(x) || food.y.includes(y)) {

            return
        }

        //Skip when the max food count is reached
        if (food.x.length > settings.max_food - 1 || food.y.length > settings.max_food - 1) {

            return
        }

        //Add new trail
        food.x.unshift(x)
        food.y.unshift(y)

        var ctx = playground.getContext('2d')

        ctx.fillStyle = 'green'
        ctx.fillRect(
            x,
            y,
            8, 8)
    }

    let x, y, fx, fy

    //Load playground
    const playground = document.getElementById('playground')
    var ctx = playground.getContext('2d')

    //Add the direction to the snake
    if (direction == 0) {

        x = snake.x[0]
        y = snake.y[0] - 10
    } else if (direction == 1) {

        x = snake.x[0] + 10
        y = snake.y[0]
    } else if (direction == 2) {

        x = snake.x[0]
        y = snake.y[0] + 10
    } else if (direction == 3) {

        x = snake.x[0] - 10
        y = snake.y[0]
    }

    //Add new trail
    snake.x.unshift(x)
    snake.y.unshift(y)

    //Remove last
    if (snake.x.length > snake.length + 1) {

        snake.x.pop()
        snake.y.pop()
    }

    //Handle playground overflow
    if (snake.x[0] > playground.width) {

        snake.x[0] = 1
    } else if (snake.x[0] < 0) {

        snake.x[0] = playground.width - 9
    } else if (snake.y[0] > playground.height) {

        snake.y[0] = 1
    } else if (snake.y[0] < 0) {

        snake.y[0] = playground.height - 9
    }



    //Pain the snake
    ctx.fillStyle = 'red'
    ctx.fillRect(
        snake.x[0],
        snake.y[0],
        8, 8)

    //Remove the rest of the snake
    ctx.fillStyle = settings.playground.background
    ctx.fillRect(
        snake.x[snake.length],
        snake.y[snake.length],
        8, 8)

    //Spawn food
    spawnfood(playground)

    //Handle food
    if ((fx = food.x.indexOf(snake.x[0])) > -1 && (fy = food.y.indexOf(snake.y[0])) > -1) {

        food.x.splice(fx, 1)
        food.y.splice(fy, 1)
        snake.length += 1

        //Score!
        score.food += settings.score.per_food
        score.length += settings.score.per_length * snake.length

    }

    //Count Score
    score.total = score.food + score.length

    //Display Score
    document.getElementById("total-score").textContent = score.total

    //Game over transition
    if (snake.x.length > 1) {

        for (var i = 1; i < snake.x.length - 1; i++) {

            if (snake.x[i] == snake.x[0] && snake.y[i] == snake.y[0]) {

                alert("Game Over")
                location.reload()
                return
            }
        }
    }
}

/**
 * Handle keydown events
 * 
 * @param {*} event 
 */
const event = (event) => {

    if (!gameon && (event.key == 'w' || event.key == 'a' || event.key == 's' || event.key == 'd')) {

        setInterval(game, settings.gameticks)
        gameon = true
    }

    //save last input
    switch (event.key) {

        case 'w':

            direction = 0
            break
        case 'a':

            direction = 3
            break
        case 's':


            direction = 2
            break
        case 'd':

            direction = 1
            break
    }
}

