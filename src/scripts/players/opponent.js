import { Position } from '../utils';
import * as CONST from '../constants';
import Player from '../components/player';

class Opponent extends Player {
  constructor(position) {
    super(position);

    // Define court area for player
    this.selfHalf = {
      top: CONST.BOARD_END,
      bottom: CONST.BOARD_Z + CONST.BOARD_HALF_LENGTH,
      left: CONST.BOARD_LEFT_X,
      right: CONST.BOARD_RIGHT_X,
    };
  }

  /**
   * Set position of opponent.
   *
   * @param {Position} position - Position object.
   * @returns {Position} New position of opponent.
   */
  setPosition = (position) => {
    if (!position) {
      const left = CONST.BOARD_LEFT_X + CONST.BALL_MAX_RADIUS;
      const right = CONST.BOARD_RIGHT_X - CONST.BALL_MAX_RADIUS;
      const x = Math.random() * (right - left) + left;
      const y = CONST.BOARD_Y - CONST.BALL_START_HEIGHT;

      this.position = new Position(x, y, CONST.BOARD_END);

      return this.position;
    }

    this.position = new Position(position.x, position.y, position.z);

    return this.position;
  };

  /**
   * Serve ball from opponent.
   *
   * @param {Ball} ball - Ball object.
   * @param {number} velocity - Serving velocity of ball.
   */
  serve = (ball, velocity) => {
    ball.setPosition(this.position);
    ball.serve(-velocity);
  };

  /**
   * Ease animate position of opponent from current position to new position.
   *
   * @param {Position} destination - New position of opponent.
   * @see https://codepen.io/bdc/pen/MvBEwP
   */
  animate = (destination) => {
    const x = this.position.x;
    const z = this.position.z;
    const dx = destination.x - this.position.x;
    const dz = destination.z - this.position.z;
    const time = {
      total: 1500,
      elapsed: 0,
    };

    const getProgress = ({ elapsed, total }) => Math.min(elapsed / total, 1);
    const easeOut = (progress) => Math.pow(--progress, 5) + 1;

    const easeTranslate = (now) => {
      if (!time.start) {
        time.start = now;
      } else {
        time.elapsed = now - time.start;
      }

      const progress = getProgress(time);
      const easing = easeOut(progress);

      this.position.x = x + dx * easing;
      this.position.z = z + dz * easing;
      if (progress < 1) {
        requestAnimationFrame(easeTranslate);
      }
    };

    requestAnimationFrame(easeTranslate);
  };
}

export default Opponent;
