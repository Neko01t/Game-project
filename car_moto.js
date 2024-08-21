// ---- Get the canvas and its context
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const img = new Image();
const resetButt = document.getElementsByClassName('reset')
img.src = './assists/car.png';

// ---- Player and game settings
let x = 800 - 100;
let y = 190;
let speed = 10;
let enmySpeed = 2;
let enmycar = [];
let num_ofenmy = 5;
//---- canavs settings 
canvas.width = 500;
canvas.height = 800;

const canHeight = canvas.height - 100;
const canWidth = canvas.width - 95;
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
//-----  just code ---

// ------ just code ----- 
// car touch game over
function carPlayer() {
    ctx.drawImage(img, y, x, 100, 100);
    if (x < 0 || y < 0 || x > canHeight || y > canWidth) {
        ctx.font = '30px Arial';
        ctx.fillStyle = "white";
        ctx.fillText('Game over!', 150, 250);
        return false;
    }
    return true;
}

// Enemy Cars factory
function CarEnemy(cx, cy) {
    this.cx = cx;
    this.cy = cy;

    this.drawEnemy = () => {
        ctx.drawImage(img, this.cy, this.cx, 100, 100);
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
        if (Math.abs(distanceX) < 50 && Math.abs(distanceY) < 50) {
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
        ctx.font = '30px Arial';
        ctx.fillStyle = "white";
        ctx.fillText('Game over!', canvas.height / 4, canvas.width / 2);
    }
}

// Initialize the game
img.onload = function () {
    initEnemies();
    positionCars();
    animate();
};
