// ---- Get the canvas and its context
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const img = new Image();
const enmyimg = new Image();
const resetButt = document.getElementsByClassName('reset')
enmyimg.src = './imgs/enmycar.png';
img.src = './imgs/car.png';
// console.log(enmyimg)
// ---- Player and game settings
let x = 600 - 100;
let y = 190;
let speed = 5;
let enmySpeed = 2;
let enmycar = [];
let num_ofenmy = 8;
let score = 0;
//---- canavs settings 
canvas.width = 500;
canvas.height = 700;
canvas.style.width = '500px';
canvas.style.height = '700px';

const canHeight = canvas.height - 100;
const canWidth = canvas.width - 100;
// Handle keypress for movement
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});
window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});
function movePlayer() {
    if (keys['d'] || keys['ArrowRight']) {
        if (y < canWidth) {
            y += speed;
        }
    }
    if (keys['w'] || keys['ArrowUp']) {
        if (x > 0) {
            x -= speed;
        }
    }
    if (keys['s'] || keys['ArrowDown']) {
        if (x < canHeight) {
            x += speed;
        }
    }
    if (keys['a'] || keys['ArrowLeft']) {
        if (y > 0) {
            y -= speed;
        }
    }
}
//move with buttons 
function left() {
    if (y > 0) {
        y -= speed;
    }
}
function right() {
    if (y < canWidth) {
        y += speed;
    }
}

function up() {
    if (x > 0) {
        x -= speed;
    }
}
function down() {
    if (x < canHeight) {
        x += speed;
    }
}


//-----  just code ---

let scorecounter = setInterval(() => {
    score += 1
    console.log(score);
}, 1000);

function showscore() {
    ctx.font = '30px lighter Courier New';
    ctx.fillStyle = "white";
    ctx.fillText(`${score}`, 50, 50);
}
// ------ just code ----- 
// car touch game over
function carPlayer() {
    ctx.drawImage(img, y, x, 100, 100);
    if (x < 0 || y < 0 || x > canHeight || y > canWidth) {
        return false;
    }
    return true;
}

// Enemy Cars factory
function CarEnemy(cx, cy) {
    this.cx = cx;
    this.cy = cy;

    this.drawEnemy = () => {
        ctx.drawImage(enmyimg, this.cy, this.cx, 100, 100);
    };

    this.moveEnemy = () => {
        this.cx += enmySpeed;
        if (this.cx > canvas.height) {
            this.cx = Math.floor(Math.random() * (-500 + 100) - 100);
            this.cy = Math.floor(Math.random() * canWidth);
        }
        this.drawEnemy();
    };
}

// Check for crash 
function checkCollision() {
    for (let i = 0; i < enmycar.length; i++) {
        const car = enmycar[i];
        const distanceX = car.cx - x;
        const distanceY = car.cy - y;
        if (Math.abs(distanceX) <= 70 && Math.abs(distanceY) < 50) {
            console.log("Collision detected!");
            return true
        }
    }
    return false;
}

// Initialize enemy cars
function initEnemies() {
    for (let i = 0; i < num_ofenmy; i++) {
        let cy = Math.floor(Math.random() * canWidth);
        let cx = Math.floor(Math.random() * (-500 + 100) - 100);
        enmycar.push(new CarEnemy(cx, cy));
    }
}

// Prevent cars from summoning too close to each other (this was too hard to figure out )
function positionCars() {
    for (let i = 0; i < enmycar.length; i++) {
        for (let j = 0; j < i; j++) {
            let distance = Math.hypot(enmycar[i].cx - enmycar[j].cx, enmycar[i].cy - enmycar[j].cy);
            if (distance < 80) {
                enmycar[j].cx -= 200;
                enmycar[j].cy += 200;
            }
        }
    }
}
// Main animation loop

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    movePlayer();
    if (carPlayer() && !checkCollision()) {
        for (let i = 0; i < enmycar.length; i++) {
            enmycar[i].moveEnemy();
        }
        requestAnimationFrame(animate);
    } else {
        ctx.font = 'oblique bold 30px Courier New';
        ctx.fillStyle = "white";
        ctx.fillText('Game over!', canvas.height / 4, canvas.width / 2);
        clearInterval(scorecounter)

    }
    showscore();
}

// Initialize the game
img.onload = function () {
    initEnemies();
    positionCars();
    animate();
};
