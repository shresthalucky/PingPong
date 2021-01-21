import { sprite } from '../assets';
import * as CONST from '../constants';
import { Position, projection } from '../utils';

class Net {
  constructor() {
    this.width = CONST.BOARD_WIDTH;
    this.height = CONST.NET_HEIGHT;
    this.z = CONST.NET_Z;
    this.y = CONST.BOARD_Y;

    const leftX = CONST.HALF_CANVAS_WIDTH - CONST.BOARD_HALF_WIDTH;
    const rightX = CONST.HALF_CANVAS_WIDTH + CONST.BOARD_HALF_WIDTH;

    this.surface3d = {
      topLeft: new Position(leftX, this.y - this.height, this.z),
      topRight: new Position(rightX, this.y - this.height, this.z),
      bottomRight: new Position(rightX, this.y, this.z),
      bottomLeft: new Position(leftX, this.y, this.z),
      netImageLeft: new Position(leftX, this.y, this.z),
      netImageRight: new Position(leftX + Net.sprite.strip.sw, this.y, this.z),
    };

    this.surface2d = {
      topLeft: projection.get2dProjection(this.surface3d.topLeft),
      topRight: projection.get2dProjection(this.surface3d.topRight),
      bottomRight: projection.get2dProjection(this.surface3d.bottomRight),
      bottomLeft: projection.get2dProjection(this.surface3d.bottomLeft),
      netImageLeft: projection.get2dProjection(this.surface3d.netImageLeft),
      netImageRight: projection.get2dProjection(this.surface3d.netImageRight),
    };

    this.spriteWidth;
  }

  // Draw net with sprite image on canvas
  draw = (ctx) => {
    const height = this.surface2d.topLeft.get2dDistance(
      this.surface2d.bottomLeft,
    );
    const width = this.surface2d.topRight.get2dDistance(this.surface2d.topLeft);

    this.spriteWidth = this.surface2d.netImageLeft.get2dDistance(
      this.surface2d.netImageRight,
    );

    // Add one more layer to left and right of net width
    const steps = Math.floor(width / this.spriteWidth) + 2;

    for (let i = 0; i <= steps; i++) {
      if (i === 0) {
        ctx.drawImage(
          sprite,
          Net.sprite.barLeft.sx,
          Net.sprite.barLeft.sy,
          Net.sprite.barLeft.sw,
          Net.sprite.barLeft.sh,
          this.surface2d.topLeft.x - this.spriteWidth,
          this.surface2d.topLeft.y,
          this.spriteWidth,
          height,
        );
      } else if (i === steps) {
        ctx.drawImage(
          sprite,
          Net.sprite.barRight.sx,
          Net.sprite.barRight.sy,
          Net.sprite.barRight.sw,
          Net.sprite.barRight.sh,
          this.surface2d.topLeft.x + this.spriteWidth * (i - 1),
          this.surface2d.topLeft.y,
          this.spriteWidth,
          height,
        );
      } else {
        ctx.drawImage(
          sprite,
          Net.sprite.strip.sx,
          Net.sprite.strip.sy,
          Net.sprite.strip.sw,
          Net.sprite.strip.sh,
          this.surface2d.topLeft.x + this.spriteWidth * (i - 1),
          this.surface2d.topLeft.y,
          this.spriteWidth,
          height,
        );
      }
    }
  };

  // Check for collision of ball on net
  checkCollision = (ball) => {
    const playBall = {
      playerZ: ball.current3dPos.z - CONST.BALL_MAX_RADIUS,
      opponentZ: ball.current3dPos.z + CONST.BALL_MAX_RADIUS,
      topY: ball.current3dPos.y + CONST.BALL_MAX_RADIUS,
      bottomY: ball.current3dPos.y - CONST.BALL_MAX_RADIUS,
      centerX: ball.current3dPos.x + CONST.BALL_MAX_RADIUS,
    };

    if (
      ((playBall.opponentZ >= this.z - CONST.BALL_MAX_RADIUS &&
        playBall.opponentZ <= this.z + CONST.BALL_MAX_RADIUS) ||
        (playBall.playerZ <= this.z - CONST.BALL_MAX_RADIUS &&
          playBall.playerZ >= this.z + CONST.BALL_MAX_RADIUS)) &&
      playBall.bottomY <= this.height - CONST.BOARD_Y &&
      playBall.centerX <= this.surface3d.bottomRight.x + this.spriteWidth &&
      playBall.centerX >= this.surface3d.topLeft.x - this.spriteWidth
    ) {
      return true;
    }

    return false;
  };
}

Net.sprite = {
  strip: {
    sx: 127,
    sy: 0,
    sw: 37,
    sh: 90,
  },
  barLeft: {
    sx: 165,
    sy: 0,
    sw: 37,
    sh: 90,
  },
  barRight: {
    sx: 224,
    sy: 0,
    sw: 37,
    sh: 90,
  },
};

export default Net;
