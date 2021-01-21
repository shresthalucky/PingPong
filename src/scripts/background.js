import * as CONST from './constants';
import { Position, projection } from './utils';

export class Floor {
  constructor() {
    const y = CONST.TABLE_HEIGHT;

    this.surface3d = {
      topLeft: new Position(CONST.LEFT_WALL, y, CONST.END_WALL),
      topRight: new Position(CONST.RIGHT_WALL, y, CONST.END_WALL),
      bottomRight: new Position(
        CONST.RIGHT_WALL,
        y,
        projection.camera.position.z + 1,
      ),
      bottomLeft: new Position(
        CONST.LEFT_WALL,
        y,
        projection.camera.position.z + 1,
      ),
    };

    this.surface2d = {
      topLeft: projection.get2dProjection(this.surface3d.topLeft),
      topRight: projection.get2dProjection(this.surface3d.topRight),
      bottomRight: projection.get2dProjection(this.surface3d.bottomRight),
      bottomLeft: projection.get2dProjection(this.surface3d.bottomLeft),
    };
  }

  // Draw floor on canvas
  draw = (ctx) => {
    ctx.beginPath();
    ctx.moveTo(this.surface2d.topLeft.x, this.surface2d.topLeft.y);
    ctx.lineTo(this.surface2d.topRight.x, this.surface2d.topRight.y);
    ctx.lineTo(this.surface2d.bottomRight.x, this.surface2d.bottomRight.y);
    ctx.lineTo(this.surface2d.bottomLeft.x, this.surface2d.bottomLeft.y);
    ctx.lineTo(this.surface2d.topLeft.x, this.surface2d.topLeft.y);
    ctx.fillStyle = '#90A4AE';
    ctx.fill();
    ctx.closePath();
  };
}

export class Wall {
  constructor() {
    const y = CONST.TABLE_HEIGHT;
    const top = projection.camera.position.y;

    this.surface3d = {
      leftWall: [
        new Position(CONST.LEFT_WALL, y, projection.camera.position.z + 1),
        new Position(CONST.LEFT_WALL, y, CONST.END_WALL),
        new Position(CONST.LEFT_WALL, top, CONST.END_WALL),
        new Position(CONST.LEFT_WALL, top, projection.camera.position.z + 1),
      ],
      backWall: [
        new Position(CONST.LEFT_WALL, y, CONST.END_WALL),
        new Position(CONST.LEFT_WALL, top, CONST.END_WALL),
        new Position(CONST.RIGHT_WALL, top, CONST.END_WALL),
        new Position(CONST.RIGHT_WALL, y, CONST.END_WALL),
      ],
      rightWall: [
        new Position(CONST.RIGHT_WALL, y, projection.camera.position.z + 1),
        new Position(CONST.RIGHT_WALL, y, CONST.END_WALL),
        new Position(CONST.RIGHT_WALL, top, CONST.END_WALL),
        new Position(CONST.RIGHT_WALL, top, projection.camera.position.z + 1),
      ],
    };

    this.surface2d = {
      leftWall: this.surface3d.leftWall.map(projection.get2dProjection),
      backWall: this.surface3d.backWall.map(projection.get2dProjection),
      rightWall: this.surface3d.rightWall.map(projection.get2dProjection),
    };
  }

  // Draw leftside wall on canvas
  drawLeftWall = (ctx) => {
    const startPosition = this.surface2d.leftWall[0];

    ctx.beginPath();
    ctx.moveTo(startPosition.x, startPosition.y);
    for (const point of this.surface2d.leftWall) {
      ctx.lineTo(point.x, point.y);
    }
    ctx.lineTo(startPosition.x, startPosition.y);
    ctx.fillStyle = '#BDBDBD';
    ctx.fill();
    ctx.closePath();
  };

  // Draw backside wall on canvas
  drawBackWall = (ctx) => {
    const startPosition = this.surface2d.backWall[0];

    ctx.beginPath();
    ctx.moveTo(startPosition.x, startPosition.y);
    for (const point of this.surface2d.backWall) {
      ctx.lineTo(point.x, point.y);
    }
    ctx.lineTo(startPosition.x, startPosition.y);
    ctx.fillStyle = '#BDBDBD';
    ctx.fill();
    ctx.closePath();
  };

  // Draw rightside wall on canvas
  drawRightWall = (ctx) => {
    const startPosition = this.surface2d.rightWall[0];

    ctx.beginPath();
    ctx.moveTo(startPosition.x, startPosition.y);
    for (const point of this.surface2d.rightWall) {
      ctx.lineTo(point.x, point.y);
    }
    ctx.lineTo(startPosition.x, startPosition.y);
    ctx.fillStyle = '#BDBDBD';
    ctx.fill();
    ctx.closePath();
  };

  // Draw walls on canvas
  draw = (ctx) => {
    this.drawLeftWall(ctx);
    this.drawBackWall(ctx);
    this.drawRightWall(ctx);
  };
}
