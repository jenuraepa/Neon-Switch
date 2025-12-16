const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('scoreDisplay');

let score = 0;
let gameRunning = true;
let frameCount = 0;

const COLOR_A = "#00FFFF";
const COLOR_B = "#FF00FF"; 

const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 50,
    width: 50,
    height: 20,
    color: COLOR_A,
    speed: 7
};

let blocks = [];
const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    
    if (e.code === 'Space' && gameRunning) {
        if (player.color === COLOR_A) {
            player.color = COLOR_B;
        } else {
            player.color = COLOR_A;
        }
    }

    if (e.code === 'Enter' && !gameRunning) {
        resetGame();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

function spawnBlock() {
    const randomColor = Math.random() < 0.5 ? COLOR_A : COLOR_B;
    const randomX = Math.random() * (canvas.width - 30);

    blocks.push({
        x: randomX,
        y: -30,
        width: 30,
        height: 30,
        color: randomColor,
        speed: 3 + (score * 0.1)
    });
}

function resetGame() {
    score = 0;
    blocks = [];
    gameRunning = true;
    player.color = COLOR_A;
    scoreDisplay.innerText = "Score: 0";
    gameLoop();
}

function update() {
    if (!gameRunning) return;

    if (keys['ArrowLeft'] && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys['ArrowRight'] && player.x + player.width < canvas.width) {
        player.x += player.speed;
    }

    frameCount++;
    if (frameCount % 60 === 0) {
        spawnBlock();
    }

    for (let i = 0; i < blocks.length; i++) {
        let b = blocks[i];
        b.y += b.speed;

        if (
            b.y + b.height >= player.y &&
            b.y <= player.y + player.height &&
            b.x + b.width >= player.x &&
            b.x <= player.x + player.width
        ) {
            if (b.color === player.color) {
                score++;
                scoreDisplay.innerText = "Score: " + score;
                blocks.splice(i, 1);
                i--;
            } else {
                gameRunning = false;
            }
        }
        else if (b.y > canvas.height) {
             blocks.splice(i, 1);
             i--;
        }
    }
}

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = player.color;
    ctx.shadowBlur = 20;
    ctx.shadowColor = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    for (let b of blocks) {
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.fillRect(b.x, b.y, b.width, b.height);
    }

    ctx.shadowBlur = 0;

    if (!gameRunning) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = "white";
        ctx.font = "30px Courier New";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2);
        ctx.font = "20px Courier New";
        ctx.fillText("Press ENTER to Restart", canvas.width/2, canvas.height/2 + 40);
    }
}

function gameLoop() {
    update();
    draw();
    if (gameRunning) {
        requestAnimationFrame(gameLoop);
    } else {
        draw(); 
    }
}

gameLoop();