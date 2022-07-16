const canvas = document.querySelector('canvas');
const cContext = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

cContext.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7
class Sprite {
    constructor({position, velocity, color = 'red', offset}) {
        this.position = position
        this.velocity = velocity
        this.height = 150
        this.width = 50
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },

            //offset argument for hitbox
            offset,
            width: 100,
            height: 50 
        }
        this.color = color
        this.isAttacking = false
        this.health = 100
    }


    //Draws initial character sprite
    draw() {
        cContext.fillStyle = this.color
        cContext.fillRect(this.position.x, this.position.y, this.width, this.height)

        // attack box
        if (this.isAttacking) {
        cContext.fillStyle = 'green'
        cContext.fillRect(this.attackBox.position.x, this.attackBox.position.y+ 20, this.attackBox.width, this.attackBox.height)
        }
        
    }


    //Update location of Sprites
    update() {
        this.draw()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0
        } else this.velocity.y += gravity
    }

    attack() {
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    }
}

const player1 = new Sprite({
    // initial position of player1
    position: {
    x: 0,
    y: 0
    },
    velocity: {
        x: 0,
        y: 0,
    },
    offset: {
        x: 0,
        y: 0
    }
})


const player2 = new Sprite({
    // initial position of player2
    position: {
    x: canvas.width - 50,
    y:0
    },
    velocity: {
        x: 0,
        y: 0,
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    }

})


const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}

function rectangularCollision({
    rectangle1,
    rectangle2
}) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >=rectangle2.position.x
        &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
        &&
        rectangle1.attackBox.position.y +rectangle2.attackBox.height >=rectangle2.position.y
        &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
        )
}


function animate() {
    window.requestAnimationFrame(animate)
    cContext.fillStyle = 'black'
    cContext.fillRect(0,0,canvas.width,canvas.height)
    player1.update('red')
    player2.update('blue')

    // default velocity if nothing is pressed
    player1.velocity.x = 0
    player2.velocity.x = 0

    //Player 1 Movement
    if (keys.a.pressed && player1.lastKey === 'a' ) {
        player1.velocity.x = -5;
    } else if (keys.d.pressed && player1.lastKey === 'd') {
        player1.velocity.x = 5;
    }

    //Player 2 Movement
    if (keys.ArrowLeft.pressed && player2.lastKey === 'ArrowLeft' ) {
        player2.velocity.x = -5;
    } else if (keys.ArrowRight.pressed && player2.lastKey === 'ArrowRight') {
        player2.velocity.x = 5;
    }

    // detect for collision
    if (
        rectangularCollision({
            rectangle1: player1,
            rectangle2: player2
    }) && player1.isAttacking
    ) {
        player1.isAttacking = false
        player2.health -= 10
        document.querySelector('#Player2Health').style.width = player2.health + '%'
    }
    if (
        rectangularCollision({
            rectangle1: player2,
            rectangle2: player1
    }) && player2.isAttacking
    ) {
        player2.isAttacking = false
        player1.health -= 10
        document.querySelector('#Player1Health').style.width = player1.health + '%'
    }
}

animate()

window.addEventListener('keydown', (event) => {
    switch (event.key) {

        //Player 1 keys
        case 'd':
        keys.d.pressed = true
        player1.lastKey = 'd'
        break

        case 'a':
        keys.a.pressed = true
        player1.lastKey = 'a'
        break

        case 'w':
        player1.velocity.y = -20
        break
        
        case ' ':
        player1.attack()
        break
        
        //Player 2 keys
        case 'ArrowRight':
        keys.ArrowRight.pressed = true
        player2.lastKey = 'ArrowRight'
        break

        case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        player2.lastKey = 'ArrowLeft'
        break

        case 'ArrowUp':
        player2.velocity.y = -20
        break
        
        case 'ArrowDown':
        player2.attack()
        break
    }
})
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        //Player 1 keys
        case 'd':
        keys.d.pressed = false
        break
        case 'a':
        keys.a.pressed = false
        break
        case 'w':
        keys.w.pressed = false
        break

        //Player 2 keys
        case 'ArrowRight':
        keys.ArrowRight.pressed = false
        break
        case 'ArrowLeft':
        keys.ArrowLeft.pressed = false
        break
        case 'ArrowUp':
        keys.ArrowUp.pressed = false
        break
    }
})

