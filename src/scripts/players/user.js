import * as CONST from '../constants';
import Player from '../components/player';
import { projection, clamp } from '../utils';
import { Game } from '../game';

class User extends Player {
  constructor(position) {
    super(position);
    this.selfHalf = {
      'top': CONST.BOARD_Z + CONST.BOARD_HALF_LENGTH,
      'bottom': CONST.BOARD_Z,
      'left': CONST.BOARD_LEFT_X,
      'right': CONST.BOARD_RIGHT_X
    }
  }

  /**
   * Get array of initial parameters for motion of ball
   * @returns {velocity} initial velocity of ball
   * @returns {sideAngle} angle between x and z axis
   * @returns {upAngle} angle between z and y axis
   */
  getParameters = (lastFrameTime) => {

    const dt = (performance.now() - lastFrameTime) / 1000;
    const dx = this.position.x - this.prevPositionX;
    const dz = this.position.z - this.prevPositionZ;
    const sideAngle = dx !== 0 ? Math.atan(dz / dx) : 0;

    // Clamp mouse velocity
    const v = clamp(0, CONST.MAX_MOVE_VELOCITY, dz/dt);
    
    // Calculate velocity ranging from 60 to 90
    // equation of line: x = (y + 2400) / 60
    const velocity = (v + 2400) / 40;

    // Calculate angle ranging from 30 to 60 degree
    // equation of line: x = 120 - y
    const upAngle = 120 - velocity;

    return [velocity, sideAngle, upAngle];
  }

  // Serve ball from user
  serve = (ball, lastFrameTime) => {
    ball.serve(...this.getParameters(lastFrameTime));
  }

  // Limit movement of bat
  fitToCourt = () => {
    const left = CONST.BOARD_LEFT_X - CONST.BOUNDARY_PADDING + CONST.BALL_MAX_RADIUS;
    const right = CONST.BOARD_RIGHT_X + CONST.BOUNDARY_PADDING - CONST.BALL_MAX_RADIUS;
    const top = CONST.BOARD_Z + CONST.BOARD_HALF_LENGTH;
    this.position.x = clamp(left, right, this.position.x);
    this.position.z = clamp(0, top, this.position.z);
  }

  /**
   * Set 3D position of bat from 2D position
   * @param {Event} event - mousemove event
   */ 
  handleBatMovement = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.prevPositionX = this.position.x;
    this.prevPositionZ = this.position.z;
    this.position = projection.get3dPosition(event.clientX, event.clientY);
    this.fitToCourt();
  }

  // Allow bat movement pass the ball
  movementDirection = (ball) => {
    if (this.position.z - (ball.current3dPos.z - CONST.BAT_THICKNESS) < 0) {
      Game.batDirection = true;
    }
  }
}

export default User;
