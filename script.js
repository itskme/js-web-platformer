let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');

let player = {
  x: 100,
  y: 100,
  width: 50,
  height: 50,
  speed: 5,
  acceleration: 2.5,
  deceleration: 0.5,
  maxVelocity: 10,
  jumping: false,
  velX: 0,
  velY: 0
};

let level1 = {
  platforms: [
    { x: 0, y: 550, width: 800, height: 50 }, // ground
    { x: 200, y: 400, width: 200, height: 20 }, // platform 1
    { x: 400, y: 300, width: 200, height: 20 }, // platform 2
    { x: 600, y: 200, width: 200, height: 20 } // platform 3
  ]
};

let level2 = {
  platforms: [
    { x: 0, y: 550, width: 800, height: 50 }, // ground
    { x: 200, y: 400, width: 250, height: 29 }, // platform 1
    { x: 400, y: 300, width: 200, height: 20 }, // platform 2
    { x: 600, y: 200, width: 200, height: 20 } // platform 3
  ]
};

let currentLevel = level1;

let gravity = 0.38;

function update() {
  if (player.velX > 0) {
    player.velX -= player.deceleration;
    if (player.velX < 0) player.velX = 0;
  } else if (player.velX < 0) {
    player.velX += player.deceleration;
    if (player.velX > 0) player.velX = 0;
  }

  if (leftArrowPressed) {
    player.velX -= player.acceleration;
    if (player.velX < -player.maxVelocity) player.velX = -player.maxVelocity;
  } else if (rightArrowPressed) {
    player.velX += player.acceleration;
    if (player.velX > player.maxVelocity) player.velX = player.maxVelocity;
  }

  player.x += player.velX;

  player.velY += gravity;
  player.y += player.velY;

  if (player.y + player.height > canvas.height) {
    player.y = canvas.height - player.height;
    player.jumping = false;
    player.velY = 0;
  }

  for (let i = 0; i < currentLevel.platforms.length; i++) {
    if (checkCollision(player, currentLevel.platforms[i])) {
      player.y = currentLevel.platforms[i].y - player.height;
      player.jumping = false;
      player.velY = 0;
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'blue';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  ctx.fillStyle = 'brown';
  for (let i = 0; i < currentLevel.platforms.length; i++) {
    ctx.fillRect(currentLevel.platforms[i].x, currentLevel.platforms[i].y, currentLevel.platforms[i].width, currentLevel.platforms[i].height);
  }
}

function checkCollision(rect1, rect2) {
  if (rect1.x + rect1.width > rect2.x &&
      rect1.x < rect2.x + rect2.width &&
      rect1.y + rect1.height > rect2.y &&
      rect1.y < rect2.y + rect2.height) {
    return true;
  }
  return false;
}

let leftArrowPressed = false;
let rightArrowPressed = false;

document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowLeft') {
    leftArrowPressed = true;
  } else if (e.key === 'ArrowRight') {
    rightArrowPressed = true;
  } else if (e.key === 'ArrowUp' && !player.jumping) {
    player.jumping = true;
    player.velY = -9;
  } else if (e.key === 'l') {
    currentLevel = level2;
    player.x = 100;
    player.y = 100;
  }
});

document.addEventListener('keyup', function(e) {
  if (e.key === 'ArrowLeft') {
    leftArrowPressed = false;
  } else if (e.key === 'ArrowRight') {
    rightArrowPressed = false;
  }
});

setInterval(function() {
  update();
  draw();
}, 16);