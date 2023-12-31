const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const score = document.querySelector(".score-value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const btn = document.querySelector(".btn-play");

const audio = new Audio("../assets/audio.mp3");

const size = 30;
let snake = [{ x: 270, y: 240 }];

let direction, loopId;

const incrementScore = () => {
  score.innerText = parseInt(score.innerText) + 10;
};

const randoPosition = () => {
  const number = randomNumber(0, canvas.width - size);
  return Math.round(number / 30) * 30;
};
const randomNumber = (max, min) => {
  return Math.round(Math.random() * (max - min) + min);
};

const randomColor = () => {
  const red = randomNumber(0, 255);
  const green = randomNumber(0, 255);
  const blue = randomNumber(0, 255);

  return `rgb(${red}, ${green}, ${blue})`;
};

const food = {
  x: randoPosition(),
  y: randoPosition(),
  color: randomColor(),
};

const drawFood = () => {
  const { x, y, color } = food;

  ctx.shadowColor = color;
  ctx.shadowBlur = 6;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
  ctx.shadowBlur = 0;
};

const drawSnake = () => {
  ctx.fillStyle = "#ddd";
  snake.forEach((position, index) => {
    if (index == snake.length - 1) {
      ctx.fillStyle = "#FFFFFF";
    }
    ctx.fillRect(position.x, position.y, size, size);
  });
};

const moveSnake = () => {
  if (!direction) return;
  const head = snake[snake.length - 1];

  if (direction === "right") {
    snake.push({ x: head.x + size, y: head.y });
  }

  if (direction === "left") {
    snake.push({ x: head.x - size, y: head.y });
  }

  if (direction === "down") {
    snake.push({ x: head.x, y: head.y + size });
  }

  if (direction === "up") {
    snake.push({ x: head.x, y: head.y - size });
  }

  snake.shift();
};

// Adicionando suporte para dispositivos móveis
document.addEventListener("touchstart", handleTouchStart, false);
document.addEventListener("touchmove", handleTouchMove, false);

let touchStartX = 0;
let touchStartY = 0;

function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
  if (!touchStartX || !touchStartY) return;

  const touchEndX = event.touches[0].clientX;
  const touchEndY = event.touches[0].clientY;

  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;


  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0 && direction !== "left") {
      direction = "right";
    } else if (deltaX < 0 && direction !== "right") {
      direction = "left";
    }
  } else {
    if (deltaY > 0 && direction !== "up") {
      direction = "down";
    } else if (deltaY < 0 && direction !== "down") {
      direction = "up";
    }
  }
  touchStartX = 0;
  touchStartY = 0;
}


const drawGrid = () => {
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#191919";
  for (let i = 30; i < canvas.width; i += 30) {
    ctx.beginPath();
    ctx.lineTo(i, 0);
    ctx.lineTo(i, 600);

    ctx.stroke();

    ctx.beginPath();
    ctx.lineTo(0, i);
    ctx.lineTo(600, i);

    ctx.stroke();
  }
};

checkCollison = () => {
  const head = snake[snake.length - 1];
  const canvasLimit = canvas.width - size;
  const neckIndex = snake.length - 2;

  const wallCollision =
    head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;

  const selfCollision = snake.find((position, index) => {
    return index < neckIndex && position.x == head.x && position.y == head.y;
  });

  if (wallCollision || selfCollision) {
    gameOver();
  }
};

const gameOver = () => {
  direction = undefined;

  menu.style.display = "flex";
  finalScore.innerText = score.innerText;
  canvas.style.filter = "blur(2px)";
};

drawGrid();

checkEat = () => {
  const head = snake[snake.length - 1];
  if (head.x == food.x && head.y == food.y) {
    incrementScore();
    audio.play();
    snake.push(head);

    let x = randoPosition();
    let y = randoPosition();
    while (snake.find((position) => position.x == x && position.y == y)) {
      x = randoPosition();
      y = randoPosition();
    }
    food.x = x;
    food.y = y;
    food.color = randomColor();
  }
};

const gameLoop = () => {
  clearInterval(loopId);
  ctx.clearRect(0, 0, 600, 600);
  drawGrid();
  drawFood();
  moveSnake();
  drawSnake();
  checkEat();
  checkCollison();

  loopId = setTimeout(() => {
    gameLoop();
  }, 300);
};

gameLoop();

document.addEventListener("keydown", ({ key }) => {
  if (key == "ArrowRight" && direction != "left") {
    direction = "right";
  }
  if (key == "ArrowLeft" && direction != "right") {
    direction = "left";
  }
  if (key == "ArrowDown" && direction != "up") {
    direction = "down";
  }
  if (key == "ArrowUp" && direction != "down") {
    direction = "up";
  }
});

btn.addEventListener("click", () => {
  score.innerText = "00";
  menu.style.display = "none";
  canvas.style.filter = "none";

  snake = [{ x: 270, y: 240 }];
});
