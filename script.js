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
    { x: 500, y: 400, width: 20, height: 20 }, // platform 1
    { x: 400, y: 250, width: 20, height: 20 }, // platform 2
    { x: 600, y: 200, width: 200, height: 20 } // platform 3
  ]
};

let level3 = {
    platforms: [
      { x: 0, y: 550, width: 800, height: 50 }, // ground
      { x: 200, y: 400, width: 20, height: 20 }, // platform 1
      { x: 400, y: 250, width: 20, height: 20 }, // platform 2
      { x: 600, y: 200, width: 200, height: 20 } // platform 3
    ]
  };

let currentLevel = level1;
let currentLevelIndex = 1;

let gravity = 0.38;

let flashFlag = false;
let flashCount = 0;

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

      // Check if player has reached platform 3 on level 2
      if (currentLevelIndex === 2 && i === 3) {
        flashFlag = true;
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'red';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  ctx.fillStyle = 'orange';
  for (let i = 0; i < currentLevel.platforms.length; i++) {
    ctx.fillRect(currentLevel.platforms[i].x, currentLevel.platforms[i].y, currentLevel.platforms[i].width, currentLevel.platforms[i].height);
  }

  if (flashFlag) {
    flashCount++;
    if (flashCount % 2 === 0) {
      ctx.fillStyle = 'lime';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.font = '50px catamaran';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('YOU DID IT!', canvas.width / 2, canvas.height / 2);
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
    currentLevelIndex = (currentLevelIndex + 1) % 3 + 1;
    switch (currentLevelIndex) {
      case 1:
        currentLevel = level1;
        break;
      case 2:
        currentLevel = level2;
        break;
      case 3:
        currentLevel = level3;
        break;
    }
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