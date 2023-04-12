var canvas = document.getElementById("game-canvas");
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var paddleHeight = 20;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var gameStarted = false;
var startButton = document.getElementById("start-button");
const audio = new Audio("/assets/sea-shanty.mp3");

// create a new image object for the ball
var ballImg = new Image();
ballImg.src = "/assets/cannonball.png";

startButton.addEventListener("click", function () {
  if (!gameStarted) {
    gameStarted = true;
    setInterval(draw, 10);
    audio.play();
  }
});

// set up score
var score = 0;

// update score function
function updateScore() {
  ctx.font = "24px 'IM Fell DW Pica SC', serif";
  ctx.fillStyle = "goldenrod";
  ctx.fillText("Score: " + score, canvas.width - 120, 30);
}

// draw the ball
function drawBall() {
  ctx.beginPath();
  // use the drawImage method to draw the image onto the canvas
  ctx.drawImage(
    ballImg,
    x - ballRadius,
    y - ballRadius,
    ballRadius * 2,
    ballRadius * 2
  );
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  // create a new image object for the paddle
  var paddleImg = new Image();
  paddleImg.src = "/assets/pirate.png";
  // use the drawImage method to draw the image onto the canvas
  ctx.drawImage(paddleImg, paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.closePath();
}

function gameOver() {
  // check if the game over modal has already been created
  if (document.getElementById("game-over-modal")) {
    return;
  }

  // create a new div element for the modal
  var modal = document.createElement("div");
  modal.setAttribute("id", "game-over-modal");

  // create a new h1 element for the game over message
  var gameoverMessage = document.createElement("h1");
  gameoverMessage.innerText = "AVAST, YE BE A LANDLUBBER!";

  // create a new button element to restart the game
  var restartButton = document.createElement("button");
  restartButton.innerText = "Restart";
  restartButton.addEventListener("click", function () {
    // reload the page to restart the game
    window.location.href = window.location.href;
  });

  // add the h1 and button elements to the modal
  modal.appendChild(gameoverMessage);
  modal.appendChild(restartButton);

  // add the modal to the canvas
  document.getElementById("game-container").appendChild(modal);
}

function draw() {
  // clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw ball and paddle
  drawBall();
  drawPaddle();

  // update paddle position based on arrow key input
  movePaddle();

  // collision detection
  collisionDetection();

  // update ball position
  x += dx;
  y += dy;

  // check for wall collision
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      // game over
      gameOver();
      clearInterval(interval);
      return;
    }
  }

  // update score
  updateScore();
}

function collisionDetection() {
  if (
    x > paddleX &&
    x < paddleX + paddleWidth &&
    y + ballRadius > canvas.height - paddleHeight
  ) {
    dy = -dy;
    score++;
  }
}

function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 37) {
    leftPressed = false;
  }
}

// add this code to update the paddle position based on arrow key input
function movePaddle() {
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
}
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

var interval;

function startGame() {
  if (!gameStarted) {
    interval = setInterval(draw, 10);
    gameStarted = true;
  }
  requestAnimationFrame(draw);
}

canvas.addEventListener("click", startGame, false);
