import User from '../players/user';
import * as CONST from '../constants';
import Opponent from '../players/opponent';
import { Game, logBounce } from '../game/';
import { Position, projection } from '../utils';
import { bounceIn, bounceOut } from '../assets';

class Ball {
  constructor(startPos) {
    this.initial3dPos = new Position(startPos.x, startPos.y, startPos.z);
    this.current3dPos = new Position(startPos.x, startPos.y, startPos.z);
    this.radius = CONST.BALL_MAX_RADIUS;
    this.angle = CONST.BALL_ANGLE;
    this.initialVel = CONST.BALL_INITAL_VEL;
    this.velocity = {
      z: this.initialVel * Math.cos(this.angle),
      y: 0,
      x: 0,
    };
    this.time = 0;
    this.rebound = false;
    this.lastPosition = new Position(startPos.x, startPos.y, startPos.z);
    this.bounceCount = 0;
    this.bounceLevel = -CONST.BOARD_Y;
  }

  /**
   * Get radius of ball with respect to its 3D position.
   *
   * @returns {number} Radius of ball.
   */
  getRadius = () =>
    Math.max(
      CONST.SLOPE * (this.current3dPos.z - CONST.BOARD_Z) +
        CONST.BALL_MAX_RADIUS,
      4,
    );

  // Draw ball on canvas
  draw = (ctx) => {
    if (Game.state.served) {
      this.bounce();
    }

    const current3dY =
      this.current3dPos.y > 0 ? -this.current3dPos.y : this.current3dPos.y;
    const current2dPos = projection.get2dProjection(
      new Position(this.current3dPos.x, current3dY, this.current3dPos.z),
    );

    if (this.current3dPos.z > 0) {
      this.radius = this.getRadius();
    }

    this.drawShadow(ctx);

    ctx.beginPath();
    ctx.arc(current2dPos.x, current2dPos.y, this.radius, 0, 360);
    ctx.fillStyle = CONST.BALL_BACKGROUND;
    ctx.fill();
    ctx.strokeStyle = CONST.BALL_BORDER;
    ctx.stroke();
    ctx.closePath();
  };

  /**
   * Get angle of incidence of ball on xz plane.
   *
   * @returns {number} Angle of incidence.
   */
  getBounceAngle = () => {
    const d = this.lastPosition.get3dDistance(this.current3dPos);
    const dx = this.current3dPos.get3dDistance(
      new Position(this.lastPosition.x, 0, this.lastPosition.z),
    );

    return Math.atan(d / dx);
  };

  // Calculate and set position of ball with time
  bounce = () => {
    if (!this.rebound) {
      // Set last position of ball
      this.lastPosition = new Position(
        this.current3dPos.x,
        this.current3dPos.y,
        this.current3dPos.z,
      );

      // Calculate z coordinate of ball
      // z = z0 + vz * t
      this.current3dPos.z = this.initial3dPos.z + this.velocity.z * this.time;

      if (this.velocity.x !== 0) {
        // Calculate x coordinate of ball
        this.current3dPos.x += this.velocity.x * 10;
      }

      // Calculate y component velocity of ball
      // vy = v0 * sin(angle) - g*t
      const vy = this.initialVel * Math.sin(this.angle);

      this.velocity.y = vy - CONST.ENV.gravity * this.time;

      // Calculate y coordinate of ball
      // y = y0 + v0*sin(angle)*t - 0.5*g*t*t
      this.current3dPos.y =
        -this.initial3dPos.y +
        vy * this.time -
        CONST.ENV.gravity * this.time * this.time * 0.5;

      // check if ball hit the board or ground
      if (this.current3dPos.y < this.bounceLevel) {
        this.rebound = true;
      }

      this.time += CONST.TIME;
    } else {
      logBounce();

      // play ball bounce sound according to bouncing surface
      if (Game.state.ballIn) {
        bounceIn.play();
      } else {
        bounceOut.play();
      }

      // Perform rebound effect
      this.initialVel = -this.velocity.y;
      this.initial3dPos.z = this.current3dPos.z;
      this.current3dPos.y = -this.bounceLevel;
      this.initial3dPos.y = -this.bounceLevel;
      this.rebound = false;
      this.time = 0;
      this.angle = this.getBounceAngle();

      this.bounceCount++;
    }
  };

  // Draw elliptical shadow of ball on canvas
  drawShadow = (ctx) => {
    const y = this.isBallInside() ? CONST.BOARD_Y : 0;
    let shadow = new Position(this.current3dPos.x, y, this.current3dPos.z);

    shadow = projection.get2dProjection(shadow);

    ctx.beginPath();
    ctx.ellipse(shadow.x, shadow.y, this.radius, this.radius * 0.5, 0, 0, 360);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fill();
    ctx.closePath();
  };

  /**
   * Bounce ball after collision with net.
   *
   * @param {Net} net - Net object.
   * @param {Player} side - Player object.
   */
  bounceBack = (net, side) => {
    let offsetZ;
    let v;

    this.angle = 0;
    this.initialVel = CONST.BOUNCE_BACK_VELOCITY;

    if (side instanceof User) {
      offsetZ = net.z - CONST.NET_OFFSET;
      v = -this.initialVel;
    } else if (side instanceof Opponent) {
      offsetZ = net.z + CONST.NET_OFFSET;
      v = this.initialVel;
    }

    this.initial3dPos = new Position(
      this.current3dPos.x,
      -this.current3dPos.y,
      offsetZ,
    );
    this.current3dPos = new Position(
      this.current3dPos.x,
      -this.current3dPos.y,
      offsetZ,
    );
    this.velocity.z = v * Math.cos(this.angle);
    this.time = 0;
    this.bounceCount = 0;
  };

