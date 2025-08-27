const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreText = document.getElementById('score');
const restartBtn = document.getElementById('restart');

const modal = document.getElementById('gameOverModal');
const finalScoreText = document.getElementById('finalScore');
const playAgainBtn = document.getElementById('playAgain');

const box = 20;
let snake, food, score, highScore = 0, direction, level, gameInterval, speed;

function resetGame() {
    snake = [{ x: 8 * box, y: 10 * box }];
    food = randomFood();
    score = 0;
    level = 1;
    direction = "RIGHT";
    speed = 250;
    updateScoreboard();
    clearInterval(gameInterval);
    modal.style.display = "none"; // hide modal on restart
    gameInterval = setInterval(draw, speed);
}

function randomFood() {
    return {
        x: Math.floor(Math.random() * 20) * box,
        y: Math.floor(Math.random() * 20) * box
    };
}

function drawBox(x, y, color) {
    ctx.fillStyle = color;
    ctx.shadowBlur = 6;
    ctx.shadowColor = color;
    ctx.fillRect(x, y, box, box);
    ctx.shadowBlur = 0;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Snake
    for (let i = 0; i < snake.length; i++) {
        drawBox(snake[i].x, snake[i].y, i === 0 ? "#00C896" : "#009f75");
    }

    // Food
    drawBox(food.x, food.y, "#FF6B6B");

    // Movement
    let headX = snake[0].x;
    let headY = snake[0].y;
    if (direction === "LEFT") headX -= box;
    if (direction === "RIGHT") headX += box;
    if (direction === "UP") headY -= box;
    if (direction === "DOWN") headY += box;

    // Collision
    if (
        headX < 0 || headY < 0 || headX >= canvas.width || headY >= canvas.height ||
        snake.some((seg, i) => i !== 0 && seg.x === headX && seg.y === headY)
    ) {
        clearInterval(gameInterval);
        showGameOver();
        return;
    }

    // Eat food
    if (headX === food.x && headY === food.y) {
        score++;
        if (score > highScore) highScore = score;
        food = randomFood();

        if (score % 5 === 0) {
            level++;
            speed = Math.max(50, speed - 10);
            clearInterval(gameInterval);
            gameInterval = setInterval(draw, speed);
        }
    } else {
        snake.pop();
    }

    snake.unshift({ x: headX, y: headY });
    updateScoreboard();
}

function updateScoreboard() {
    scoreText.innerText = `Score: ${score} | High Score: ${highScore} | Level: ${level}`;
}

function showGameOver() {
    finalScoreText.textContent = `Final Score: ${score}`;
    modal.style.display = "flex";
}

// Controls
document.addEventListener('keydown', e => {
    if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

restartBtn.addEventListener("click", resetGame);
playAgainBtn.addEventListener("click", resetGame);

resetGame();