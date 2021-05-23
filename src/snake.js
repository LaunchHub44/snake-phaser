const gameState = {
    snake: {
        direction: 0,     // 0:up, 1:right, 2:down, 3:left
        head: null,
        body: []
    },

    frameDelay: 5,
    frameRefresh: 0,
    paused: false,
    score: 0
}

var config = {
    type: Phaser.AUTO,
    width: 300,
    height: 330,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    backgroundColor: '#333333',

    // fps: {
    //     target: 5,
    //     forceSetTimeOut: true
    // },

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            enableBody: true,
        }
    }
};

function preload() {
    this.load.image('vertical-wall', '../img/verticalWall.png')
    this.load.image('horizontal-wall', '../img/horizontalWall.png')
    this.load.image('head', '../img/snakeHead.png')
    this.load.image('body', '../img/snakeBody.png')
    this.load.audio('dead', '../audio/dead.mp3')
    this.load.audio('bgm', '../audio/bgm.mp3')
    this.load.audio('apple', '../audio/apple.mp3')
}

// Recursive Function:
//    Very difficult concept!
function getUniqueXY() {
    let rtn = {
        x: Math.floor(Math.random() * 27) * 10 + 10,
        y: Math.floor(Math.random() * 27) * 10 + 10
    }

    // Validation 1:
    if (rtn.x == gameState.snake.head.x && rtn.y == gameState.snake.head.y) {
        // Bad Thing happened!
        //   New apple spawned on the Snake's head
        console.log("Apple on Snake's head ")
        return getUniqueXY()
    }

    // Validation 2:
    for (let i=0; i<gameState.snake.body.length; ++i) {
        if (rtn.x == gameState.snake.body[i].x && rtn.y == gameState.snake.body[i].y) {
            // Bad Thing happened!
            //   New apple spawned on the Snake's body
            console.log("Apple on Snake's body ")
            return getUniqueXY()
        }
    }
    return rtn
}

function spawnApple(scene) {
    let xy = getUniqueXY()
    gameState.apple = scene.add.sprite(xy.x, xy.y, 'head')
    gameState.apple.setOrigin(0,0)

    //console.log(x,  y)
}

function eatApple() {
    if (gameState.snake.head.x == gameState.apple.x  &&
        gameState.snake.head.y == gameState.apple.y ) {
        
        // do something

        return true
    }
    return false
}

function create() {
    gameState.snakeGrow = false

    var westWall = this.add.sprite(0, 0, 'vertical-wall')
    westWall.setOrigin(0, 0)
    var southWall = this.add.sprite(0, 290, 'horizontal-wall')
    southWall.setOrigin(0, 0)
    var eastWall = this.add.sprite(290, 0, 'vertical-wall')
    eastWall.setOrigin(0, 0)
    var northWall = this.add.sprite(0, 0, 'horizontal-wall')
    northWall.setOrigin(0, 0)
    gameState.snake.head = this.add.sprite(150, 150, 'head')
    gameState.snake.head.setOrigin(0, 0)
    gameState.scoreText = this.add.text(115, 305, `Score: ${gameState.score}`)

    // Initial apple
    spawnApple(this)

    gameState.music = this.sound.add('bgm')
    gameState.music.loop = true     // To loop
    gameState.music.play()

    gameState.appleSound = this.sound.add('apple')
    for (var y = 160; y < 190; y += 10) {
        body = this.add.sprite(150, y, 'body')
        body.setOrigin(0, 0)
        gameState.snake.body.push(body)
    }

    gameState.deadSound = this.sound.add('dead')

    gameState.cursors = this.input.keyboard.createCursorKeys()

}

function snakeDied(scene) {
    gameState.deadSound.play()
    gameState.music.stop()
    gameState.appleSound.stop()
    scene.physics.pause()
}

function moveSnake(scene, grow) {
    // Save old-head (x,y) to pass for the first body's new (x,y).
    let oldX = gameState.snake.head.x
    let oldY = gameState.snake.head.y

    // Move Head
    if (gameState.snake.direction == 0) {
        gameState.snake.head.y -= 10
    }

    if (gameState.snake.direction == 1) {
        gameState.snake.head.x += 10
    }

    if (gameState.snake.direction == 2) {
        gameState.snake.head.y += 10
    }

    if (gameState.snake.direction == 3) {
        gameState.snake.head.x -= 10
    }
        
    //console.log(gameState.snake.head.x,  gameState.snake.head.y)

    // If snake ate apple, sound.
    if (eatApple()) {
        gameState.appleSound.play()
        gameState.apple.destroy()
        gameState.snakeGrow = true
        gameState.score += 1
        gameState.scoreText.setText(`Score: ${gameState.score}`)
        spawnApple(scene)
    }

    // Using saved (x,y), shift all body's (x,y) one by one
    for (let i=0; i< gameState.snake.body.length; i++) {
        curBody = gameState.snake.body[i]
        
        let x = curBody.x
        let y = curBody.y

        curBody.x = oldX
        curBody.y = oldY

        oldX = x
        oldY = y
    }

    if (gameState.snakeGrow) {
        let new_body = scene.add.sprite(oldX, oldY, 'body')
        new_body.setOrigin(0,0)
        gameState.snake.body.push(new_body)
        gameState.snakeGrow = false
    }
}

function update() {
    if (gameState.frameRefresh < 0) {
        // Draw Snake by moving coordinate
        moveSnake(this)

        // Reset frameRefresh counter
        gameState.frameRefresh = gameState.frameDelay
    }
    else {
        // check keyboard, if pressed
        if (gameState.snake.direction != 2 && gameState.cursors.up.isDown) {
            gameState.snake.direction = 0
        }

        if (gameState.snake.direction != 3 && gameState.cursors.right.isDown) {
            gameState.snake.direction = 1
        }

        if (gameState.snake.direction != 0 && gameState.cursors.down.isDown) {
            gameState.snake.direction = 2
        }

        if (gameState.snake.direction != 1 && gameState.cursors.left.isDown) {
            gameState.snake.direction = 3
        }

        // Debug only
        if (gameState.cursors.space.isDown) {
            if (gameState.paused) {
                gameState.paused = false
                this.scene.resume()
            } else {
                gameState.paused = true
                this.scene.pause()
            }
        }
        // Reduce frameRefresh counter.
        --gameState.frameRefresh;
    }

    if (gameState.snake.head.x < 0  || gameState.snake.head.x > 290 ||
        gameState.snake.head.y < 0 || gameState.snake.head.y > 290) {
            snakeDied()
    }

    // Find if head bit body.
    for (var i = 0; i < gameState.snake.body.length; i++) {
        if (gameState.snake.head.x == gameState.snake.body[i].x &&
            gameState.snake.head.y == gameState.snake.body[i].y) {
                snakeDied()
        }
    }
}

var game = new Phaser.Game(config);