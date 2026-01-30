// Declare sounds
const mainSound = new Audio("music/pop-beat.mp3");
mainSound.loop = true;
const eatSound = new Audio("music/eat.mp3");
const outSound = new Audio("music/over.mp3");
const moveSound = new Audio("music/move.mp3");

// Select elements
const board = document.querySelector(".board");
const replayBtn = document.querySelector("#replay");
const pauseBtn = document.querySelector("#pause");
const score = document.querySelector("#score");
const levels = document.querySelector("#levels");
const easyLevel = document.querySelector("#easy");
const mediumLevel = document.querySelector("#medium");
const hardLevel = document.querySelector("#hard");
const controlBtns = document.querySelectorAll(".ctrl-btn");

let setIntervalId;
let foodX, foodY;
let snakeX = 3,
  snakeY = 3;
let directionX = 0,
  directionY = 0;
let snakeBody = [];
let gameOver = false;
let scoreValue = 0;
let isPause = false;
let gameSpeed = 300;

// Generate random food location
function randomFood() {
  foodX = Math.floor(Math.random() * 20) + 1;
  foodY = Math.floor(Math.random() * 20) + 1;
}

// Define the moving direction of the snake
function moveSnake(input) {
  if (isPause) return;
  if (mainSound.paused) {
    mainSound.currentTime = 0;
    mainSound.play();
  }
  let dir = null;

  // Case 1: keyboard event
  if (typeof input === "object" && input.key) {
    if (input.key === "ArrowUp") dir = "up";
    else if (input.key === "ArrowDown") dir = "down";
    else if (input.key === "ArrowLeft") dir = "left";
    else if (input.key === "ArrowRight") dir = "right";
  }

  // Case 2: button direction string
  if (typeof input === "string") {
    dir = input;
  }

  if (!dir) return;

  let moved = false;

  if (dir === "up" && directionY !== 1) {
    directionX = 0;
    directionY = -1;
    moved = true;
  } else if (dir === "down" && directionY !== -1) {
    directionX = 0;
    directionY = 1;
    moved = true;
  } else if (dir === "left" && directionX !== 1) {
    directionX = -1;
    directionY = 0;
    moved = true;
  } else if (dir === "right" && directionX !== -1) {
    directionX = 1;
    directionY = 0;
    moved = true;
  }

  if (moved) {
    moveSound.currentTime = 0;
    moveSound.play();
  }
}

// Main code
function main() {
  // Checking if the snake eat the food
  if (snakeX === foodX && snakeY === foodY) {
    eatSound.play();
    randomFood();
    if (snakeBody.length === 0) {
      snakeBody.push([snakeX, snakeY]);
    } else {
      snakeBody.push([...snakeBody[snakeBody.length - 1]]);
    }
    scoreValue++;
    score.innerHTML = `${scoreValue}`;
  }

  // Increase the body of snake after eating the food
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
  board.innerHTML = setHtml;

  // If snake hit into the wall
  if (snakeX > 20 || snakeX < 1 || snakeY > 20 || snakeY < 1) {
    gameOver = true;
  }
  // Check the condition of game over
  if (gameOver) {
    handleGameOver();
  }
}

function handleGameOver() {
  outSound.currentTime = 0;
  outSound.play();
  mainSound.pause();
  alert("Game over. Please play again");
  clearInterval(setIntervalId);
  location.reload();
}

// Customizing difficulty level
levels.addEventListener("change", (e) => {
  clearInterval(setIntervalId);
  if (e.target.value === "medium") {
    gameSpeed = 200;
    setIntervalId = setInterval(main, gameSpeed);
  } else if (e.target.value === "hard") {
    gameSpeed = 100;
    setIntervalId = setInterval(main, gameSpeed);
  } else {
    setIntervalId = setInterval(main, gameSpeed);
  }

  levels.blur();
  board.focus();
});

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
    isPause = !isPause;
    levels.disabled = true;
  } else {
    setIntervalId = setInterval(main, gameSpeed);
    mainSound.play();
    pauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i> ' + "Pause";
    isPause = !isPause;
    levels.disabled = false;
  }

  pauseBtn.blur();
  board.focus();
}

// Engine of the game
randomFood();
main();
setIntervalId = setInterval(main, gameSpeed);
board.addEventListener("keydown", moveSnake);
board.focus();
controlBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    moveSnake(btn.dataset.dir);
  });
});
replayBtn.addEventListener("click", replayGame);
pauseBtn.addEventListener("click", pauseGame);
