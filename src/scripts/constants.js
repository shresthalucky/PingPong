export const STATE_INIT = 1;
export const STATE_LOADED = 2;

// environment export constants
export const ENV = {
  gravity: 9.82,
  toRadian: (deg) => {
    return (deg * Math.PI) / 180;
  },
};

// canvas export constants
export const CANVAS_WIDTH = window.innerWidth;
export const CANVAS_HEIGHT = window.innerHeight;
export const HALF_CANVAS_WIDTH = CANVAS_WIDTH / 2;
export const HALF_CANVAS_HEIGHT = CANVAS_HEIGHT / 2;
export const MAX_CAMERA_Y = -1200;

// colors
export const BOARD_BACKGROUND = '#284088';
export const BALL_BACKGROUND = '#FFD740';
export const BALL_BORDER = '#FFC400';
export const BLACK_A = '#000000';
export const BLACK_B = '#212121';
export const BLACK_C = '#424242';
export const WHITE = '#FFFFFF';

// board export constants
export const TABLE_HEIGHT = 0;
export const TABLE_STAND_PADDING = 40;
export const BOARD_WIDTH = 800;
export const BOARD_LENGTH = (BOARD_WIDTH * 6) / 5;
export const BOARD_HALF_LENGTH = BOARD_LENGTH / 2;
export const BOARD_HALF_WIDTH = BOARD_WIDTH / 2;
export const BOARD_THICKNESS = 20;
export const BOARD_LEFT_X = HALF_CANVAS_WIDTH - BOARD_HALF_WIDTH;
export const BOARD_RIGHT_X = HALF_CANVAS_WIDTH + BOARD_HALF_WIDTH;
export const BOARD_Y = -300;
export const BOARD_Z = 160;
export const BORDER_WIDTH = 10;
export const BOARD_OFFSET = 160;
export const BOARD_END = BOARD_LENGTH + BOARD_Z;
export const NET_HEIGHT = 90;
export const NET_Z = BOARD_Z + BOARD_HALF_LENGTH;
export const NET_OFFSET = 50;

// ball export constants and defaults
export const BALL_START_HEIGHT = 100; // vertical height from the board
export const BALL_MAX_RADIUS = 14;
export const BALL_MIN_RADIUS = 6;
export const BALL_ANGLE = ENV.toRadian(30);
export const BALL_INITAL_VEL = 100;
export const SLOPE =
  (BALL_MIN_RADIUS - BALL_MAX_RADIUS) / (BOARD_LENGTH - BOARD_Z);
export const TIME = 0.25;
export const BOUNCE_BACK_VELOCITY = 40;

// bat export constants and defaults
export const BAT_LENGTH = 207;
export const BAT_WIDTH = 124;
export const BAT_THICKNESS = 50;
export const BAT_INITIAL_Z = 120;

// player export constants and defaults
export const PLAYER_Z_POSITION = BOARD_Z - 100;
export const OPPONENT_Z_POSITION = BOARD_LENGTH + BOARD_Z;
export const BOUNDARY_PADDING = 100;

// gameplay export constants
export const SERVE_ANGLE = ENV.toRadian(-50);
export const VELOCITY = 85;
export const UP_ANGLE = 30;
export const SIDE_ANGLE = 0;
export const MAX_MOVE_VELOCITY = 1200;

// background export constants
export const LEFT_WALL = HALF_CANVAS_WIDTH - BOARD_WIDTH * 2;
export const RIGHT_WALL = HALF_CANVAS_WIDTH + BOARD_WIDTH * 2;
export const END_WALL = BOARD_END + BOARD_WIDTH * 2;
