import { batHit } from './assets';
import * as CONST from './constants';
import { Position, clamp } from './utils';

let Game = {
  state: {
    begin: true,
    inPlay: false,
    isOver: false,
    ballStart: true,
    served: false,
    serveSuccess: false,
    pause: false,
    ballIn: true,
  },
  batDirection: false,
};

// Set Game ct to initial state
function resetGame() {
  Game = {
    state: {
      begin: true,
      inPlay: false,
      isOver: false,
      ballStart: true,
      served: false,
      serveSuccess: false,
      pause: false,
      ballIn: true,
    },
    batDirection: false,
  };
}

let ctx;
let floor, walls, table, net, ball, player, opponent, scoreboard;
let animationId;
let lastFrameTime;
let onPause, onResume;

let fps = 60;
let fpsInterval = 1000 / fps; // Calculate interval time per frame
let then = performance.now(); // Set the current time
let elapsed;

function startGame(gameCtx, obj, pauseFn, resumeFn) {
  ctx = gameCtx;
  ({ floor, walls, table, net, ball, player, opponent, scoreboard } = obj);
  onPause = pauseFn;
  onResume = resumeFn;
  initEscapeEvent();

  then = performance.now(); // Initialize 'then' with the current time
  animationId = requestAnimationFrame(renderGame); // Start the game loop
}

// Draw on canvas sequentially
function drawSequence(ctx) {
  if (Math.abs(ball.current3dPos.y) < -CONST.BOARD_Y) {
    ball.draw(ctx);
    table.draw(ctx);
    net.draw(ctx);
  } else {
    table.draw(ctx);
    net.draw(ctx);
    ball.draw(ctx);
  }
}

// Perform game loop operations
function renderGame() {
  // request another frame
  animationId = requestAnimationFrame(renderGame);

  // calculate the elapsed time since the last frame
  let now = performance.now();
  elapsed = now - then;

  // if enough time has passed, draw the next frame
  if (elapsed > fpsInterval) {
    then = now - (elapsed % fpsInterval);

    ctx.clearRect(
      -500,
      -500,
      CONST.CANVAS_WIDTH + 500,
      CONST.CANVAS_HEIGHT + 500,
    );

    // Draw game elements sequentially
    floor.draw(ctx);
    walls.draw(ctx);
    scoreboard.draw(ctx);

    if (ball.current3dPos.z > opponent.position.z) {
      drawSequence(ctx);
      opponent.draw(ctx);
    } else {
      opponent.draw(ctx);
      drawSequence(ctx);
    }

    if (Game.state.begin && !Game.state.isOver) {
      player.draw(ctx);
      updateStates();

      if (!Game.state.served) {
        serveBall();
      } else if (Game.state.inPlay) {
        hitBall();
      }
    } else {
      cancelAnimationFrame(animationId);
      return;
    }

    // Store the last frame time
    lastFrameTime = performance.now();
  }
}

// Reset player's bounce count
function resetBounceCount() {
  player.resetBounce();
  opponent.resetBounce();
}

// Choose ball server and serve the ball
function serveBall() {
  if (scoreboard.state.server === player) {
    // Limit ball within board
    const x = clamp(
      CONST.BOARD_LEFT_X + CONST.BALL_MAX_RADIUS,
      CONST.BOARD_RIGHT_X - CONST.BALL_MAX_RADIUS,
      player.position.x,
    );

    ball.setPosition(new Position(x, player.position.y, CONST.BOARD_Z));

    if (!Game.batDirection) {
      player.movementDirection(ball);
    }
    if (player.batActive && Game.batDirection && ball.checkCollision(player)) {
      resetBounceCount();
      batHit.play();
      player.serve(ball, lastFrameTime);
      opponentMovement();
      Game.state.served = true;
      player.batActive = false;
    }
  } else {
    resetBounceCount();
    const pos = opponent.setPosition();

    ball.setPosition(pos);
    batHit.play();
    opponent.serve(ball, CONST.VELOCITY);
    Game.state.served = true;
    player.batActive = true;
  }
}

// Perform driving of ball to opponent's court
function hitBall() {
  if (player.batActive && ball.checkCollision(player)) {
    resetBounceCount();
    batHit.play();
    Game.state.serveSuccess = true;
    player.batActive = false;
    ball.hit(player, ...player.getParameters(lastFrameTime));
    scoreboard.state.driver = player;
    if (player.foul()) {
      Game.state.inPlay = false;
    }
    opponentMovement();

    return;
  }

  if (opponent.batActive && ball.checkCollision(opponent)) {
    resetBounceCount();
    batHit.play();
    Game.state.serveSuccess = true;
    ball.hit(opponent, CONST.VELOCITY, CONST.SIDE_ANGLE, CONST.UP_ANGLE);
    player.batActive = true;
    scoreboard.state.driver = opponent;
    if (opponent.foul()) {
      Game.state.inPlay = false;
    }

    return;
  }
}

// Update game states with conditions
function updateStates() {
  if (ball.bounceCount === 1) {
    Game.state.inPlay = true;
  }

  if (net.checkCollision(ball)) {
    ball.bounceBack(net, scoreboard.state.driver);
    Game.state.inPlay = false;
    scoreboard.state.driver.batActive = false;
  }

  if (Game.state.inPlay && ball.ballOut()) {
    updateScore();
    Game.state.served = false;
    Game.state.inPlay = false;
    Game.batDirection = false;
    Game.state.serveSuccess = false;
    player.batActive = true;
    opponent.batActive = true;
  }
}

// Update scoreboard for current game
function updateScore() {
  scoreboard.updateScore(player, opponent);
  scoreboard.checkWin(gameOver);
  scoreboard.server(player, opponent);
}

// Set game states for game over
function gameOver() {
  Game.state.inPlay = false;
  scoreboard.resetState();

  if (scoreboard.allOver()) {
    removeEscapeEvent();
  }
}

// Control opponent's bat movement with ball's movement
function opponentMovement() {
  const pos = ball.current3dPos;
  const slope = (ball.velocity.z * CONST.TIME) / (10 * ball.velocity.x);
  const destination = new Position(
    pos.x + (CONST.BOARD_END - pos.z) / slope,
    opponent.position.y,
    CONST.BOARD_END + 10,
  );

  const right = CONST.BOARD_RIGHT_X;
  const left = CONST.BOARD_LEFT_X;

  if (destination.x < left) {
    destination.x = left;

    const z = slope * (left - pos.x) + pos.z;

    destination.z =
      z > CONST.NET_Z + CONST.BOARD_HALF_LENGTH / 2 ? z : destination.z;
  } else if (destination.x > right) {
    destination.x = right;

    const z = slope * (right - pos.x) + pos.z;

    destination.z =
      z > CONST.NET_Z + CONST.BOARD_HALF_LENGTH / 2 ? z : destination.z;
  }

  opponent.animate(destination);
}

function logBounce() {
  player.logBounce(ball);
  opponent.logBounce(ball);
}

function initMouseEvent() {
  document.addEventListener('mousemove', (e) => {
    if (player) {
      player.handleBatMovement(e);
    }
  });
}

function escapeHandler(e) {
  Game.state.pause = !Game.state.pause;
  if (e.key === 'Escape') {
    if (Game.state.pause) {
      cancelAnimationFrame(animationId);
      onPause();
    } else {
      onResume();
      animationId = requestAnimationFrame(renderGame);
    }
  }
}

function initEscapeEvent() {
  document.addEventListener('keyup', escapeHandler);
}

function removeEscapeEvent() {
  document.removeEventListener('keyup', escapeHandler);
}

export { Game, startGame, resetGame, logBounce, initMouseEvent };
