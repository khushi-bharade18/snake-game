// Declare consts and variables
const mainSound = new Audio("music/pop-beat.mp3");
const eatSound = new Audio("music/eat.mp3");
const outSound = new Audio("music/over.mp3");
const moveSound = new Audio("music/move.mp3");

const board = document.querySelector(".board");
const replayBtn = document.querySelector("#replay");
const pauseBtn = document.querySelector("#pause");
const score = document.querySelector("#score");

let setIntervalId;
let foodX, foodY;
let snakeX = 4,
  snakeY = 4;
let directionX = 0,
  directionY = 0;
let snakeBody = [];
let gameOver = false;
let scoreValue = 0;
let isPause = false;

// Generate random food location
function randomFood() {
  foodX = Math.floor(Math.random() * 18) + 2;
  foodY = Math.floor(Math.random() * 18) + 2;
}

// Define the moving direction of the snake
function moveSnake(e) {
  moveSound.play();
  if (e.key === "ArrowUp" && directionY !== 1) {
    directionX = 0;
    directionY = -1;
  } else if (e.key === "ArrowDown" && directionY !== -1) {
    directionX = 0;
    directionY = 1;
  } else if (e.key === "ArrowLeft" && directionX !== 1) {
    directionX = -1;
    directionY = 0;
  } else if (e.key === "ArrowRight" && directionX !== -1) {
    directionX = 1;
    directionY = 0;
  }
  main();
}

// Main code
function main() {
  mainSound.play();

  // Checking if the snake eat the food
  if (snakeX === foodX && snakeY === foodY) {
    eatSound.play();
    randomFood();
    snakeBody.push([foodX, foodY]);
    scoreValue++;
    score.innerHTML = `Score : ${scoreValue}`;
  }

  // Increase the body of snake
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }

  // Moving the snake based on direction
  let setHtml = `<div class="food" style="grid-area: ${foodY}/${foodX}"></div>`;
  snakeX += directionX;
  snakeY += directionY;
  snakeBody[0] = [snakeX, snakeY];

  // Display the snake body after eating
  for (let i = 0; i < snakeBody.length; i++) {
    setHtml += `<div class="snake" id="snake-head${i}"style="grid-area: ${snakeBody[i][1]}/${snakeBody[i][0]}"></div>`;

    // If snake head hit into it's own body
    if (
      i !== 0 &&
      snakeBody[0][0] === snakeBody[i][0] &&
      snakeBody[0][1] === snakeBody[i][1]
    ) {
      gameOver = true;
    }
  }
  // If snake hit into the wall
  if (snakeX >= 21 || snakeX <= 0 || snakeY >= 21 || snakeY <= 0) {
    gameOver = true;
  }

  board.innerHTML = setHtml;

  // Check the condition of game over
  if (gameOver) {
    handleGameOver();
  }
}

function handleGameOver() {
  outSound.play();
  mainSound.pause();
  alert("Game over. Please play again");
  clearInterval(setIntervalId);
  location.reload();
}

// Replay the game
function replayGame() {
  location.reload();
}

//Pause the game
function pauseGame() {
  if (!isPause) {
    clearInterval(setIntervalId);
    mainSound.pause();
    pauseBtn.innerHTML = '<i class="fa-solid fa-play"></i> ' + "Resume";
    document.removeEventListener("keydown", moveSnake);
    isPause = !isPause;
  } else {
    setIntervalId = setInterval(main, 200);
    mainSound.play();
    pauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i> ' + "Pause";
    document.addEventListener("keydown", moveSnake);
    isPause = !isPause;
  }
}

// Engine of the game
randomFood();
main();
setIntervalId = setInterval(main, 300);
document.addEventListener("keydown", moveSnake);
replayBtn.addEventListener("click", replayGame);
pauseBtn.addEventListener("click", pauseGame);