import { sprite } from '../assets';
import * as CONST from '../constants';
import { Position, projection } from '../utils';

class Player {
  constructor(position) {
    this.position = new Position(position.x, position.y, position.z);
    this.size = {
      long: CONST.BAT_LENGTH,
      width: CONST.BAT_WIDTH,
    };
    this.halfSize = {
      long: this.size.long / 2,
      width: this.size.width / 2,
    };
    this.surface3d;
    this.surface2d;
    this.bounce = 0;
    this.batActive = true;
    this.selfHalf;
  }

  // Set 3D position and 2D projection of Player's bat
  loadSurface = () => {
    this.surface3d = {
      topLeft: new Position(
        this.position.x - this.halfSize.width,
        this.position.y - this.halfSize.long,
        this.position.z,
      ),
      topRight: new Position(
        this.position.x + this.halfSize.width,
        this.position.y - this.halfSize.long,
        this.position.z,
      ),
      bottomRight: new Position(
        this.position.x + this.halfSize.width,
        this.position.y + this.halfSize.long,
        this.position.z,
      ),
      bottomLeft: new Position(
        this.position.x - this.halfSize.width,
        this.position.y + this.halfSize.long,
        this.position.z,
      ),
    };

    this.surface2d = {
      topLeft: projection.get2dProjection(this.surface3d.topLeft),
      topRight: projection.get2dProjection(this.surface3d.topRight),
      bottomRight: projection.get2dProjection(this.surface3d.bottomRight),
      bottomLeft: projection.get2dProjection(this.surface3d.bottomLeft),
    };
  };

  // Draw Player's bat on canvas
  draw = (ctx) => {
    this.loadSurface();

    const width = this.surface2d.topRight.get2dDistance(this.surface2d.topLeft);
    const height = this.surface2d.topLeft.get2dDistance(
      this.surface2d.bottomLeft,
    );

    ctx.save();
    ctx.beginPath();
    ctx.translate(
      this.surface2d.topLeft.x + width / 2,
      this.surface2d.topLeft.y + height / 2,
    );
    ctx.rotate(this.getRotationAngle());
    ctx.drawImage(
      sprite,
      Player.sprite.bat.sx,
      Player.sprite.bat.sy,
      Player.sprite.bat.sw,
      Player.sprite.bat.sh,
      -width / 2,
      -height / 2,
      width,
      height,
    );
    ctx.closePath();
    ctx.restore();
  };

  resetBounce = () => {
    this.bounce = 0;
  };

  /**
   * Get angle of rotation of bat as per Player's position.
   *
   * @returns {number} Angle of rotation.
   */
  getRotationAngle = () => {
    const norm =
      (CONST.HALF_CANVAS_WIDTH - this.position.x) /
      (CONST.BOARD_HALF_WIDTH + CONST.BOUNDARY_PADDING);
    const angle = Math.acos(norm) - CONST.ENV.toRadian(90);

    return angle;
  };

  // Increase ball bounce count on Player's court
  logBounce = (ball) => {
    const ballPos = ball.current3dPos;

    if (
      ballPos.x >= this.selfHalf.left &&
      ballPos.x <= this.selfHalf.right &&
      ballPos.z >= this.selfHalf.bottom &&
      ballPos.z <= this.selfHalf.top
    ) {
      this.bounce++;
    }
  };

  /**
   * Check for foul condition.
   *
   * @returns {boolean} Foul or not foul.
   */
  foul = () => {
    if (this.bounce !== 1 && this.position.z <= this.selfHalf.top) {
      return true;
    }

    return false;
  };
}

Player.sprite = {
  bat: {
    sx: 0,
    sy: 0,
    sw: 124,
    sh: 207,
  },
};

export default Player;
