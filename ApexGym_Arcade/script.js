// ==========================================================
// FUNCTIONAL JAVASCRIPT - DINOSAUR RUNNER GAME LOGIC
// ==========================================================

const runner = document.getElementById('runner');
const obstacle = document.getElementById('obstacles');
const scoreDisplay = document.getElementById('score');
const message = document.getElementById('message');
const gameContainer = document.getElementById('game-container');

let isJumping = false;
let isGameOver = true; // Start in the game over state
let score = 0;
let gameInterval;
let obstacleSpeed = 1500; // Milliseconds for one full cross (1.5 seconds)

// --- 1. JUMP LOGIC ---
function jump() {
    // Only jump if not already jumping AND the game is running
    if (isJumping || isGameOver) return; 
    
    isJumping = true;
    runner.classList.add('jump'); // Add CSS animation class

    // Remove the class after the animation is complete (0.5 seconds)
    setTimeout(() => {
        runner.classList.remove('jump');
        isJumping = false;
    }, 500);
}

// --- 2. START/RESTART GAME (FIXED) ---
function startGame() {
    isGameOver = false; // CRITICAL: Sets the game state to running
    score = 0;
    scoreDisplay.textContent = 'SCORE: 00000';
    message.style.display = 'none';
    
    // Reset obstacle position and restart its animation
    obstacle.style.right = '-50px'; // Move it off-screen to start
    obstacle.style.animation = `move-obstacle ${obstacleSpeed / 1000}s linear infinite`;
    obstacle.classList.add('obstacle-move');
    
    // Start the main game loop for scoring and collision detection
    gameInterval = setInterval(gameLoop, 10);
}

// --- 3. GAME OVER ---
function gameOver() {
    isGameOver = true;
    clearInterval(gameInterval);
    
    // Stop the obstacle movement
    obstacle.style.animation = 'none';
    obstacle.classList.remove('obstacle-move'); 

    message.textContent = `GAME OVER! FINAL SCORE: ${score}`;
    message.style.display = 'block';
}

// --- 4. MAIN GAME LOOP (Collision & Scoring) ---
function gameLoop() {
    if (isGameOver) return;

    // --- SCORING ---
    score++;
    scoreDisplay.textContent = 'SCORE: ' + score.toString().padStart(5, '0');

    // --- COLLISION DETECTION ---
    
    const runnerBottom = parseInt(window.getComputedStyle(runner).getPropertyValue('bottom'));
    const runnerLeft = parseInt(window.getComputedStyle(runner).getPropertyValue('left'));
    const obstacleRight = parseInt(window.getComputedStyle(obstacle).getPropertyValue('right'));

    // 1. Horizontal Collision Check (Dumbbell is 50px wide, Runner is 30px wide)
    // Checks if the obstacle's front edge has passed the runner's front edge
    const isHorizontalCollision = (obstacleRight > (600 - runnerLeft - 50)) && (obstacleRight < (600 - runnerLeft));
    
    // 2. Vertical Collision Check (Obstacle is 20px high + 10px ground = 30px max)
    const isVerticalCollision = runnerBottom <= 30; 

    if (isHorizontalCollision && isVerticalCollision) {
        // Collision detected!
        gameOver();
    }
}

// --- 5. EVENT LISTENERS ---
document.addEventListener('keydown', (event) => {
    // Jump/Start on Spacebar
    if (event.code === 'Space') {
        if (isGameOver) {
            startGame();
        } else {
            jump();
        }
    }
});

// Initial setup to display the message (Optional, but good practice)
window.onload = () => {
    message.style.display = 'block';
};