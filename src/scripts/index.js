import User from './players/user';
import Net from './components/net';
import * as CONST from './constants';
import Ball from './components/ball';
import Board from './components/table';
import { Floor, Wall } from './background';
import Opponent from './players/opponent';
import { Position, projection } from './utils';
import Scoreboard from './components/scoreboard';
import { resetGame, startGame, initMouseEvent } from './game';
import { initAssets, removeAssetsEvent, referee } from './assets';

const canvas = document.getElementById('game');

canvas.width = CONST.CANVAS_WIDTH;
canvas.height = CONST.CANVAS_HEIGHT;

const ctx = canvas.getContext('2d');

const layoutElement = document.body.querySelector('.layout');
const infoElement = document.body.querySelector('.info');
const introElement = document.body.querySelector('.intro');
const form = introElement.querySelector('form');

const App = {
  state: CONST.STATE_INIT,
  assets: {
    total: 7,
    loadCount: 0,
  },
};

// Game components
let floor, walls, table, net, ball, player, opponent, scoreboard;
const obj = {
  floor,
  walls,
  table,
  net,
  ball,
  player,
  opponent,
  scoreboard,
};

// Check for load of assets
function loadComplete() {
  App.assets.loadCount++;

  if (App.assets.loadCount >= App.assets.total) {
    App.state = CONST.STATE_LOADED;
    removeAssetsEvent(loadComplete);
    initMouseEvent();
    run();
  }
}

// display DOM on pause
function onPause() {
  layoutElement.style.display = 'block';
  infoElement.style.display = 'table';
  infoElement.querySelector('.content').innerHTML =
    'Press ESC to pause / resume';
}

// remove DOM on resume
function onResume() {
  layoutElement.style.display = 'none';
  infoElement.style.display = 'none';
}

function handleFormSubmit(e) {
  e.preventDefault();

  introElement.style.display = 'none';
  layoutElement.style.display = 'none';

  const config = {
    playerName: e.target.elements.player.value.toUpperCase(),
    bestOfGames: parseInt(e.target.elements.bestof.value),
  };

  initGame(config);
}

// Display intro components and configure game
function displayIntro() {
  initComponents();

  infoElement.style.display = 'none';
  introElement.style.display = 'table';

  form.removeEventListener('submit', handleFormSubmit);
  form.addEventListener('submit', handleFormSubmit);
}

// Initialize and draw game components on canvas
function initComponents() {
  ctx.clearRect(
    -500,
    -500,
    CONST.CANVAS_WIDTH + 500,
    CONST.CANVAS_HEIGHT + 500,
  );

  projection.camera.position.x = CONST.HALF_CANVAS_WIDTH;
  projection.camera.position.y =
    CONST.CANVAS_HEIGHT <= -CONST.MAX_CAMERA_Y
      ? -CONST.CANVAS_HEIGHT
      : CONST.MAX_CAMERA_Y;
  projection.viewplane.x = CONST.HALF_CANVAS_WIDTH;

  const ballStartPosition = new Position(
    CONST.HALF_CANVAS_WIDTH,
    CONST.BOARD_Y - CONST.BALL_START_HEIGHT,
    CONST.BOARD_Z,
  );
  const playerPosition = new Position(
    0,
    CONST.BOARD_Y - CONST.BALL_START_HEIGHT,
    CONST.PLAYER_Z_POSITION,
  );
  const opponentPosition = new Position(
    1000,
    CONST.BOARD_Y - CONST.BALL_START_HEIGHT,
    CONST.OPPONENT_Z_POSITION,
  );

  obj.floor = new Floor();
  obj.walls = new Wall();
  obj.table = new Board();
  obj.net = new Net();
  obj.ball = new Ball(ballStartPosition);
  obj.player = new User(playerPosition);
  obj.opponent = new Opponent(opponentPosition);

  obj.floor.draw(ctx);
  obj.walls.draw(ctx);
  obj.table.draw(ctx);
  obj.net.draw(ctx);
}

// Initialize game with configuration
function initGame(config) {
  const scoreboardPosition = new Position(20, 20);

  obj.scoreboard = new Scoreboard(
    scoreboardPosition,
    obj.player,
    config,
    displayWin,
  );

  referee.play();
  startGame(ctx, obj, onPause, onResume);
}

// Display winner component for game
function displayWin(player) {
  referee.play();

  const playAgainBtn = document.createElement('button');
  const winText = '<div class="row"><h1>' + player + ' WINS!' + '</h1></div>';
  const content = infoElement.querySelector('.content');

  playAgainBtn.classList.add('btn');
  playAgainBtn.innerText = 'NEW GAME';
  content.innerHTML = winText;
  content.appendChild(playAgainBtn);
  layoutElement.style.display = 'block';
  infoElement.style.display = 'table';

  playAgainBtn.addEventListener('click', () => {
    resetGame();
    displayIntro();
  });
}

function run() {
  switch (App.state) {
    case CONST.STATE_INIT:
      initAssets(loadComplete);
      break;
    case CONST.STATE_LOADED:
      displayIntro();
      break;
  }
}

run();
