const gameState = {
    snake: {
        direction: 0,     // 0:up, 1:right, 2:down, 3:left
    },

    frameDelay: 10,
    frameRefresh: 0
}

var config = {
    type: Phaser.AUTO,
    width: 300,
    height: 300,
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

function create() {
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

    gameState.music = this.sound.add('bgm')
    gameState.music.loop = true     // To loop
    gameState.music.play()

    gameState.snake.body = []
    for (var y = 160; y < 190; y += 10) {
        body = this.add.sprite(150, y, 'body')
        body.setOrigin(0, 0)
        gameState.snake.body.push(body)
    }

    gameState.cursors = this.input.keyboard.createCursorKeys()

}

function moveSnake() {
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

    // Using saved (x,y), shift all body's (x,y) one by one
    for (let i=0; i< gameState.snake.body.length; i++) {
        curBody = gameState.snake.body[i]
        
        curBody.x = oldX
        curBody.y = oldY

        
    }
}

function update() {
    if (gameState.frameRefresh < 0) {
        // Draw Snake by moving coordinate
        moveSnake()

        // Reset frameRefresh counter
        gameState.frameRefresh = gameState.frameDelay
    }
    else {
        // check keyboard, if pressed
        if (gameState.cursors.up.isDown) {
            gameState.snake.direction = 0
        }

        if (gameState.cursors.right.isDown) {
            gameState.snake.direction = 1
        }

        if (gameState.cursors.down.isDown) {
            gameState.snake.direction = 2
        }

        if (gameState.cursors.left.isDown) {
            gameState.snake.direction = 3
        }

        // Reduce frameRefresh counter.
        --gameState.frameRefresh;
    }
}

var game = new Phaser.Game(config);