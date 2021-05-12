const gameState = {}

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
    fps: {
        target: 1,
        forceSetTimeOut: true
    },
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
}

function create() {
    var westWall = this.add.sprite(0, 0, 'vertical-wall')
    westWall.setOrigin(0,0)
    var southWall = this.add.sprite(0, 290, 'horizontal-wall')
    southWall.setOrigin(0,0)
    var eastWall = this.add.sprite(290, 0, 'vertical-wall')
    eastWall.setOrigin(0,0)
    var northWall = this.add.sprite(0, 0, 'horizontal-wall')
    northWall.setOrigin(0,0)
    var head = this.add.sprite(0, 0, 'head')
    head.setOrigin(0,0)
    var body = this.add.sprite(0, 0, 'body')
    body.setOrigin(0,0)

    this.physics.collider('head', 'vertical-wall')
    this.physics.collider('head', 'horizontal-wall')
}

function update() {

}

var game = new Phaser.Game(config);