  /**
   * Direct ball after collision with bat.
   *
   * @param {Player} side - Player object.
   * @param {number} velocity - Initial velocity of ball.
   * @param {number} sideAngle - Angle between x and z axis.
   * @param {number} upAngle - Angle between z and y axis.
   */
  hit = (side, velocity, sideAngle, upAngle) => {
    let offsetZ;
    let v;

    this.angle = CONST.ENV.toRadian(upAngle);
    this.initialVel = velocity;

    if (side instanceof User) {
      offsetZ = side.position.z + 10;
      v = this.initialVel;
      this.velocity.x =
        sideAngle > 0 ? Math.cos(sideAngle) : -Math.cos(sideAngle);
    } else {
      offsetZ = side.position.z - 10;
      v = -this.initialVel;
      this.velocity.x = 0;
    }

    this.initial3dPos = new Position(
      this.current3dPos.x,
      -this.current3dPos.y,
      offsetZ,
    );
    this.current3dPos = new Position(
      this.current3dPos.x,
      -this.current3dPos.y,
      offsetZ,
    );

    // Calculate z component velocity
    this.velocity.z = v * Math.cos(this.angle);

    this.time = 0;
    this.bounceCount = 0;
  };

  /**
   * Set position of ball.
   *
   * @param {Position} position - Position object.
   */
  setPosition = (position) => {
    this.initial3dPos = new Position(position.x, position.y, position.z);
    this.current3dPos = new Position(position.x, position.y, position.z);
    this.bounceCount = 0;
    this.time = 0;
  };

  /**
   * Set values to serve ball.
   *
   * @param {number} velocity - Serve velocity.
   * @param {number} sideAngle - Angle between x and z axis.
   */
  serve = (velocity, sideAngle) => {
    this.initialVel = Math.abs(velocity);

    if (sideAngle) {
      this.velocity.x =
        sideAngle > 0 ? Math.cos(sideAngle) : -Math.cos(sideAngle);
    } else {
      this.velocity.x = 0;
    }

    this.angle = CONST.SERVE_ANGLE;

    // Calculate z component velocity
    this.velocity.z = velocity * Math.cos(this.angle);
  };

  /**
   * Check collision of ball with Player's bat.
   *
   * @param {Player} side - Player object.
   * @returns {boolean} If collision or no collision.
   */
  checkCollision = (side) => {
    const ball = this.current3dPos;
    const ballY = Game.state.inPlay ? -ball.y : ball.y;

    const bat = side.surface3d;

    if (
      ball.x >= bat.topLeft.x &&
      ballY >= bat.topLeft.y &&
      ball.x <= bat.topRight.x &&
      ballY >= bat.topRight.y &&
      ball.x <= bat.bottomRight.x &&
      ballY <= bat.bottomRight.y &&
      ball.x >= bat.bottomLeft.x &&
      ballY <= bat.bottomLeft.y
    ) {
      if (side instanceof User) {
        if (
          ball.z <= side.position.z &&
          ball.z >= side.position.z - CONST.BAT_THICKNESS
        ) {
          // position ball infront of bat
          if (Game.state.inPlay) {
            ball.z = side.position.z;
          }

          return true;
        }
      } else if (side instanceof Opponent) {
        if (
          ball.z >= side.position.z &&
          ball.z <= side.position.z + CONST.BAT_THICKNESS
        ) {
          // position ball infront of bat
          if (Game.state.inPlay) {
            ball.z = side.position.z;
          }

          return true;
        }
      }
    }

    return false;
  };

  /**
   * Check if ball is over board.
   *
   * @returns {boolean} Ball over board or not.
   */
  isBallInside = () => {
    if (
      this.current3dPos.x <= CONST.BOARD_RIGHT_X + CONST.BALL_MAX_RADIUS &&
      this.current3dPos.x >= CONST.BOARD_LEFT_X - CONST.BALL_MAX_RADIUS &&
      this.current3dPos.z <= CONST.BOARD_END + CONST.BALL_MAX_RADIUS &&
      this.current3dPos.z >= CONST.BOARD_Z - CONST.BALL_MAX_RADIUS
    ) {
      // Set bounce level to table surface
      this.bounceLevel = -CONST.BOARD_Y;

      return true;
    }

    // Set bounce level to ground
    this.bounceLevel = 0;

    return false;
  };

  /**
   * Check if ball crosses walls on background.
   *
   * @returns {boolean} Crosses or not.
   */
  ballOut = () => {
    if (
      this.current3dPos.x >= CONST.RIGHT_WALL ||
      this.current3dPos.x <= CONST.LEFT_WALL ||
      this.current3dPos.z <= 0 ||
      this.current3dPos.z >= CONST.END_WALL
    ) {
      Game.state.ballIn = true;

      return true;
    }
    Game.state.ballIn = false;

    return false;
  };
}

export default Ball;
