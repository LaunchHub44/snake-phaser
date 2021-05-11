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
    }
};

function preload() {

}

function create() {

}

function update() {

}

var game = new Phaser.Game(config);